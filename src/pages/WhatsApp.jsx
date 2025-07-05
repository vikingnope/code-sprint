import { useState, useEffect } from 'react'
import { FaWhatsapp, FaPaperPlane, FaSpinner, FaBell, FaArrowLeft } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { whatsappService, notificationGenerators } from '@/services/whatsappService'
import { parseCsvData, getMonthlyData } from '@/utils/csvParser'
import csvData from '@assets/codesprint_open_2025_sample_data.csv?raw'

const WhatsAppPage = () => {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [serverStatus, setServerStatus] = useState('unknown')
  const [lastSent, setLastSent] = useState(null)
  const [templates, setTemplates] = useState([])
  const [transactions, setTransactions] = useState([])
  const [monthlyData, setMonthlyData] = useState({})

  // Load data and check server status on component mount
  useEffect(() => {
    checkServerStatus()
    fetchTemplates()
    loadTransactionData()
  }, [])

  const loadTransactionData = () => {
    try {
      const parsedData = parseCsvData(csvData)
      const filteredData = parsedData.filter(transaction => 
        transaction.date && !isNaN(transaction.date.getTime())
      )
      
      // Filter to last 3 months
      const threeMonthsAgo = new Date('2025-04-01')
      const recentTransactions = filteredData.filter(transaction => 
        transaction.date >= threeMonthsAgo
      )
      
      setTransactions(recentTransactions)
      const monthly = getMonthlyData(recentTransactions)
      setMonthlyData(monthly)
    } catch (error) {
      console.error('Error loading transaction data:', error)
    }
  }

  const checkServerStatus = async () => {
    try {
      await whatsappService.healthCheck()
      setServerStatus('online')
    } catch (error) {
      setServerStatus('offline')
    }
  }

  const fetchTemplates = async () => {
    try {
      const data = await whatsappService.getTemplates()
      setTemplates(data)
    } catch (error) {
      console.error('Error fetching templates:', error)
    }
  }

  const sendWhatsAppNotification = async (message, type = 'custom') => {
    if (!phoneNumber.trim()) {
      alert('Please enter a phone number')
      return
    }

    if (!message.trim()) {
      alert('Please enter a message or select a template')
      return
    }

    setIsLoading(true)
    try {
      const response = await whatsappService.sendNotification(
        message,
        phoneNumber,
        type
      )

      if (response.success) {
        setLastSent({
          message,
          type,
          timestamp: new Date().toLocaleString(),
          messageSid: response.messageSid
        })
        
        // Clear custom message after sending
        if (type === 'custom') {
          setCustomMessage('')
        }
        
        alert('WhatsApp notification sent successfully!')
      } else {
        throw new Error(response.error || 'Failed to send notification')
      }
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (template) => {
    sendWhatsAppNotification(template.message, template.id)
  }

  const sendSmartNotification = async (type, data) => {
    if (!phoneNumber.trim()) {
      alert('Please enter a phone number')
      return
    }

    setIsLoading(true)
    try {
      let message = ''
      
      switch (type) {
        case 'budget-alert':
          message = notificationGenerators.budgetAlert(
            data.category,
            data.spent,
            data.budget
          )
          break
        case 'weekly-summary':
          message = notificationGenerators.weeklySummary(
            data.totalSpent,
            data.topCategories
          )
          break
        case 'savings-goal':
          message = notificationGenerators.savingsGoal(
            data.goalName,
            data.current,
            data.target,
            data.percentage
          )
          break
        case 'unusual-spending':
          message = notificationGenerators.unusualSpending(
            data.amount,
            data.merchant
          )
          break
        default:
          message = data.message
      }

      const response = await whatsappService.sendNotification(
        message,
        phoneNumber,
        type
      )

      if (response.success) {
        setLastSent({
          message,
          type,
          timestamp: new Date().toLocaleString(),
          messageSid: response.messageSid
        })
        alert('Smart notification sent successfully!')
      }
    } catch (error) {
      console.error('Error sending smart notification:', error)
      alert(`Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Generate smart notifications based on current data
  const generateSmartNotifications = () => {
    const notifications = []
    
    // Calculate current month data
    const currentMonth = new Date().toISOString().slice(0, 7)
    const currentMonthData = monthlyData[currentMonth] || {}
    
    // Budget alert example
    if (currentMonthData.categories?.Groceries > 400) {
      notifications.push({
        type: 'budget-alert',
        title: '💰 Budget Alert - Groceries',
        description: 'You\'ve exceeded your grocery budget',
        data: {
          category: 'Groceries',
          spent: currentMonthData.categories.Groceries,
          budget: 400
        }
      })
    }

    // Weekly summary
    const weeklySpent = transactions
      .filter(t => {
        const weekAgo = new Date()
        weekAgo.setDate(weekAgo.getDate() - 7)
        return t.date >= weekAgo
      })
      .reduce((sum, t) => sum + Math.abs(t.amount), 0)

    if (weeklySpent > 0) {
      const topCategories = Object.entries(currentMonthData.categories || {})
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([name, amount]) => ({ name, amount }))

      notifications.push({
        type: 'weekly-summary',
        title: '📊 Weekly Summary',
        description: `Total spent this week: $${weeklySpent.toFixed(2)}`,
        data: {
          totalSpent: weeklySpent.toFixed(2),
          topCategories
        }
      })
    }

    // Savings goal example
    notifications.push({
      type: 'savings-goal',
      title: '🎯 Vacation Fund',
      description: 'Update on your vacation savings goal',
      data: {
        goalName: 'Vacation Fund',
        current: 800,
        target: 1000,
        percentage: 80
      }
    })

    // Unusual spending example
    const recentHighTransactions = transactions
      .filter(t => Math.abs(t.amount) > 100)
      .slice(0, 1)

    if (recentHighTransactions.length > 0) {
      const transaction = recentHighTransactions[0]
      notifications.push({
        type: 'unusual-spending',
        title: '🚨 Unusual Spending',
        description: `High transaction detected: $${Math.abs(transaction.amount)}`,
        data: {
          amount: Math.abs(transaction.amount),
          merchant: transaction.description || 'Unknown Merchant'
        }
      })
    }

    return notifications
  }

  const smartNotifications = generateSmartNotifications()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center text-green-400 hover:text-green-300 transition-colors mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Back to Dashboard
          </Link>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FaWhatsapp className="text-green-400 text-3xl mr-4" />
              <div>
                <h1 className="text-3xl font-bold text-white">WhatsApp Notifications</h1>
                <p className="text-slate-300 mt-2">Send smart notifications about your spending</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                serverStatus === 'online' ? 'bg-green-400' : 
                serverStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400'
              }`}></div>
              <span className="text-sm text-slate-300">
                Server: {serverStatus}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Phone Number Input */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Setup</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  WhatsApp Phone Number
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-slate-400 mt-2">
                  Include country code (e.g., +1 for US, +44 for UK)
                </p>
              </div>
            </div>

            {/* Smart Notifications */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                <FaBell className="inline mr-2" />
                Smart Notifications
              </h2>
              <p className="text-slate-300 mb-4">
                Based on your spending data and financial goals
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {smartNotifications.map((notification, index) => (
                  <button
                    key={index}
                    onClick={() => sendSmartNotification(notification.type, notification.data)}
                    disabled={isLoading}
                    className="flex flex-col items-start p-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md transition-colors disabled:opacity-50 text-left"
                  >
                    <span className="text-sm font-medium text-green-400 mb-1">
                      {notification.title}
                    </span>
                    <span className="text-xs text-slate-300">
                      {notification.description}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Templates */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Quick Templates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    disabled={isLoading}
                    className="flex items-center p-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-md transition-colors disabled:opacity-50"
                  >
                    <span className="text-sm font-medium text-white">
                      {template.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Custom Message</h2>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Enter your custom notification message..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              />
              <button
                onClick={() => sendWhatsAppNotification(customMessage, 'custom')}
                disabled={isLoading || !customMessage.trim()}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Send Custom Message
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Last Sent Message */}
            {lastSent && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-white mb-4">Last Sent</h3>
                <div className="space-y-3">
                  <div className="text-xs text-slate-400">
                    <span className="font-medium">Type:</span> {lastSent.type}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="font-medium">Time:</span> {lastSent.timestamp}
                  </div>
                  <div className="text-xs text-slate-400">
                    <span className="font-medium">Message ID:</span> {lastSent.messageSid}
                  </div>
                  <div className="text-sm text-slate-200 p-3 bg-slate-700 rounded border border-slate-600">
                    {lastSent.message}
                  </div>
                </div>
              </div>
            )}

            {/* Setup Instructions */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold text-white mb-4">Setup Instructions</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">1.</span>
                  <span>Configure Twilio credentials in .env file</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">2.</span>
                  <span>Join WhatsApp sandbox by messaging "join &lt;code&gt;" to +1 415 523 8886</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">3.</span>
                  <span>Enter your WhatsApp number with country code</span>
                </div>
                <div className="flex items-start">
                  <span className="text-green-400 mr-2">4.</span>
                  <span>Send test notifications using templates or custom messages</span>
                </div>
              </div>
            </div>

            {/* Server Status */}
            {serverStatus === 'offline' && (
              <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-400 mb-2">Server Offline</h3>
                <p className="text-sm text-red-300">
                  The WhatsApp notification server is not running. Please start the server using "pnpm run server" in a separate terminal.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppPage
