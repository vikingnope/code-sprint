# Spendy Transaction Alerts Browser Extension

A browser extension that provides real-time notifications for financial transactions and alerts detected on the Spendy dashboard.

## Features

- **Real-time Browser Notifications**: Get instant **system-level notifications** that pop up from your browser
- **Manual Triggers**: Test the notification system with sample alerts
- **Customizable Preferences**: Enable/disable different types of alerts
- **Dashboard Integration**: Automatically detects when you're on the Spendy financial dashboard
- **Transaction Monitoring**: Monitors for new transactions and spending patterns

## How Notifications Work

### 🔔 Browser Notifications (Primary)

- **System-level notifications** that appear outside the browser window
- **Pop up from your OS notification area** (Windows Action Center, macOS Notification Center)
- **Show even when browser is minimized** or you're in another tab
- **Clickable** - clicking the notification opens the Spendy dashboard
- **Display the Spendy icon** and alert message

### 📱 Extension Popup (Secondary)

- **Internal status updates** shown in the extension popup
- **Recent notifications history** for reference
- **Connection status** and manual testing buttons

## Installation

### Developer Installation (Chrome/Edge/Brave)

1. **Clone/Download the Extension**
   ```bash
   # The extension is located in the browser-extension folder
   cd /path/to/code-sprint/browser-extension
   ```

2. **Open Chrome Extension Management**
   - Go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)

3. **Load the Extension**
   - Click "Load unpacked"
   - Select the `browser-extension` folder
   - The extension should now appear in your extensions list

4. **Pin the Extension**
   - Click the extensions icon in the Chrome toolbar
   - Pin the "Spendy Transaction Alerts" extension for easy access

### Firefox Installation

1. **Open Firefox Add-ons**
   - Go to `about:debugging#/runtime/this-firefox`
   - Click "Load Temporary Add-on"

2. **Load the Extension**
   - Navigate to the `browser-extension` folder
   - Select the `manifest.json` file

## Usage

### Basic Usage

1. **Start the Spendy Dashboard**
   - Run your Spendy app (`pnpm dev` in the main project)
   - Navigate to `http://localhost:5173` (or your dashboard URL)

2. **Open the Extension**
   - Click the Spendy extension icon in your browser toolbar
   - The popup will show connection status and controls

3. **Test Notifications**
   - Click "Send Sample Alert" to test the notification system
   - Click "Simulate New Transaction" to trigger a transaction alert
   - **You should see browser notifications pop up** from your OS notification area

4. **Enable Notifications (Important!)**
   - If no browser notifications appear, check the address bar for a 🔔 icon
   - Click it and select "Allow" for notifications
   - Or go to `chrome://settings/content/notifications` and ensure notifications are enabled

### Manual Testing

The extension provides several ways to test notifications:

1. **Sample Alerts**: Sends pre-defined alert types (budget exceeded, unusual spending, category spikes)
2. **Transaction Simulation**: Creates fake transactions to test the monitoring system
3. **Automatic Monitoring**: Detects changes in the dashboard automatically

### Notification Types

The extension can send notifications for:

- **Budget Alerts**: When spending exceeds budget thresholds
- **Unusual Spending**: When transactions are much larger than average
- **Category Spikes**: When spending in a category increases significantly
- **New Transactions**: When new transactions are detected

## Configuration

### Preferences

Use the extension popup to configure:

- **Enable/Disable All Alerts**: Master switch for all notifications
- **Budget Alerts**: Notifications for budget-related issues
- **Unusual Spending Alerts**: Notifications for unusual spending patterns
- **Category Spike Alerts**: Notifications for category spending increases

### Customization

You can modify the extension by editing:

- `manifest.json`: Extension permissions and configuration
- `background.js`: Alert logic and notification handling
- `content.js`: Dashboard monitoring and data extraction
- `popup.html/js`: User interface and preferences

## Troubleshooting

### Extension Shows "Dashboard Disconnected"

If the extension shows "Dashboard Disconnected" even when you're on the Spendy dashboard:

