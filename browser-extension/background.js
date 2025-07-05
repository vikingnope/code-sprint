// Background script for Spendy Transaction Alerts Extension
// Handles notifications and communication between content scripts and popup

class SpendyExtensionBackground {
  constructor() {
    this.setupEventListeners();
    this.transactionHistory = [];
    this.alertPreferences = {
      enabled: true,
      budgetAlerts: true,
      categorySpikes: true,
      unusualSpending: true,
      notificationSound: true,
      maxNotifications: 5
    };
  }

  setupEventListeners() {
    // Listen for messages from content scripts and popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true; // Keep message channel open for async responses
    });

    // Handle notification clicks
    chrome.notifications.onClicked.addListener((notificationId) => {
      this.handleNotificationClick(notificationId);
    });

    // Handle extension installation
    chrome.runtime.onInstalled.addListener(() => {
      this.initializeExtension();
    });
  }

  async handleMessage(request, sender, sendResponse) {
    try {
      switch (request.action) {
        case 'NEW_TRANSACTION':
          await this.handleNewTransaction(request.data);
          sendResponse({ success: true });
          break;

        case 'GENERATE_ALERT':
          await this.generateTransactionAlert(request.data);
          sendResponse({ success: true });
          break;

        case 'GET_PREFERENCES':
          const preferences = await this.getPreferences();
          sendResponse({ preferences });
          break;

        case 'UPDATE_PREFERENCES':
          await this.updatePreferences(request.preferences);
          sendResponse({ success: true });
          break;

        case 'GET_TRANSACTION_HISTORY':
          const history = await this.getTransactionHistory();
          sendResponse({ history });
          break;

        case 'MANUAL_TRIGGER':
          await this.triggerManualAlert(request.data);
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Error handling message:', error);
      sendResponse({ error: error.message });
    }
  }

  async handleNewTransaction(transactionData) {
    if (!this.alertPreferences.enabled) return;

    // Store transaction in history
    this.transactionHistory.push({
      ...transactionData,
      timestamp: Date.now(),
      id: this.generateId()
    });

    // Keep only last 100 transactions
    if (this.transactionHistory.length > 100) {
      this.transactionHistory = this.transactionHistory.slice(-100);
    }

    // Save to storage
    await this.saveTransactionHistory();

    // Check if we should generate an alert
    await this.checkAndGenerateAlert(transactionData);
  }

  async checkAndGenerateAlert(transaction) {
    const alerts = [];

    // Check for budget alerts
    if (this.alertPreferences.budgetAlerts) {
      const budgetAlert = this.checkBudgetAlert(transaction);
      if (budgetAlert) alerts.push(budgetAlert);
    }

    // Check for unusual spending
    if (this.alertPreferences.unusualSpending) {
      const unusualAlert = this.checkUnusualSpending(transaction);
      if (unusualAlert) alerts.push(unusualAlert);
    }

    // Send notifications for alerts
    for (const alert of alerts) {
      await this.sendNotification(alert);
    }
  }

  checkBudgetAlert(transaction) {
    const amount = Math.abs(transaction.amount);
    
    // Simple budget check - in a real app, this would be more sophisticated
    if (amount > 100) {
      return {
        type: 'BUDGET_WARNING',
        title: 'Large Transaction Alert',
        message: `Large transaction detected: €${amount.toFixed(2)} - ${transaction.description}`,
        severity: 'HIGH',
        transaction
      };
    }
    
    return null;
  }

  checkUnusualSpending(transaction) {
    // Check if transaction is much larger than average
    if (this.transactionHistory.length < 5) return null;

    const recentTransactions = this.transactionHistory.slice(-10);
    const avgAmount = recentTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / recentTransactions.length;
    const currentAmount = Math.abs(transaction.amount);

    if (currentAmount > avgAmount * 2 && currentAmount > 50) {
      return {
        type: 'UNUSUAL_SPENDING',
        title: 'Unusual Spending Pattern',
        message: `This transaction (€${currentAmount.toFixed(2)}) is much larger than your recent average (€${avgAmount.toFixed(2)})`,
        severity: 'MEDIUM',
        transaction
      };
    }

    return null;
  }

  async generateTransactionAlert(alertData) {
    const alert = {
      type: alertData.type || 'NEW_TRANSACTION',
      title: alertData.title || 'New Transaction',
      message: alertData.message || 'A new transaction has been detected',
      severity: alertData.severity || 'LOW',
      ...alertData
    };

    await this.sendNotification(alert);
  }

  async sendNotification(alert) {
    const notificationId = `spendy-${Date.now()}`;
    
    const notificationOptions = {
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: alert.title,
      message: alert.message,
      priority: this.getSeverityPriority(alert.severity),
      requireInteraction: alert.severity === 'CRITICAL'
    };

    await chrome.notifications.create(notificationId, notificationOptions);
    
    // Store notification for tracking
    await this.storeNotification(notificationId, alert);
  }

  async triggerManualAlert(alertData) {
    const alerts = [
      {
        type: 'BUDGET_EXCEEDED',
        title: 'Budget Exceeded!',
        message: `Your Entertainment budget has been exceeded by €25.50`,
        severity: 'CRITICAL'
      },
      {
        type: 'UNUSUAL_SPENDING',
        title: 'Unusual Spending Pattern',
        message: `Large transaction detected: €150.00 - Concert tickets`,
        severity: 'HIGH'
      },
      {
        type: 'CATEGORY_SPIKE',
        title: 'Category Spending Spike',
        message: `Food & Dining spending increased by 60% this month`,
        severity: 'MEDIUM'
      }
    ];

    const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
    await this.sendNotification(randomAlert);
  }

  getSeverityPriority(severity) {
    switch (severity) {
      case 'CRITICAL': return 2;
      case 'HIGH': return 1;
      case 'MEDIUM': return 1;
      case 'LOW': return 0;
      default: return 0;
    }
  }

  async handleNotificationClick(notificationId) {
    // Open the dashboard when notification is clicked
    await chrome.tabs.create({
      url: 'http://localhost:5173' // Default Vite dev server
    });
    
    // Clear the notification
    chrome.notifications.clear(notificationId);
  }

  async getPreferences() {
    const result = await chrome.storage.sync.get(['alertPreferences']);
    return result.alertPreferences || this.alertPreferences;
  }

  async updatePreferences(preferences) {
    this.alertPreferences = { ...this.alertPreferences, ...preferences };
    await chrome.storage.sync.set({ alertPreferences: this.alertPreferences });
  }

  async getTransactionHistory() {
    const result = await chrome.storage.local.get(['transactionHistory']);
    return result.transactionHistory || [];
  }

  async saveTransactionHistory() {
    await chrome.storage.local.set({ transactionHistory: this.transactionHistory });
  }

  async storeNotification(id, alert) {
    const notifications = await this.getStoredNotifications();
    notifications.push({ id, alert, timestamp: Date.now() });
    
    // Keep only last 20 notifications
    if (notifications.length > 20) {
      notifications.splice(0, notifications.length - 20);
    }
    
    await chrome.storage.local.set({ notifications });
  }

  async getStoredNotifications() {
    const result = await chrome.storage.local.get(['notifications']);
    return result.notifications || [];
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async initializeExtension() {
    console.log('Spendy Transaction Alerts Extension initialized');
    
    // Load preferences
    this.alertPreferences = await this.getPreferences();
    
    // Load transaction history
    this.transactionHistory = await this.getTransactionHistory();
    
    // Set up badge
    await chrome.action.setBadgeBackgroundColor({ color: '#3B82F6' });
  }
}

// Initialize the background script
const spendyExtension = new SpendyExtensionBackground();
