# Spendy Transaction Alerts Browser Extension

A browser extension that provides real-time notifications for financial transactions and alerts detected on the Spendy dashboard.

## Features

- **Real-time Notifications**: Get instant browser notifications when new transactions are detected
- **Manual Triggers**: Test the notification system with sample alerts
- **Customizable Preferences**: Enable/disable different types of alerts
- **Dashboard Integration**: Automatically detects when you're on the Spendy financial dashboard
- **Transaction Monitoring**: Monitors for new transactions and spending patterns

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

### No Notifications Appearing

1. **Check Browser Permissions**
   - Ensure notifications are enabled for your browser
   - Check site-specific notification settings

2. **Verify Extension Permissions**
   - Make sure the extension has notification permissions
   - Check the extension's permissions in the browser settings

3. **Test Manual Triggers**
   - Use the popup's manual trigger buttons
   - Check the browser console for any error messages

## Development

### File Structure

```
browser-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker for notifications
├── content.js            # Dashboard monitoring script
├── popup.html            # Extension popup interface
├── popup.js              # Popup functionality
├── icons/                # Extension icons (16, 32, 48, 128px)
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
