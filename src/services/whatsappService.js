// WhatsApp notification service
const API_BASE_URL = 'http://localhost:3001/api'

// Helper function to check if server is running
const isServerRunning = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000) // 5 second timeout
    })
    return response.ok
  } catch (error) {
    return false
  }
}

export const whatsappService = {
  // Send a WhatsApp notification
  async sendNotification(message, phoneNumber, type = 'general') {
    const serverRunning = await isServerRunning()
    if (!serverRunning) {
      throw new Error('WhatsApp server is not running. Please start the server with "pnpm run server"')
    }

    try {
      const response = await fetch(`${API_BASE_URL}/send-whatsapp-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          phoneNumber,
          type
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error sending WhatsApp notification:', error)
      throw error
    }
  },

  // Get notification templates
  async getTemplates() {
    const serverRunning = await isServerRunning()
    if (!serverRunning) {
      // Return default templates if server is not running
      return [
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
    }

    try {
      const response = await fetch(`${API_BASE_URL}/notification-templates`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching templates:', error)
      throw error
    }
  },

  // Check server health
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      })
      return await response.json()
    } catch (error) {
      console.error('Health check failed:', error)
      throw error
    }
  }
}

// Predefined notification generators based on app context
export const notificationGenerators = {
  // Budget alert notification
  budgetAlert(category, spent, budget) {
    return `⚠️ Budget Alert: You've exceeded your monthly ${category} budget. Spent: $${spent} (Budget: $${budget}). Consider adjusting your expenses for the rest of the month.`
  },

  // Savings goal notification
  savingsGoal(goalName, current, target, percentage) {
    return `🎯 Savings Update: You're ${percentage}% closer to your ${goalName} goal! Current: $${current}/$${target}. Keep up the great work!`
  },

  // Unusual spending notification
  unusualSpending(amount, merchant) {
    return `🚨 Unusual spending detected: $${amount} at ${merchant}. If this wasn't you, please review your recent transactions.`
  },

  // Weekly summary notification
  weeklySummary(totalSpent, topCategories) {
    const categoriesText = topCategories.map(cat => `${cat.name} ($${cat.amount})`).join(', ')
    return `📊 Weekly Summary: Total spent: $${totalSpent}. Top categories: ${categoriesText}. Keep tracking your expenses!`
  },

  // Monthly report notification
  monthlyReport(month, totalSpent, budgetStatus) {
    return `📈 ${month} Report: Total spent: $${totalSpent}. Budget status: ${budgetStatus}. Check your dashboard for detailed insights.`
  }
}
