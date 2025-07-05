import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import twilio from 'twilio'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

// WhatsApp notification endpoint
app.post('/api/send-whatsapp-notification', async (req, res) => {
  try {
    const { message, phoneNumber, type = 'general' } = req.body

    if (!message || !phoneNumber) {
      return res.status(400).json({ 
        error: 'Message and phone number are required' 
      })
    }

    // Format phone number for WhatsApp (must include country code)
    const formattedNumber = phoneNumber.startsWith('+') 
      ? phoneNumber 
      : `+${phoneNumber}`

    const whatsappMessage = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedNumber}`,
      body: message
    })

    console.log('WhatsApp message sent:', whatsappMessage.sid)
    
    res.json({ 
      success: true, 
      messageSid: whatsappMessage.sid,
      type: type 
    })
  } catch (error) {
    console.error('Error sending WhatsApp message:', error)
    res.status(500).json({ 
      error: 'Failed to send WhatsApp message',
      details: error.message 
    })
  }
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Predefined notification templates endpoint
app.get('/api/notification-templates', (req, res) => {
  const templates = [
    {
      id: 'budget-alert',
      title: '💰 Budget Alert',
      message: '⚠️ Budget Alert: You\'ve exceeded your monthly spending limit for groceries. Current spending: $450 (Budget: $400). Consider adjusting your expenses for the rest of the month.'
    },
    {
      id: 'savings-goal',
      title: '🎯 Savings Goal',
      message: '🎉 Great news! You\'re 80% closer to your vacation savings goal. Only $200 more to reach your target of $1,000. Keep up the excellent work!'
    },
    {
      id: 'unusual-spending',
      title: '🚨 Unusual Spending',
      message: '🔍 Unusual spending detected: $150 at an unknown merchant. If this wasn\'t you, please review your recent transactions and contact your bank if necessary.'
    },
    {
      id: 'weekly-summary',
      title: '📊 Weekly Summary',
      message: '📈 Your weekly spending summary: Total spent: $285. Top categories: Groceries ($120), Dining ($85), Transport ($80). You\'re on track with your budget!'
    }
  ]
  
  res.json(templates)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Health check: http://localhost:${PORT}/api/health`)
})
