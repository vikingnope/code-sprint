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
    await this.checkNotificationPermissions();
    this.setupEventListeners();
    this.updateUI();
    this.checkConnection();
    this.loadRecentNotifications();
  }

  async checkNotificationPermissions() {
    try {
      // Try Chrome's getPermissionLevel API
      if (chrome.notifications && chrome.notifications.getPermissionLevel) {
        chrome.notifications.getPermissionLevel((level) => {
          console.log('Notification permission level:', level);
          if (level !== 'granted') {
            this.addNotification('Permissions Needed', 'Click "Simulate New Transaction" to enable notifications', 'warning');
          }
        });
      } else {
        console.log('Firefox/Zen detected - notification permissions will be checked when needed');
        this.addNotification('Firefox/Zen Detected', 'Notifications will be enabled when you test the extension', 'info');
      }
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
      console.log('Firefox/Zen detected - notification permissions will be checked when needed');
      this.addNotification('Firefox/Zen Detected', 'Notifications will be enabled when you test the extension', 'info');
    }
  }

  setupEventListeners() {
    // Manual trigger buttons
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
        console.log('Checking connection for tab:', activeTab.url);
        
        // Check if the current tab URL matches our expected patterns
        const isValidUrl = activeTab.url.includes('localhost') || 
                          activeTab.url.includes('vercel.app') || 
                          activeTab.url.includes('netlify.app');
        
        if (!isValidUrl) {
          this.isConnected = false;
          this.addNotification('Wrong Page', 'Please navigate to the Spendy dashboard', 'info');
          this.updateUI();
          return;
        }

        try {
          const response = await chrome.tabs.sendMessage(activeTab.id, {
            action: 'GET_PAGE_DATA'
          });

          console.log('Received response from content script:', response);

          if (response && response.isSpendyApp) {
            this.isConnected = true;
            this.addNotification('Connected to Spendy Dashboard', 'Monitoring active', 'success');
          } else {
            this.isConnected = false;
            if (response && response.debugInfo) {
              console.log('Debug info:', response.debugInfo);
            }
            this.addNotification('Not on Spendy Dashboard', 'Extension will activate when you visit the dashboard', 'info');
          }
        } catch (messageError) {
          console.log('Content script not responding, checking URL patterns...');
          
          // Fallback: check URL patterns if content script doesn't respond
          if (activeTab.url.includes('localhost:5173') || 
              activeTab.url.includes('localhost:3000') ||
              activeTab.title.toLowerCase().includes('spendy')) {
            this.isConnected = true;
            this.addNotification('Dashboard Detected', 'Extension ready (reload page if needed)', 'success');
          } else {
            this.isConnected = false;
            this.addNotification('Navigate to Dashboard', 'Go to localhost:5173 or your Spendy app', 'info');
          }
        }
      }
    } catch (error) {
      console.error('Failed to check connection:', error);
      this.isConnected = false;
      this.addNotification('Connection Error', 'Unable to check dashboard status', 'error');
    }

    this.updateUI();
  }

  async requestNotificationPermission() {
    return new Promise((resolve) => {
      console.log('Popup: Checking notification permission...');
      
      // Try Chrome's getPermissionLevel API first
      try {
        if (chrome.notifications && chrome.notifications.getPermissionLevel) {
          chrome.notifications.getPermissionLevel((level) => {
            console.log('Popup: Current notification permission level:', level);
            
            if (level === 'granted') {
              console.log('Popup: Permission already granted');
              resolve(true);
            } else {
              console.log('Popup: Requesting notification permission...');
              this.createPermissionRequestNotification(resolve);
            }
          });
        } else {
          throw new Error('getPermissionLevel not supported');
        }
      } catch (error) {
        // Firefox-based browsers (including Zen) - getPermissionLevel doesn't exist
        console.log('Popup: Firefox/Zen detected, attempting direct notification creation...');
        this.createPermissionRequestNotification(resolve);
      }
    });
  }

  createPermissionRequestNotification(resolve) {
    // Try to create a permission request notification
    chrome.notifications.create('permission-request', {
      type: 'basic',
      iconUrl: 'icons/spendy48.png',
      title: 'Enable Spendy Notifications',
      message: 'Click Allow to receive financial alerts'
    }, (notificationId) => {
      if (chrome.runtime.lastError) {
        console.error('Popup: Permission request failed:', chrome.runtime.lastError);
        // Try alternative approach - request via background script
        chrome.runtime.sendMessage({
          action: 'REQUEST_PERMISSION'
        }, (response) => {
          resolve(response?.success || false);
        });
      } else {
        console.log('Popup: Permission request notification created:', notificationId);
        // Clear the permission request notification
        setTimeout(() => {
          chrome.notifications.clear('permission-request');
        }, 3000);
        resolve(true);
      }
    });
  }

  async triggerTransactionAlert() {
    const button = document.getElementById('trigger-transaction');
    const originalText = button.textContent;
    
    button.innerHTML = '<span class="loading"></span> Simulating...';
    button.disabled = true;

    try {
      console.log('Popup: Triggering transaction simulation...');

      // First, try to request notification permissions
      const hasPermission = await this.requestNotificationPermission();
      
      if (!hasPermission) {
        this.addNotification('Permission Required', 'Notifications blocked - check browser settings', 'error');
        return;
      }

      // Use the dedicated simulation action
      const response = await chrome.runtime.sendMessage({
        action: 'SIMULATE_TRANSACTION',
        data: { 
          source: 'popup',
          timestamp: Date.now()
        }
      });

      console.log('Popup: Transaction simulation response:', response);

      if (response && response.success) {
        const amount = response.transaction?.amount || 'Unknown';
        const description = response.transaction?.description || 'Transaction';
        this.addNotification('Transaction Simulated', `€${amount} - ${description}`, 'success');
        console.log('Popup: Transaction simulation successful');
      } else {
        const errorMsg = response?.error || 'Unknown error occurred';
        this.addNotification('Failed to Simulate Transaction', errorMsg, 'error');
        console.error('Popup: Transaction simulation failed:', errorMsg);
      }
    } catch (error) {
      console.error('Popup: Failed to trigger transaction alert:', error);
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
