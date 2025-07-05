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
          const result = await this.triggerManualAlert(request.data);
          sendResponse(result);
          break;

        case 'REQUEST_PERMISSION':
          const permissionResult = await this.requestNotificationPermission();
          sendResponse({ success: permissionResult });
          break;

        case 'SIMULATE_TRANSACTION':
          const simulationResult = await this.simulateTransaction(request.data);
          sendResponse(simulationResult);
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
    
    // Simple budget check - adjusted for demo purposes
    if (amount > 50) { // Lowered threshold for demo
      return {
        type: 'BUDGET_WARNING',
        title: 'Transaction Alert',
        message: `Transaction detected: €${amount.toFixed(2)} - ${transaction.description}`,
        severity: amount > 200 ? 'CRITICAL' : amount > 100 ? 'HIGH' : 'MEDIUM',
        transaction
      };
    }
    
    return null;
  }

  checkUnusualSpending(transaction) {
    // Check if transaction is much larger than average
    if (this.transactionHistory.length < 2) {
      // For first few transactions, just check if it's a large amount
      const currentAmount = Math.abs(transaction.amount);
      if (currentAmount > 150) {
        return {
          type: 'UNUSUAL_SPENDING',
          title: 'Large Transaction',
          message: `This is a relatively large transaction: €${currentAmount.toFixed(2)}`,
          severity: 'MEDIUM',
          transaction
        };
      }
      return null;
    }

    const recentTransactions = this.transactionHistory.slice(-5);
    const avgAmount = recentTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0) / recentTransactions.length;
    const currentAmount = Math.abs(transaction.amount);

    if (currentAmount > avgAmount * 1.5 && currentAmount > 75) { // Lowered thresholds for demo
      return {
        type: 'UNUSUAL_SPENDING',
        title: 'Unusual Spending Pattern',
        message: `This transaction (€${currentAmount.toFixed(2)}) is larger than your recent average (€${avgAmount.toFixed(2)})`,
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
    console.log('Spendy Extension: Attempting to send notification:', alert);
    
    // First check if notifications are enabled in preferences
    if (!this.alertPreferences.enabled) {
      console.log('Spendy Extension: Notifications disabled in preferences');
      throw new Error('Notifications are disabled in extension preferences');
    }

    // Check notification permissions
    const hasPermission = await this.checkNotificationPermission();
    if (!hasPermission) {
      console.log('Spendy Extension: No notification permission');
      throw new Error('Notification permission not granted');
    }
    
    const notificationId = `spendy-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const notificationOptions = {
      type: 'basic',
      iconUrl: 'icons/spendy48.png',
      title: alert.title || 'Spendy Alert',
      message: alert.message || 'Financial notification'
    };

    // Add Chrome-specific properties only if supported
    if (chrome.notifications && chrome.notifications.getPermissionLevel) {
      // Chrome-based browsers support these properties
      notificationOptions.priority = this.getSeverityPriority(alert.severity);
      notificationOptions.requireInteraction = alert.severity === 'CRITICAL';
      notificationOptions.silent = false;
    }
    // Firefox/Zen browsers don't support priority, requireInteraction, or silent properties

    try {
      console.log('Spendy Extension: Creating notification with options:', notificationOptions);
      
      const createdId = await new Promise((resolve, reject) => {
        chrome.notifications.create(notificationId, notificationOptions, (id) => {
          if (chrome.runtime.lastError) {
            console.error('Spendy Extension: Notification creation failed:', chrome.runtime.lastError);
            reject(new Error(chrome.runtime.lastError.message));
          } else {
            console.log('Spendy Extension: Notification created successfully:', id);
            resolve(id);
          }
        });
      });
      
      // Store notification for tracking
      await this.storeNotification(createdId, alert);
      
      return createdId;
    } catch (error) {
      console.error('Spendy Extension: Failed to create notification:', error);
      throw error;
    }
  }

  async checkNotificationPermission() {
    return new Promise((resolve) => {
      try {
        if (chrome.notifications && chrome.notifications.getPermissionLevel) {
          chrome.notifications.getPermissionLevel((level) => {
            console.log('Spendy Extension: Current permission level:', level);
            resolve(level === 'granted');
          });
        } else {
          // Firefox/Zen - assume permissions are needed and will be requested when creating notification
          console.log('Spendy Extension: Firefox/Zen detected - will request permissions when needed');
          resolve(true); // Assume true, will fail gracefully if permissions not granted
        }
      } catch (error) {
        console.log('Spendy Extension: getPermissionLevel not supported, assuming Firefox/Zen');
        resolve(true); // Assume true, will fail gracefully if permissions not granted
      }
    });
  }

  async triggerManualAlert(alertData) {
    console.log('Spendy Extension: Manual alert triggered with data:', alertData);
    
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
      },
      {
        type: 'TEST_NOTIFICATION',
        title: 'Spendy Test Alert',
        message: `Extension is working! This is a test notification sent at ${new Date().toLocaleTimeString()}`,
        severity: 'LOW'
      }
    ];

    // Select a random alert or use the first one for consistency in testing
    const selectedAlert = alertData?.useRandom 
      ? alerts[Math.floor(Math.random() * alerts.length)]
      : alerts[3]; // Use test notification by default

    console.log('Spendy Extension: Sending selected alert:', selectedAlert);
    
    try {
      const notificationId = await this.sendNotification(selectedAlert);
      console.log('Spendy Extension: Manual alert sent successfully:', notificationId);
      return { success: true, notificationId, alert: selectedAlert };
    } catch (error) {
      console.error('Spendy Extension: Failed to send manual alert:', error);
      return { success: false, error: error.message };
    }
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
    
    // Request notification permissions
    try {
      const hasPermission = await this.requestNotificationPermission();
      console.log('Notification permission granted:', hasPermission);
    } catch (error) {
      console.error('Failed to request notification permission:', error);
    }
    
    // Load preferences
    this.alertPreferences = await this.getPreferences();
    
    // Load transaction history
    this.transactionHistory = await this.getTransactionHistory();
    
    // Set up badge
    await chrome.action.setBadgeBackgroundColor({ color: '#3B82F6' });
  }

  async requestNotificationPermission() {
    return new Promise((resolve) => {
      try {
        if (chrome.notifications && chrome.notifications.getPermissionLevel) {
          chrome.notifications.getPermissionLevel((level) => {
            console.log('Current notification permission level:', level);
            if (level === 'granted') {
              resolve(true);
            } else {
              // Try to create a test notification to trigger permission request
              chrome.notifications.create('test-permission', {
                type: 'basic',
                iconUrl: 'icons/spendy48.png',
                title: 'Spendy Extension Ready',
                message: 'Notifications are now enabled!'
              }, (notificationId) => {
                if (chrome.runtime.lastError) {
                  console.error('Permission request failed:', chrome.runtime.lastError);
                  resolve(false);
                } else {
                  console.log('Permission request notification created:', notificationId);
                  // Clear the test notification after a short delay
                  setTimeout(() => {
                    chrome.notifications.clear('test-permission');
                  }, 2000);
                  resolve(true);
                }
              });
            }
          });
        } else {
          // Firefox/Zen - create a test notification to trigger permission request
          console.log('Firefox/Zen detected - creating test notification to request permissions');
          chrome.notifications.create('test-permission', {
            type: 'basic',
            iconUrl: 'icons/spendy48.png',
            title: 'Spendy Extension Ready',
            message: 'Notifications are now enabled!'
          }, (notificationId) => {
            if (chrome.runtime.lastError) {
              console.error('Permission request failed:', chrome.runtime.lastError);
              resolve(false);
            } else {
              console.log('Permission request notification created:', notificationId);
              // Clear the test notification after a short delay
              setTimeout(() => {
                chrome.notifications.clear('test-permission');
              }, 2000);
              resolve(true);
            }
          });
        }
      } catch (error) {
        console.error('Error requesting notification permission:', error);
        resolve(false);
      }
    });
  }

  async simulateTransaction(data) {
    console.log('Spendy Extension: Simulating transaction with data:', data);
    
    try {
      // Create a realistic transaction that will trigger alerts
      const transactionAmount = data?.amount || (Math.floor(Math.random() * 200) + 150); // €150-€349
      const descriptions = [
        'Large Purchase - Electronics Store',
        'Restaurant Bill - Premium Dining',
        'Online Shopping - Fashion',
        'Grocery Store - Weekly Shopping',
        'Gas Station - Fuel Purchase',
        'Coffee Shop - Daily Coffee',
        'Pharmacy - Medical Supplies'
      ];
      
      const simulatedTransaction = {
        amount: transactionAmount,
        description: descriptions[Math.floor(Math.random() * descriptions.length)],
        type: 'debit',
        date: new Date().toISOString(),
        source: 'simulation',
        category: 'Shopping'
      };

      console.log('Spendy Extension: Created simulated transaction:', simulatedTransaction);

      // Process the transaction through normal flow
      await this.handleNewTransaction(simulatedTransaction);

      // Also send a direct notification for the transaction
      const transactionAlert = {
        type: 'NEW_TRANSACTION',
        title: 'New Transaction Detected',
        message: `€${transactionAmount.toFixed(2)} - ${simulatedTransaction.description}`,
        severity: transactionAmount > 200 ? 'HIGH' : 'MEDIUM',
        transaction: simulatedTransaction
      };

      await this.sendNotification(transactionAlert);

      return { 
        success: true, 
        transaction: simulatedTransaction,
        message: 'Transaction simulated and notification sent'
      };
    } catch (error) {
      console.error('Spendy Extension: Failed to simulate transaction:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

// Initialize the background script
const spendyExtension = new SpendyExtensionBackground();
