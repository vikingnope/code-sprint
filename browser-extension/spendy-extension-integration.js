// Extension integration utility for Spendy app
// This file can be included in the main Spendy app to improve extension compatibility

class SpendyExtensionIntegration {
  constructor() {
    this.extensionDetected = false;
    this.lastTransactionCount = 0;
    this.initialize();
  }

  initialize() {
    // Check if extension is present
    this.detectExtension();
    
    // Set up monitoring hooks
    this.setupTransactionMonitoring();
    this.setupAlertMonitoring();
    
    // Add extension-friendly data attributes
    this.addExtensionDataAttributes();
  }

  detectExtension() {
    // Check if the extension's content script is present
    if (window.spendyExtensionPresent) {
      this.extensionDetected = true;
      console.log('Spendy Extension detected and active');
    } else {
      // Try to detect extension by checking for content script
      setTimeout(() => {
        if (document.querySelector('[data-spendy-extension]')) {
          this.extensionDetected = true;
          console.log('Spendy Extension detected via DOM');
        }
      }, 1000);
    }
  }

  setupTransactionMonitoring() {
    // Add mutation observer for transaction changes
    const transactionElements = document.querySelectorAll('[data-testid*="transaction"], .transaction-list, .transaction-table');
    
    transactionElements.forEach(element => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            this.notifyExtensionOfChanges('transaction', mutation.addedNodes);
          }
        });
      });

      observer.observe(element, {
        childList: true,
        subtree: true
      });
    });
  }

  setupAlertMonitoring() {
    // Add mutation observer for alert changes
    const alertElements = document.querySelectorAll('[data-testid*="alert"], .alert-card, .alert-component');
    
    alertElements.forEach(element => {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            this.notifyExtensionOfChanges('alert', mutation.addedNodes);
          }
        });
      });

      observer.observe(element, {
        childList: true,
        subtree: true
      });
    });
  }

  addExtensionDataAttributes() {
    // Add data attributes to help extension identify elements
    setTimeout(() => {
      // Mark transaction elements
      document.querySelectorAll('.transaction-item, .transaction-row, [class*="transaction"]').forEach((element, index) => {
        element.setAttribute('data-spendy-transaction', index);
      });

      // Mark alert elements
      document.querySelectorAll('.alert, .alert-card, [class*="alert"]').forEach((element, index) => {
        element.setAttribute('data-spendy-alert', index);
      });

      // Mark the app as extension-ready
      document.body.setAttribute('data-spendy-extension-ready', 'true');
    }, 500);
  }

  notifyExtensionOfChanges(type, nodes) {
    if (!this.extensionDetected) return;

    // Dispatch custom events that the extension can listen for
    const event = new CustomEvent('spendyExtensionUpdate', {
      detail: {
        type,
        nodes: Array.from(nodes).map(node => ({
          tagName: node.tagName,
          className: node.className,
          textContent: node.textContent?.substring(0, 100) // Truncate for safety
        }))
      }
    });

    document.dispatchEvent(event);
  }

  // Method to manually trigger extension notifications
  triggerExtensionNotification(type, data) {
    if (!this.extensionDetected) return;

    const event = new CustomEvent('spendyExtensionTrigger', {
      detail: { type, data }
    });

    document.dispatchEvent(event);
  }

  // Method to send transaction data to extension
  sendTransactionToExtension(transaction) {
    this.triggerExtensionNotification('NEW_TRANSACTION', transaction);
  }

  // Method to send alert data to extension
  sendAlertToExtension(alert) {
    this.triggerExtensionNotification('NEW_ALERT', alert);
  }
}

// Initialize the integration
const spendyExtensionIntegration = new SpendyExtensionIntegration();

// Export for use in React components
if (typeof window !== 'undefined') {
  window.spendyExtensionIntegration = spendyExtensionIntegration;
}

export default spendyExtensionIntegration;
