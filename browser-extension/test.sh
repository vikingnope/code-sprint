#!/bin/bash

# Comprehensive test script for Spendy Transaction Alerts Extension
# This script helps test all functionality and demonstrates the extension capabilities

echo "🧪 Spendy Transaction Alerts Extension - Test Suite"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    print_error "Please run this script from the browser-extension directory"
    exit 1
fi

print_status "Found extension files"

# Check extension files
echo ""
echo "📁 Checking Extension Files:"
echo "=============================="

files=("manifest.json" "background.js" "content.js" "popup.html" "popup.js")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        print_status "$file exists"
    else
        print_error "$file missing"
    fi
done

# Check icon files
echo ""
echo "🎨 Checking Icon Files:"
echo "======================"

icon_files=("icons/spendy16.png" "icons/spendy32.png" "icons/spendy48.png" "icons/spendy128.png")
for icon in "${icon_files[@]}"; do
    if [ -f "$icon" ]; then
        print_status "$icon exists"
    else
        print_warning "$icon missing (extension will work but may show default icon)"
    fi
done

# Check if main app is running
echo ""
echo "🔍 Checking Main Application:"
echo "============================"

if curl -s http://localhost:5173 > /dev/null 2>&1; then
    print_status "Spendy dashboard running at http://localhost:5173"
    DASHBOARD_RUNNING=true
else
    print_warning "Spendy dashboard not running at http://localhost:5173"
    print_info "Start with: cd .. && pnpm dev"
    DASHBOARD_RUNNING=false
fi

# Create test files
echo ""
echo "📄 Creating Test Files:"
echo "======================"

