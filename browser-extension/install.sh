#!/bin/bash

# Installation and testing script for Spendy Transaction Alerts Browser Extension

echo "🚀 Spendy Transaction Alerts Extension Setup"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "manifest.json" ]; then
    echo "❌ Error: Please run this script from the browser-extension directory"
    echo "Usage: cd browser-extension && chmod +x install.sh && ./install.sh"
    exit 1
fi

echo "✅ Found extension files"

# Check if the main Spendy app is running
echo "🔍 Checking if Spendy dashboard is running..."
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo "✅ Spendy dashboard is running at http://localhost:5173"
else
    echo "⚠️  Spendy dashboard is not running at http://localhost:5173"
    echo "   Please start the dashboard first with: cd .. && pnpm dev"
    echo "   Then you can continue with the extension installation"
fi

echo ""
echo "📋 Installation Instructions:"
echo "1. Open Chrome/Edge/Brave browser"
echo "2. Go to chrome://extensions/"
echo "3. Enable 'Developer mode' (toggle in top right)"
echo "4. Click 'Load unpacked'"
echo "5. Select this folder: $(pwd)"
echo "6. The extension should now appear in your extensions list"
echo ""
echo "🔧 Testing Instructions:"
echo "1. Navigate to http://localhost:5173 (Spendy dashboard)"
echo "2. Click the extension icon in your browser toolbar"
echo "3. Click 'Send Sample Alert' to test notifications"
echo "4. Click 'Simulate New Transaction' to test transaction monitoring"
echo ""
echo "📁 Extension Files:"
echo "- manifest.json: Extension configuration"
echo "- background.js: Service worker for notifications"
echo "- content.js: Dashboard monitoring"
echo "- popup.html/js: User interface"
echo "- icons/: Extension icons"
echo ""
echo "🎯 Ready to install! Follow the instructions above."

# Create a simple test file to verify the extension works
echo "Creating test verification file..."
cat > test-extension.html << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Spendy Extension Test</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        .test-button { padding: 10px 20px; margin: 10px; background: #3B82F6; color: white; border: none; border-radius: 5px; cursor: pointer; }
        .result { margin: 10px 0; padding: 10px; background: #f0f0f0; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>Spendy Extension Test Page</h1>
    <p>This page can be used to test the extension's content script functionality.</p>
    
    <button class="test-button" onclick="simulateTransaction()">Simulate Transaction</button>
    <button class="test-button" onclick="simulateAlert()">Simulate Alert</button>
    
    <div id="results" class="result">
        <h3>Test Results:</h3>
        <div id="output">Click the buttons above to test the extension</div>
    </div>

    <script>
        function simulateTransaction() {
            // Create a fake transaction element
            const transaction = document.createElement('div');
            transaction.className = 'transaction-item';
            transaction.innerHTML = '€45.67 - Test Restaurant Purchase';
            document.body.appendChild(transaction);
            
            document.getElementById('output').innerHTML += '<br>✅ Simulated transaction added to DOM';
        }

        function simulateAlert() {
            // Create a fake alert element
            const alert = document.createElement('div');
            alert.className = 'alert high';
            alert.innerHTML = '<h4>Budget Alert</h4><p>Test alert message</p>';
            document.body.appendChild(alert);
            
            document.getElementById('output').innerHTML += '<br>✅ Simulated alert added to DOM';
        }
    </script>
</body>
</html>
EOF

echo "✅ Created test-extension.html for testing"
echo ""
echo "🧪 To test with the test file:"
echo "1. Open test-extension.html in your browser"
echo "2. Install the extension"
echo "3. Click the test buttons to simulate transactions and alerts"
echo ""
echo "Happy testing! 🎉"
