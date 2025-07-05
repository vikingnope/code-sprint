// Content script for Spendy Transaction Alerts Extension
// Monitors the financial dashboard for new transactions and alerts

class SpendyContentScript {
  constructor() {
    this.isSpendyApp = this.detectSpendyApp();
    this.lastTransactionCount = 0;
    this.observerSetup = false;
    
    if (this.isSpendyApp) {
      this.initialize();
    }
  }

  detectSpendyApp() {
    // Check if we're on the Spendy financial dashboard
    const title = document.title.toLowerCase();
    const bodyText = document.body?.textContent?.toLowerCase() || '';
    const url = window.location.href.toLowerCase();
    
    // Check multiple indicators for Spendy app
    const indicators = [
      title.includes('spendy'),
      bodyText.includes('spendy'),
      url.includes('localhost:5173'), // Common Vite dev server
      url.includes('localhost:3000'), // Common React dev server
      document.querySelector('[data-testid*="spendy"]'),
      document.querySelector('.spendy'),
      document.querySelector('*[class*="spendy"]'),
      // Check for common financial dashboard elements
      bodyText.includes('dashboard'),
      bodyText.includes('transaction'),
      bodyText.includes('expense'),
      bodyText.includes('budget'),
      // Check for navigation elements
      document.querySelector('nav'),
      document.querySelector('[class*="nav"]'),
      // Check for React root
      document.querySelector('#root')
    ];
    
    // Return true if we find at least 2 indicators
    const foundIndicators = indicators.filter(Boolean).length;
    console.log('Spendy Extension: Detection indicators found:', foundIndicators);
    
    return foundIndicators >= 2;
  }