# Create a simple test HTML file
cat > extension-test.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spendy Extension Test Page</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .button {
            background: #3B82F6;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            cursor: pointer;
            margin: 10px 5px;
            font-size: 14px;
            transition: background 0.2s;
        }
        .button:hover {
            background: #2563EB;
        }
        .button.secondary {
            background: #10B981;
        }
        .button.secondary:hover {
            background: #059669;
        }
        .transaction-list {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .transaction-item {
            padding: 10px;
            border-bottom: 1px solid #e9ecef;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .transaction-item:last-child {
            border-bottom: none;
        }
        .alert {
            padding: 15px;
            border-radius: 6px;
            margin: 10px 0;
            border-left: 4px solid;
        }
        .alert.high {
            background: #fef2f2;
            border-left-color: #ef4444;
            color: #dc2626;
        }
        .alert.medium {
            background: #fffbeb;
            border-left-color: #f59e0b;
            color: #d97706;
        }
        .alert.low {
            background: #f0f9ff;
            border-left-color: #3b82f6;
            color: #2563eb;
        }
        .status {
            padding: 10px;
            border-radius: 6px;
            margin: 10px 0;
            font-size: 14px;
        }
        .status.success {
            background: #ecfdf5;
            color: #059669;
        }
        .status.warning {
            background: #fffbeb;
            color: #d97706;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 Spendy Extension Test Page</h1>
        <p>This page simulates the Spendy dashboard to test the browser extension functionality.</p>
        
        <div class="status" id="extension-status">
            <strong>Extension Status:</strong> <span id="extension-detected">Checking...</span>
        </div>

        <h2>🎛️ Test Controls</h2>
        <button class="button" onclick="addTransaction()">Add New Transaction</button>
        <button class="button" onclick="addAlert()">Add New Alert</button>
        <button class="button secondary" onclick="triggerBudgetAlert()">Trigger Budget Alert</button>
        <button class="button secondary" onclick="triggerSpendingAlert()">Trigger Spending Alert</button>
        
        <h2>💳 Recent Transactions</h2>
        <div class="transaction-list" id="transaction-list">
            <div class="transaction-item">
                <span>Coffee Shop - Morning Coffee</span>
                <span>-€4.50</span>
            </div>
            <div class="transaction-item">
                <span>Grocery Store - Weekly Shopping</span>
                <span>-€67.23</span>
            </div>
            <div class="transaction-item">
                <span>Salary Deposit</span>
                <span>+€2,500.00</span>
            </div>
        </div>

        <h2>🚨 Active Alerts</h2>
        <div id="alert-container">
            <div class="alert low">
                <strong>Info:</strong> Extension monitoring is active
            </div>
        </div>

        <h2>📊 Test Results</h2>
        <div id="test-results" class="status warning">
            <strong>Status:</strong> Ready to test - Use the buttons above to simulate transactions and alerts
        </div>
    </div>

    <script>
        let transactionCount = 3;
        let alertCount = 1;

        // Check for extension
        function checkExtension() {
            const detected = document.body.hasAttribute('data-spendy-extension') || window.spendyExtensionPresent;
            const status = document.getElementById('extension-detected');
            const statusContainer = document.getElementById('extension-status');
            
            if (detected) {
                status.textContent = 'Extension Detected ✅';
                statusContainer.className = 'status success';
            } else {
                status.textContent = 'Extension Not Detected ❌';
                statusContainer.className = 'status warning';
            }
        }

        // Add a new transaction
        function addTransaction() {
            const transactions = [
                'Restaurant - Lunch',
                'Gas Station - Fuel',
                'Online Store - Purchase',
                'ATM - Cash Withdrawal',
                'Pharmacy - Medication',
                'Bookstore - Books',
                'Cinema - Movie Tickets'
            ];
            
            const amounts = [15.50, 45.20, 89.99, 100.00, 23.45, 34.67, 12.90];
            const randomIndex = Math.floor(Math.random() * transactions.length);
            
            const transactionList = document.getElementById('transaction-list');
            const newTransaction = document.createElement('div');
            newTransaction.className = 'transaction-item';
            newTransaction.innerHTML = `
                <span>${transactions[randomIndex]}</span>
                <span>-€${amounts[randomIndex]}</span>
            `;
            
            transactionList.appendChild(newTransaction);
            transactionCount++;
            
            updateTestResults(`Added transaction: ${transactions[randomIndex]} (€${amounts[randomIndex]})`);
        }

        // Add a new alert
        function addAlert() {
            const alerts = [
                { severity: 'high', title: 'Budget Warning', message: 'Entertainment spending is 85% of budget' },
                { severity: 'medium', title: 'Category Spike', message: 'Food spending increased by 40% this month' },
                { severity: 'low', title: 'Savings Opportunity', message: 'You can save €50 by reducing subscription costs' }
            ];
            
            const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
            const alertContainer = document.getElementById('alert-container');
            const newAlert = document.createElement('div');
            newAlert.className = `alert ${randomAlert.severity}`;
            newAlert.innerHTML = `<strong>${randomAlert.title}:</strong> ${randomAlert.message}`;
            
            alertContainer.appendChild(newAlert);
            alertCount++;
            
            updateTestResults(`Added alert: ${randomAlert.title} (${randomAlert.severity})`);
        }

        // Trigger budget alert
        function triggerBudgetAlert() {
            const alertContainer = document.getElementById('alert-container');
            const budgetAlert = document.createElement('div');
            budgetAlert.className = 'alert high';
            budgetAlert.innerHTML = '<strong>Budget Exceeded!</strong> Your Entertainment budget has been exceeded by €25.50';
            
            alertContainer.appendChild(budgetAlert);
            updateTestResults('Triggered budget exceeded alert');
        }

        // Trigger spending alert
        function triggerSpendingAlert() {
            const alertContainer = document.getElementById('alert-container');
            const spendingAlert = document.createElement('div');
            spendingAlert.className = 'alert medium';
            spendingAlert.innerHTML = '<strong>Unusual Spending:</strong> Large transaction detected: €150.00 - Concert tickets';
            
            alertContainer.appendChild(spendingAlert);
            updateTestResults('Triggered unusual spending alert');
        }

        // Update test results
        function updateTestResults(message) {
            const results = document.getElementById('test-results');
            results.innerHTML = `<strong>Latest Action:</strong> ${message}`;
            results.className = 'status success';
        }

        // Initialize
        setTimeout(checkExtension, 1000);
        setInterval(checkExtension, 5000); // Check every 5 seconds
    </script>
</body>
</html>
EOF

print_status "Created extension-test.html"

# Create a simple manifest validator
cat > validate-manifest.js << 'EOF'
const fs = require('fs');

try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    console.log('✅ Manifest JSON is valid');
    console.log(`📋 Extension Name: ${manifest.name}`);
    console.log(`📋 Version: ${manifest.version}`);
    console.log(`📋 Manifest Version: ${manifest.manifest_version}`);
    
    // Check required fields
    const required = ['name', 'version', 'manifest_version'];
    const missing = required.filter(field => !manifest[field]);
    
    if (missing.length > 0) {
        console.log(`❌ Missing required fields: ${missing.join(', ')}`);
    } else {
        console.log('✅ All required fields present');
    }
    
    // Check permissions
    if (manifest.permissions) {
        console.log(`🔐 Permissions: ${manifest.permissions.join(', ')}`);
    }
    
    // Check host permissions
    if (manifest.host_permissions) {
        console.log(`🌐 Host Permissions: ${manifest.host_permissions.join(', ')}`);
    }
    
} catch (error) {
    console.log('❌ Manifest validation failed:', error.message);
}
EOF

print_status "Created manifest validator"

# Run tests
echo ""
echo "🧪 Running Tests:"
echo "================"

# Test 1: Manifest validation
print_info "Test 1: Validating manifest.json"
if command -v node > /dev/null 2>&1; then
    node validate-manifest.js
else
    print_warning "Node.js not available, skipping manifest validation"
fi

# Test 2: File size check
print_info "Test 2: Checking file sizes"
for file in manifest.json background.js content.js popup.html popup.js; do
    if [ -f "$file" ]; then
        size=$(wc -c < "$file")
        if [ $size -gt 0 ]; then
            print_status "$file: ${size} bytes"
        else
            print_error "$file: Empty file"
        fi
    fi
done

# Test 3: Basic syntax check
print_info "Test 3: Basic syntax checks"
if command -v node > /dev/null 2>&1; then
    for jsfile in background.js content.js popup.js; do
        if [ -f "$jsfile" ]; then
            if node -c "$jsfile" 2>/dev/null; then
                print_status "$jsfile: Syntax OK"
            else
                print_error "$jsfile: Syntax Error"
            fi
        fi
    done
else
    print_warning "Node.js not available, skipping syntax checks"
fi

# Installation instructions
echo ""
echo "🚀 Installation Instructions:"
echo "============================"
echo "1. Open Chrome/Edge/Brave browser"
echo "2. Go to chrome://extensions/"
echo "3. Enable 'Developer mode' (toggle in top right)"
echo "4. Click 'Load unpacked'"
echo "5. Select this folder: $(pwd)"
echo "6. The extension should now appear in your extensions list"

echo ""
echo "🧪 Testing Instructions:"
echo "======================="
echo "1. Install the extension (see above)"
if [ "$DASHBOARD_RUNNING" = true ]; then
    echo "2. Navigate to http://localhost:5173 (Spendy dashboard)"
else
    echo "2. Start the Spendy dashboard: cd .. && pnpm dev"
    echo "3. Navigate to http://localhost:5173"
fi
echo "4. OR open extension-test.html in your browser for testing"
echo "5. Click the extension icon in your browser toolbar"
echo "6. Test the following features:"
echo "   - Click 'Send Sample Alert' to test notifications"
echo "   - Click 'Simulate New Transaction' to test transaction monitoring"
echo "   - Toggle preferences to test settings"

echo ""
echo "🔍 Debugging Tips:"
echo "================="
echo "- Check browser console for errors (F12)"
echo "- Go to chrome://extensions/ to see extension errors"
echo "- Use 'Inspect views: service worker' to debug background script"
echo "- Check if notifications are enabled in browser settings"

echo ""
echo "📋 Test Checklist:"
echo "================="
echo "□ Extension loads without errors"
echo "□ Extension icon appears in toolbar"
echo "□ Popup opens when clicking extension icon"
echo "□ 'Send Sample Alert' triggers browser notification"
echo "□ 'Simulate New Transaction' works"
echo "□ Preferences can be toggled"
echo "□ Extension detects when on Spendy dashboard"
echo "□ Manual triggers work from popup"
echo "□ Notifications can be clicked to open dashboard"

echo ""
print_status "Test setup complete! 🎉"
print_info "Open extension-test.html to start testing"

# Clean up
rm -f validate-manifest.js