1. **Check the URL**
   - Make sure you're on `http://localhost:5173` (or your app's URL)
   - The extension looks for specific URL patterns like `localhost:5173`, `localhost:3000`

2. **Refresh the Page**
   - After installing the extension, refresh the dashboard page
   - The content script needs to load after the page is ready

3. **Check Browser Console**
   - Open Developer Tools (F12)
   - Look for "Spendy Extension" messages in the Console tab
   - Check for any error messages that might indicate issues

4. **Verify Extension is Active**
   - Go to `chrome://extensions/`
   - Make sure "Spendy Transaction Alerts" is enabled
   - Check for any error messages in the extension details

5. **Manual Detection Test**
   - Open the extension popup
   - Check if the connection status updates after a few seconds
   - Try clicking the "Send Sample Alert" button to test functionality

### Extension Not Working

1. **Check Extension Status**
   - Ensure the extension is enabled in `chrome://extensions/`
   - Check for any error messages in the extension details

2. **Verify Dashboard Connection**
   - Make sure you're on the Spendy dashboard
   - Check that the popup shows "Dashboard Connected"

3. **Test Notifications**
   - Try the "Send Sample Alert" button
   - Check if browser notifications are enabled for your browser

### No Browser Notifications Appearing

If you're not seeing **pop-up notifications** from your browser/OS:

1. **First Time Setup - Request Permissions**
   - Click the extension icon in your browser toolbar
   - Click "Send Sample Alert" button
   - **This will trigger the permission request**
   - Look for a notification permission prompt from your browser
   - Click "Allow" when prompted

2. **If No Permission Prompt Appears**
   - Go to `chrome://settings/content/notifications`
   - Look for "localhost:5173" or your site in the blocked list
   - If found, click the trash icon to remove it
   - Try the "Send Sample Alert" button again

3. **Manual Permission Check**
   - Right-click the extension icon → "Manage extensions"
   - Look for "Site access" section
   - Make sure the extension has access to your site
   - Check that "Notifications" is listed in permissions

4. **Alternative Permission Method**
   - Visit your dashboard at `localhost:5173`
   - Look for a 🔔 icon in the address bar
   - Click it and select "Allow" for notifications
   - Refresh the page and try the extension again

5. **Test Notifications**
   - Click the extension icon and use "Send Sample Alert"
   - You should see a **system notification** pop up, not just text in the popup
   - Check the browser console for any error messages

6. **Check OS Notification Settings**
   - **Windows**: Settings > System > Notifications & actions
   - **macOS**: System Preferences > Notifications > Chrome
   - **Linux**: Check your desktop environment's notification settings

## Development

### File Structure

```text
browser-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for notifications
├── content.js            # Dashboard monitoring script
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icons/                # Extension icons (16, 32, 48, 128px)
│   ├── spendy16.png
│   ├── spendy32.png
│   ├── spendy48.png
│   └── spendy128.png
└── README.md             # This file
```

### Key Components

- **Background Script**: Manages notifications and extension state
- **Content Script**: Monitors the dashboard for changes
- **Popup Interface**: Provides user controls and preferences
- **Manifest**: Defines extension permissions and structure

### Adding New Features

1. **New Alert Types**: Add logic to `background.js` and `content.js`
2. **UI Changes**: Modify `popup.html` and `popup.js`
3. **Permissions**: Update `manifest.json` if needed
4. **Monitoring**: Enhance `content.js` for better dashboard detection

## Browser Compatibility

- **Chrome**: Full support (Manifest V3)
- **Edge**: Full support (Chromium-based)
- **Brave**: Full support (Chromium-based)
- **Firefox**: Partial support (may need manifest adjustments)
- **Safari**: Not supported (different extension system)

## Privacy & Security

- **Data Collection**: Extension only monitors locally displayed data
- **Storage**: Preferences stored locally in browser storage
- **Permissions**: Only requests necessary permissions for functionality
- **Network**: No external network requests (except to configured dashboard URLs)

## License

This extension is part of the Spendy project and follows the same license terms.
