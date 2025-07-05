// Popup script for Spendy Transaction Alerts Extension

class SpendyPopup {
  constructor() {
    this.isConnected = false;
    this.recentNotifications = [];
    this.preferences = {
      enabled: true,
      budgetAlerts: true,
      categorySpikes: true,
      unusualSpending: true
    };
    
    this.initialize();
  }

  async initialize() {
    await this.loadPreferences();
    this.setupEventListeners();
    this.updateUI();
    this.checkConnection();
    this.loadRecentNotifications();
  }

  setupEventListeners() {
    // Manual trigger buttons
    document.getElementById('trigger-sample').addEventListener('click', () => {
      this.triggerSampleAlert();
    });

    document.getElementById('trigger-transaction').addEventListener('click', () => {
      this.triggerTransactionAlert();
    });

    // Preference checkboxes
    document.getElementById('enable-alerts').addEventListener('change', (e) => {
      this.updatePreference('enabled', e.target.checked);
    });

    document.getElementById('budget-alerts').addEventListener('change', (e) => {
      this.updatePreference('budgetAlerts', e.target.checked);
    });

    document.getElementById('unusual-spending').addEventListener('change', (e) => {
      this.updatePreference('unusualSpending', e.target.checked);
    });

    document.getElementById('category-spikes').addEventListener('change', (e) => {
      this.updatePreference('categorySpikes', e.target.checked);
    });
  }

  async loadPreferences() {
    try {
      const response = await chrome.runtime.sendMessage({ action: 'GET_PREFERENCES' });
      if (response.preferences) {
        this.preferences = response.preferences;
      }
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  }

  async updatePreference(key, value) {
    this.preferences[key] = value;
    
    try {
      await chrome.runtime.sendMessage({
        action: 'UPDATE_PREFERENCES',
        preferences: this.preferences
      });
    } catch (error) {
      console.error('Failed to update preferences:', error);
    }
  }

  updateUI() {
    // Update preference checkboxes
    document.getElementById('enable-alerts').checked = this.preferences.enabled;
    document.getElementById('budget-alerts').checked = this.preferences.budgetAlerts;
    document.getElementById('unusual-spending').checked = this.preferences.unusualSpending;
    document.getElementById('category-spikes').checked = this.preferences.categorySpikes;

    // Update connection status
    const statusElement = document.getElementById('connection-status');
    if (this.isConnected) {
      statusElement.className = 'status connected';
      statusElement.innerHTML = '<span>Dashboard Connected</span><span class="status-dot"></span>';
    } else {
      statusElement.className = 'status disconnected';
      statusElement.innerHTML = '<span>Dashboard Disconnected</span><span class="status-dot"></span>';
    }
  }

  async checkConnection() {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];

      if (activeTab) {
        const response = await chrome.tabs.sendMessage(activeTab.id, {
          action: 'GET_PAGE_DATA'
        });

        if (response && response.isSpendyApp) {
          this.isConnected = true;
          this.addNotification('Connected to Spendy Dashboard', 'Monitoring active', 'success');
        } else {
          this.isConnected = false;
          this.addNotification('Not on Spendy Dashboard', 'Navigate to dashboard for monitoring', 'info');
        }
      }
    } catch (error) {
      console.error('Failed to check connection:', error);
      this.isConnected = false;
    }

    this.updateUI();
  }

  async triggerSampleAlert() {
    const button = document.getElementById('trigger-sample');
    const originalText = button.textContent;
    
    button.innerHTML = '<span class="loading"></span> Sending...';
    button.disabled = true;

    try {
      await chrome.runtime.sendMessage({
        action: 'MANUAL_TRIGGER',
        data: { source: 'popup' }
      });

      this.addNotification('Sample Alert Sent', 'Check your notifications', 'success');
    } catch (error) {
      console.error('Failed to trigger sample alert:', error);
      this.addNotification('Failed to Send Alert', error.message, 'error');
    } finally {
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
    }
  }

  async triggerTransactionAlert() {
    const button = document.getElementById('trigger-transaction');
    const originalText = button.textContent;
    
    button.innerHTML = '<span class="loading"></span> Simulating...';
    button.disabled = true;

    try {
      // Try to trigger from content script first
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      const activeTab = tabs[0];

      if (activeTab) {
        try {
          await chrome.tabs.sendMessage(activeTab.id, {
            action: 'TRIGGER_SAMPLE_TRANSACTION'
          });
        } catch (error) {
          // If content script fails, trigger from background
          await chrome.runtime.sendMessage({
            action: 'NEW_TRANSACTION',
            data: {
              amount: Math.floor(Math.random() * 100) + 20,
              description: 'Sample Transaction from Extension',
              type: 'debit',
              date: new Date().toISOString(),
              source: 'popup_manual'
            }
          });
        }
      }

      this.addNotification('Transaction Simulated', 'New transaction alert triggered', 'success');
    } catch (error) {
      console.error('Failed to trigger transaction alert:', error);
      this.addNotification('Failed to Simulate Transaction', error.message, 'error');
    } finally {
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 1000);
    }
  }

  async loadRecentNotifications() {
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'GET_TRANSACTION_HISTORY'
      });

      if (response.history) {
        this.recentNotifications = response.history.slice(-5).reverse();
        this.updateNotificationsList();
      }
    } catch (error) {
      console.error('Failed to load recent notifications:', error);
    }
  }

  addNotification(title, message, type = 'info') {
    const notification = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date()
    };

    this.recentNotifications.unshift(notification);
    
    // Keep only last 5 notifications
    if (this.recentNotifications.length > 5) {
      this.recentNotifications = this.recentNotifications.slice(0, 5);
    }

    this.updateNotificationsList();
  }

  updateNotificationsList() {
    const container = document.getElementById('recent-notifications');
    
    if (this.recentNotifications.length === 0) {
      container.innerHTML = '<div class="notification-item">No recent notifications</div>';
      return;
    }

    container.innerHTML = this.recentNotifications.map(notification => `
      <div class="notification-item">
        <div class="notification-title">${this.escapeHtml(notification.title)}</div>
        <div class="notification-message">${this.escapeHtml(notification.message)}</div>
        <div class="notification-time">${this.formatTime(notification.timestamp)}</div>
      </div>
    `).join('');
  }

  formatTime(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now - time;

    if (diff < 60000) { // Less than 1 minute
      return 'Just now';
    } else if (diff < 3600000) { // Less than 1 hour
      const minutes = Math.floor(diff / 60000);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diff < 86400000) { // Less than 1 day
      const hours = Math.floor(diff / 3600000);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return time.toLocaleDateString();
    }
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new SpendyPopup();
});