  initialize() {
    console.log('Spendy Extension: Initialized on financial dashboard');
    console.log('Spendy Extension: Current URL:', window.location.href);
    console.log('Spendy Extension: Page title:', document.title);
    
    // Wait for the app to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.setupMonitoring();
      });
    } else {
      this.setupMonitoring();
    }

    // Listen for messages from popup
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      this.handleMessage(request, sender, sendResponse);
      return true;
    });
  }

  setupMonitoring() {
    // Monitor for transaction table changes
    this.observeTransactionTable();
    
    // Monitor for alert components
    this.observeAlertComponents();
    
    // Set up periodic checks
    this.setupPeriodicChecks();
    
    // Monitor for React state changes (if accessible)
    this.monitorReactState();
    
    // Listen for custom events from the main app
    this.setupCustomEventListeners();
    
    // Mark extension as present
    this.markExtensionPresent();
  }

  observeTransactionTable() {
    // Look for transaction table or list
    const transactionSelectors = [
      '[data-testid*="transaction"]',
      '.transaction-list',
      '.transaction-table',
      'table tbody', // Generic table body
      '[class*="transaction"]',
      '[class*="recent"]'
    ];

    transactionSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        this.setupObserver(element, 'transactions');
      }
    });
  }

  observeAlertComponents() {
    // Look for alert components
    const alertSelectors = [
      '[data-testid*="alert"]',
      '.alert',
      '[class*="alert"]',
      '.notification',
      '[class*="notification"]'
    ];

    alertSelectors.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        this.setupObserver(element, 'alerts');
      }
    });
  }

  setupObserver(element, type) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          this.handleDOMChange(type, mutation.addedNodes);
        }
      });
    });

    observer.observe(element, {
      childList: true,
      subtree: true
    });

    this.observerSetup = true;
  }

  handleDOMChange(type, addedNodes) {
    if (type === 'transactions') {
      this.checkForNewTransactions(addedNodes);
    } else if (type === 'alerts') {
      this.checkForNewAlerts(addedNodes);
    }
  }

  checkForNewTransactions(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        // Look for transaction-like elements
        const transactionElements = node.querySelectorAll ? 
          node.querySelectorAll('[class*="transaction"], tr, .list-item') : 
          [];

        transactionElements.forEach(element => {
          const transaction = this.extractTransactionData(element);
          if (transaction) {
            this.notifyNewTransaction(transaction);
          }
        });
      }
    });
  }

  extractTransactionData(element) {
    try {
      const text = element.textContent || '';
      const amountMatch = text.match(/[€$£]\s?(\d+(?:\.\d{2})?)/);
      const descriptionMatch = text.match(/([A-Z][A-Z\s\.\-\'#\d]+)/);

      if (amountMatch && descriptionMatch) {
        return {
          amount: parseFloat(amountMatch[1]),
          description: descriptionMatch[1].trim(),
          type: text.includes('-') || text.includes('debit') ? 'debit' : 'credit',
          date: new Date().toISOString(),
          source: 'dom_monitoring'
        };
      }
    } catch (error) {
      console.error('Error extracting transaction data:', error);
    }
    return null;
  }

  checkForNewAlerts(nodes) {
    nodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const alertElements = node.querySelectorAll ? 
          node.querySelectorAll('[class*="alert"], .notification') : 
          [];

        alertElements.forEach(element => {
          const alert = this.extractAlertData(element);
          if (alert) {
            this.notifyNewAlert(alert);
          }
        });
      }
    });
  }

  extractAlertData(element) {
    try {
      const text = element.textContent || '';
      const titleElement = element.querySelector('h3, h4, .alert-title, [class*="title"]');
      const messageElement = element.querySelector('p, .alert-message, [class*="message"]');

      return {
        title: titleElement ? titleElement.textContent.trim() : 'Financial Alert',
        message: messageElement ? messageElement.textContent.trim() : text.trim(),
        severity: this.determineSeverity(element),
        source: 'dom_monitoring'
      };
    } catch (error) {
      console.error('Error extracting alert data:', error);
    }
    return null;
  }

  determineSeverity(element) {
    const classList = element.className.toLowerCase();
    if (classList.includes('critical') || classList.includes('danger') || classList.includes('red')) {
      return 'CRITICAL';
    } else if (classList.includes('high') || classList.includes('warning') || classList.includes('orange')) {
      return 'HIGH';
    } else if (classList.includes('medium') || classList.includes('yellow')) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  setupPeriodicChecks() {
    // Check for changes every 30 seconds
    setInterval(() => {
      this.performPeriodicCheck();
    }, 30000);
  }

  performPeriodicCheck() {
    // Count current transactions
    const transactionElements = document.querySelectorAll(
      '[data-testid*="transaction"], .transaction-list > *, .transaction-table tbody tr'
    );

    if (transactionElements.length > this.lastTransactionCount) {
      // New transactions detected
      const newCount = transactionElements.length - this.lastTransactionCount;
      this.notifyTransactionCountChange(newCount);
      this.lastTransactionCount = transactionElements.length;
    }
  }

  monitorReactState() {
    // Try to tap into React dev tools if available
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      // This is a simplified approach - in a real implementation,
      // you might need more sophisticated React state monitoring
      console.log('React DevTools detected - enhanced monitoring available');
    }
  }

  notifyNewTransaction(transaction) {
    chrome.runtime.sendMessage({
      action: 'NEW_TRANSACTION',
      data: transaction
    }).catch(error => {
      console.error('Failed to send transaction notification:', error);
    });
  }

  notifyNewAlert(alert) {
    chrome.runtime.sendMessage({
      action: 'GENERATE_ALERT',
      data: alert
    }).catch(error => {
      console.error('Failed to send alert notification:', error);
    });
  }

  notifyTransactionCountChange(newCount) {
    chrome.runtime.sendMessage({
      action: 'NEW_TRANSACTION',
      data: {
        amount: 0,
        description: `${newCount} new transaction${newCount > 1 ? 's' : ''} detected`,
        type: 'info',
        date: new Date().toISOString(),
        source: 'count_change'
      }
    }).catch(error => {
      console.error('Failed to send transaction count notification:', error);
    });
  }

  handleMessage(request, sender, sendResponse) {
    console.log('Spendy Extension: Received message:', request.action);
    
    switch (request.action) {
      case 'GET_PAGE_DATA':
        const pageData = {
          isSpendyApp: this.isSpendyApp,
          transactionCount: this.lastTransactionCount,
          url: window.location.href,
          title: document.title,
          debugInfo: {
            hasNavigation: !!document.querySelector('nav'),
            hasRoot: !!document.querySelector('#root'),
            bodyContainsSpendyText: document.body?.textContent?.toLowerCase().includes('spendy'),
            titleContainsSpendyText: document.title.toLowerCase().includes('spendy')
          }
        };
        console.log('Spendy Extension: Sending page data:', pageData);
        sendResponse(pageData);
        break;

      case 'TRIGGER_SAMPLE_TRANSACTION':
        this.triggerSampleTransaction();
        sendResponse({ success: true });
        break;

      case 'EXTRACT_CURRENT_DATA':
        const data = this.extractCurrentPageData();
        sendResponse({ data });
        break;

      default:
        sendResponse({ error: 'Unknown action' });
    }
  }

  triggerSampleTransaction() {
    // Simulate a new transaction for demonstration
    const sampleTransaction = {
      amount: Math.floor(Math.random() * 100) + 10,
      description: 'Sample Transaction - Manual Trigger',
      type: 'debit',
      date: new Date().toISOString(),
      source: 'manual_trigger'
    };

    this.notifyNewTransaction(sampleTransaction);
  }

  extractCurrentPageData() {
    // Extract current page data for analysis
    const transactions = [];
    const alerts = [];

    // Extract visible transactions
    document.querySelectorAll('[data-testid*="transaction"], .transaction-list > *, .transaction-table tbody tr').forEach(element => {
      const transaction = this.extractTransactionData(element);
      if (transaction) {
        transactions.push(transaction);
      }
    });

    // Extract visible alerts
    document.querySelectorAll('[data-testid*="alert"], .alert, [class*="alert"]').forEach(element => {
      const alert = this.extractAlertData(element);
      if (alert) {
        alerts.push(alert);
      }
    });

    return {
      transactions,
      alerts,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };
  }

  setupCustomEventListeners() {
    // Listen for custom events from the main Spendy app
    document.addEventListener('spendyExtensionUpdate', (event) => {
      const { type, nodes } = event.detail;
      
      if (type === 'transaction') {
        console.log('Extension: Received transaction update from main app');
        this.handleCustomTransactionUpdate(nodes);
      } else if (type === 'alert') {
        console.log('Extension: Received alert update from main app');
        this.handleCustomAlertUpdate(nodes);
      }
    });

    document.addEventListener('spendyExtensionTrigger', (event) => {
      const { type, data } = event.detail;
      
      if (type === 'NEW_TRANSACTION') {
        this.notifyNewTransaction(data);
      } else if (type === 'NEW_ALERT') {
        this.notifyNewAlert(data);
      }
    });
  }

  handleCustomTransactionUpdate(nodes) {
    // Process transaction updates from the main app
    nodes.forEach(node => {
      if (node.textContent) {
        const transaction = this.parseTransactionFromText(node.textContent);
        if (transaction) {
          this.notifyNewTransaction(transaction);
        }
      }
    });
  }

  handleCustomAlertUpdate(nodes) {
    // Process alert updates from the main app
    nodes.forEach(node => {
      if (node.textContent) {
        const alert = this.parseAlertFromText(node.textContent);
        if (alert) {
          this.notifyNewAlert(alert);
        }
      }
    });
  }

  parseTransactionFromText(text) {
    // Parse transaction data from text content
    const amountMatch = text.match(/[€$£]\s?(\d+(?:\.\d{2})?)/);
    const descriptionMatch = text.match(/([A-Za-z][A-Za-z\s\.\-\'#\d]{5,})/);

    if (amountMatch) {
      return {
        amount: parseFloat(amountMatch[1]),
        description: descriptionMatch ? descriptionMatch[1].trim() : 'Transaction',
        type: text.includes('-') ? 'debit' : 'credit',
        date: new Date().toISOString(),
        source: 'custom_event'
      };
    }
    return null;
  }

  parseAlertFromText(text) {
    // Parse alert data from text content
    return {
      title: text.length > 50 ? text.substring(0, 50) + '...' : text,
      message: text,
      severity: this.determineSeverityFromText(text),
      source: 'custom_event'
    };
  }

  determineSeverityFromText(text) {
    const lowercaseText = text.toLowerCase();
    if (lowercaseText.includes('critical') || lowercaseText.includes('exceeded')) {
      return 'CRITICAL';
    } else if (lowercaseText.includes('warning') || lowercaseText.includes('high')) {
      return 'HIGH';
    } else if (lowercaseText.includes('spike') || lowercaseText.includes('increase')) {
      return 'MEDIUM';
    }
    return 'LOW';
  }

  markExtensionPresent() {
    // Mark that the extension is present for the main app to detect
    window.spendyExtensionPresent = true;
    document.body.setAttribute('data-spendy-extension', 'active');
  }
}

// Initialize the content script
const spendyContentScript = new SpendyContentScript();
