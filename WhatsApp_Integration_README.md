# WhatsApp Integration with Twilio

This integration allows you to send WhatsApp notifications for your spending app using Twilio's WhatsApp API.

## Features

- 📱 Send WhatsApp notifications manually
- 🤖 Smart notifications based on your spending data
- 📊 Budget alerts and spending summaries
- 🎯 Savings goal updates
- 🚨 Unusual spending alerts
- 📈 Weekly/Monthly reports

## Quick Start (5 minutes)

### 1. Run the setup script

```bash
pnpm run setup:whatsapp
```

### 2. Get Twilio credentials

1. Go to [Twilio Console](https://console.twilio.com/)
2. Copy your Account SID and Auth Token
3. Paste them into the `.env` file

### 3. Join WhatsApp Sandbox

1. Send a message to +1 415 523 8886
2. Text: `join <your-sandbox-code>`
3. You'll get a confirmation message

### 4. Start the application

```bash
pnpm run dev:full
```

### 5. Test the integration

1. Open <http://localhost:5173> in your browser
2. Navigate to the WhatsApp tab in the navigation menu
3. Enter your phone number (with country code)
4. Click on any notification template to send a test message

## Detailed Setup Instructions

### 1. Get Twilio Account

1. Sign up for a free Twilio account at <https://www.twilio.com/try-twilio>
2. Get your Account SID and Auth Token from the Twilio Console
3. For testing, use the WhatsApp Sandbox (no approval needed)

### 2. Configure WhatsApp Sandbox

1. Go to Twilio Console > Messaging > Try it out > Send a WhatsApp message
2. Follow the instructions to join the sandbox:
   - Send a WhatsApp message to +1 415 523 8886
   - Send the message: `join <your-sandbox-code>`
   - You'll receive a confirmation message

### 3. Environment Setup

1. Copy the `.env.example` file to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Fill in your Twilio credentials in the `.env` file:

   ```env
   TWILIO_ACCOUNT_SID=your_account_sid_here
   TWILIO_AUTH_TOKEN=your_auth_token_here
   TWILIO_WHATSAPP_NUMBER=+14155238886
   PORT=3001
   ```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run the Application

Option 1: Run frontend and backend separately

```bash
# Terminal 1: Start the backend server
pnpm run server

# Terminal 2: Start the frontend
pnpm run dev
```

Option 2: Run both together

```bash
pnpm run dev:full
```

## Usage

The WhatsApp integration is now available as a dedicated page in your application.

### Accessing WhatsApp Notifications

1. Navigate to the **WhatsApp** tab in the navigation menu
2. Or click "Setup notifications" from the dashboard alerts section
3. The WhatsApp page provides a full-featured interface for managing notifications

### Smart Notifications

The app analyzes your spending data and suggests relevant notifications:

- **Budget Alerts**: When you exceed spending limits
- **Weekly Summary**: Overview of your week's spending
- **Savings Goals**: Progress updates on your financial goals
- **Unusual Spending**: Alerts for high-value transactions

### Manual Notifications

You can also send custom messages or choose from predefined templates directly from the WhatsApp page.

## API Endpoints

### POST /api/send-whatsapp-notification

Send a WhatsApp notification.

**Request Body:**

```json
{
  "message": "Your notification message",
  "phoneNumber": "+1234567890",
  "type": "budget-alert"
}
```

**Response:**

```json
{
  "success": true,
  "messageSid": "SM...",
  "type": "budget-alert"
}
```

### GET /api/notification-templates

Get predefined notification templates.

**Response:**

```json
[
  {
    "id": "budget-alert",
    "title": "💰 Budget Alert",
    "message": "⚠️ Budget Alert: You've exceeded your monthly spending limit..."
  }
]
```

### GET /api/health

Check server health status.

## Files Structure

```text
├── server.js                                   # Express server for WhatsApp API
├── .env                                        # Environment variables
├── setup-whatsapp.js                          # Setup wizard script
├── test-whatsapp.js                           # Integration test script
├── src/
│   ├── pages/
│   │   └── WhatsApp.jsx                       # WhatsApp notifications page
│   └── services/
│       └── whatsappService.js                 # API service and message generators
```

## Navigation

The WhatsApp integration is now accessible through:

1. **Navigation Menu**: Click the "WhatsApp" tab in the main navigation
2. **Dashboard Alert**: Click "Setup notifications" from the alert card
3. **Direct URL**: Navigate to `/whatsapp` in your browser

The WhatsApp page features a modern dark theme that matches your application's design.

## Troubleshooting

### Common Issues

1. **Server offline**: Make sure to run `pnpm run server` in a separate terminal
2. **Invalid phone number**: Ensure the phone number includes the country code (e.g., +1 for US)
3. **Sandbox not joined**: Make sure you've joined the WhatsApp sandbox by texting the join code
4. **Twilio credentials**: Verify your Account SID and Auth Token are correct in the `.env` file
5. **Twilio import error**: If you see "Named export 'Twilio' not found", the server.js file uses the correct ES module import syntax

### Server Startup Issues

If you encounter import errors when starting the server:

```bash
# Error: Named export 'Twilio' not found
SyntaxError: Named export 'Twilio' not found. The requested module 'twilio' is a CommonJS module
```

This has been fixed in the server.js file by using the correct import syntax:
```javascript
import twilio from 'twilio'
const client = twilio(accountSid, authToken)
```

### Error Messages

- **"Message and phone number are required"**: Both fields must be provided
- **"Failed to send WhatsApp message"**: Check your Twilio credentials and phone number format
- **"Server is offline"**: The backend server is not running

## Production Deployment

For production use:

1. **Get WhatsApp Business Account**: Apply for a WhatsApp Business Account through Twilio
2. **Update Environment Variables**: Use your production Twilio credentials
3. **Security**: Implement proper authentication and rate limiting
4. **Monitoring**: Add logging and monitoring for message delivery

## Cost Considerations

- **Sandbox**: Free for testing
- **WhatsApp Business**: ~$0.005-0.05 per message depending on region
- **Twilio**: Additional fees may apply based on your plan

## Next Steps

1. **Automated Triggers**: Set up automatic notifications based on spending patterns
2. **User Preferences**: Allow users to customize notification types and frequency
3. **Rich Media**: Add images, buttons, and interactive elements to messages
4. **Analytics**: Track message delivery and engagement rates

## Support

For issues related to:

- **Twilio**: Check [Twilio Documentation](https://www.twilio.com/docs/whatsapp)
- **WhatsApp Business**: See [WhatsApp Business API docs](https://developers.facebook.com/docs/whatsapp)
- **This Integration**: Check the console logs and server response messages
