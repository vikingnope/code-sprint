/**
 * SpendyBuddy Chatbot Engine
 * Handles natural language processing and generates responses based on spending data
 */

export const generateResponse = (userInput, transactions, monthlyData) => {
  const input = userInput.toLowerCase().trim()
  
  // Handle greetings
  if (isGreeting(input)) {
    return getGreetingResponse()
  }
  
  // Handle expense analysis (check this first for "too much money" questions)
  if (isExpenseAnalysisRequest(input)) {
    return getExpenseAnalysis(transactions)
  }
  
  // Handle spending summary requests
  if (isSpendingSummaryRequest(input)) {
    return getSpendingSummary(transactions, monthlyData)
  }
  
  // Handle category-specific spending requests
  if (isCategorySpendingRequest(input)) {
    return getCategorySpending(input, transactions)
  }
  
  // Handle category-specific savings requests
  if (isCategorySpecificSavingsRequest(input)) {
    return getCategorySpecificSavings(input, transactions)
  }
  
  // Handle savings and recommendations
  if (isSavingsRequest(input)) {
    return getSavingsAdvice(transactions)
  }
  
  // Handle spending trends
  if (isTrendRequest(input)) {
    return getSpendingTrends(transactions, monthlyData)
  }
  
  // Handle budget questions
  if (isBudgetRequest(input)) {
    return getBudgetAdvice(transactions)
  }
  
  // Handle specific time period questions
  if (isTimePeriodRequest(input)) {
    return getTimePeriodAnalysis(input, transactions, monthlyData)
  }
  
  // Handle comparison requests
  if (isComparisonRequest(input)) {
    return getComparisonAnalysis(transactions, monthlyData)
  }
  
  // Handle general spending questions
  if (isGeneralSpendingQuestion(input)) {
    return getGeneralSpendingAnalysis(transactions, monthlyData)
  }
  
  // Default response with suggestions
  return getDefaultResponse()
}

// Helper functions to identify request types
const isGreeting = (input) => {
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'thanks', 'thank you']
  // Check for exact matches or greetings at the beginning/end of input to avoid false positives
  return greetings.some(greeting => {
    const trimmedInput = input.trim()
    return trimmedInput === greeting || 
           trimmedInput.startsWith(greeting + ' ') || 
           trimmedInput.endsWith(' ' + greeting) ||
           trimmedInput.startsWith(greeting + '!') ||
           trimmedInput.endsWith(' ' + greeting + '!')
  })
}

const isSpendingSummaryRequest = (input) => {
  const keywords = ['summary', 'overview', 'total', 'spent', 'spending', 'expenses', 'how much']
  return keywords.some(keyword => input.includes(keyword)) && 
         !input.includes('category') && !input.includes('food') && !input.includes('entertainment')
}

const isCategorySpendingRequest = (input) => {
  const categories = ['food', 'dining', 'entertainment', 'shopping', 'transport', 'groceries', 'housing', 'rent']
  return categories.some(category => input.includes(category))
}

const isSavingsRequest = (input) => {
  const keywords = ['save', 'saving', 'savings', 'tips', 'advice', 'recommendations', 'reduce', 'cut', 'cut down', 'lower my expenses', 'spend less', 'save money', 'reduce spending']
  return keywords.some(keyword => input.includes(keyword))
}

const isCategorySpecificSavingsRequest = (input) => {
  const categories = ['food', 'dining', 'entertainment', 'shopping', 'transport', 'groceries', 'housing', 'rent']
  const savingsKeywords = ['save', 'saving', 'savings', 'tips', 'advice', 'recommendations', 'reduce', 'cut', 'cut down']
  
  const hasCategory = categories.some(category => input.includes(category))
  const hasSavingsKeyword = savingsKeywords.some(keyword => input.includes(keyword))
  
  return hasCategory && hasSavingsKeyword
}

const isTrendRequest = (input) => {
  const keywords = ['trend', 'pattern', 'change', 'increase', 'decrease', 'over time', 'month', 'monthly']
  return keywords.some(keyword => input.includes(keyword))
}

const isExpenseAnalysisRequest = (input) => {
  const keywords = ['biggest', 'largest', 'most', 'highest', 'expensive', 'analyze', 'breakdown', 'too much', 'spending too much', 'overspending', 'where', 'which', 'what category', 'problem areas', 'wasteful', 'excessive', 'spending patterns', 'where am i spending', 'where do i spend', 'spending habits']
  
  // Check for specific question patterns about overspending
  const questionPatterns = [
    'where do you think',
    'where am i spending too much',
    'where do i spend too much',
    'am i spending too much',
    'spending too much money',
    'overspending'
  ]
  
  return keywords.some(keyword => input.includes(keyword)) ||
         questionPatterns.some(pattern => input.includes(pattern))
}

const isBudgetRequest = (input) => {
  const keywords = ['budget', 'budgeting', 'plan', 'planning', 'allocate', 'limit']
  return keywords.some(keyword => input.includes(keyword))
}

const isTimePeriodRequest = (input) => {
  const keywords = ['last month', 'this month', 'april', 'may', 'june', 'week', 'day']
  return keywords.some(keyword => input.includes(keyword))
}

const isComparisonRequest = (input) => {
  const keywords = ['compare', 'comparison', 'vs', 'versus', 'difference', 'between']
  return keywords.some(keyword => input.includes(keyword))
}

const isGeneralSpendingQuestion = (input) => {
  const keywords = ['spending', 'spend', 'money', 'expenses', 'financial', 'finances', 'budget', 'cost', 'costs', 'bills', 'payments'
  ]
  return keywords.some(keyword => input.includes(keyword)) && !isSpecificRequest(input)
}

const isSpecificRequest = (input) => {
  // Check if it's already handled by other specific functions
  return isSpendingSummaryRequest(input) || 
         isCategorySpendingRequest(input) || 
         isCategorySpecificSavingsRequest(input) ||
         isSavingsRequest(input) || 
         isTrendRequest(input) || 
         isExpenseAnalysisRequest(input) || 
         isBudgetRequest(input) || 
         isTimePeriodRequest(input) || 
         isComparisonRequest(input)
}

// Response generators
const getGreetingResponse = () => {
  const responses = [
    "Hello! I'm here to help you understand your spending better! 😊\n\nWhat would you like to know about your finances?",
    "Hi there! Ready to dive into your spending data? I'm here to help! 💰\n\nAsk me anything about your expenses!",
    "Hey! Great to see you! Let's explore your spending patterns together! 📊\n\nWhat can I help you with today?"
  ]
  return responses[Math.floor(Math.random() * responses.length)]
}

const getSpendingSummary = (transactions, monthlyData) => {
  if (!transactions || transactions.length === 0) {
    return "I don't have any transaction data to analyze yet. Please make sure your data is loaded!"
  }
  
  const totalSpent = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const income = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const expenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const avgMonthlySpending = Object.keys(monthlyData).length > 0 ? 
    expenses / Object.keys(monthlyData).length : 0
  
  const categories = getCategoryBreakdown(transactions)
  const topCategory = Object.entries(categories).reduce((a, b) => categories[a[0]] > categories[b[0]] ? a : b)[0]
  
  return `💰 **Your Spending Summary**\n\n` +
         `📊 **Total Expenses:** €${expenses.toFixed(2)}\n` +
         `💵 **Total Income:** €${income.toFixed(2)}\n` +
         `📈 **Net:** €${(income - expenses).toFixed(2)}\n\n` +
         `📅 **Average Monthly Spending:** €${avgMonthlySpending.toFixed(2)}\n` +
         `🏆 **Top Category:** ${topCategory} (€${categories[topCategory].toFixed(2)})\n\n` +
         `🔍 Want me to analyze a specific category or time period?`
}

const getCategorySpending = (input, transactions) => {
  const categoryMap = {
    'food': ['Food & Dining', 'Groceries & Cafe'],
    'dining': ['Food & Dining'],
    'entertainment': ['Entertainment'],
    'shopping': ['Shopping'],
    'transport': ['Transport'],
    'groceries': ['Groceries & Cafe'],
    'housing': ['Housing'],
    'rent': ['Housing']
  }
  
  const tips = {
    'Food & Dining': [
      '🍳 Cook more meals at home instead of dining out',
      '📱 Use food delivery apps less frequently',
      '🥪 Pack lunches for work',
      '🛒 Plan meals and make shopping lists',
      '🍽️ Try meal prep on weekends',
      '🥗 Choose restaurants with lunch specials'
    ],
    'Entertainment': [
      '🎬 Consider subscription sharing with family/friends',
      '🎵 Look for free entertainment options in your area',
      '📚 Use your local library for books, movies, and events',
      '🎮 Wait for sales before buying games or entertainment',
      '🏞️ Explore free outdoor activities and parks',
      '🎪 Look for community events and festivals'
    ],
    'Shopping': [
      '🛍️ Create a 24-hour waiting period before non-essential purchases',
      '🔍 Compare prices across different retailers',
      '💳 Use cashback apps and browser extensions',
      '📝 Make shopping lists and stick to them',
      '🏷️ Look for sales and use coupons',
      '🛒 Consider buying generic brands'
    ],
    'Transport': [
      '🚗 Consider carpooling or public transportation',
      '🚲 Use bike-sharing or walk for short distances',
      '⛽ Use apps to find cheaper gas stations',
      '🅿️ Look for free parking alternatives',
      '🚌 Get a monthly transit pass if you use public transport regularly',
      '🚶‍♀️ Walk or cycle for trips under 2km',
      '🚕 Use ride-sharing apps during off-peak hours for better rates'
    ],
    'Groceries & Cafe': [
      '☕ Make coffee at home instead of buying daily',
      '🛒 Shop with a list and stick to it',
      '🏪 Compare prices at different stores',
      '🥫 Buy generic brands for basics',
      '🍌 Buy seasonal produce',
      '🥪 Prepare your own snacks and lunches'
    ],
    'Housing': [
      '🏠 Consider refinancing if you have a mortgage',
      '💡 Use energy-efficient appliances to reduce utility bills',
      '🌡️ Adjust thermostat settings to save on heating/cooling',
      '🚿 Take shorter showers to reduce water bills',
      '🏠 Look for roommates to split costs',
      '🔧 Learn basic home repairs to avoid service calls'
    ]
  }
  
  let targetCategories = []
  let categoryKey = ''
  
  for (const [key, categories] of Object.entries(categoryMap)) {
    if (input.includes(key)) {
      targetCategories = categories
      categoryKey = key
      break
    }
  }
  
  if (targetCategories.length === 0) {
    return "I couldn't identify the category you're asking about. Try asking about: food, entertainment, shopping, transport, groceries, or housing!"
  }
  
  const categorySpending = transactions
    .filter(t => t.amount < 0 && targetCategories.includes(categorizeTransaction(t.description)))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const categoryTransactions = transactions
    .filter(t => t.amount < 0 && targetCategories.includes(categorizeTransaction(t.description)))
    .length
  
  const avgTransaction = categoryTransactions > 0 ? categorySpending / categoryTransactions : 0
  
  // Get the tips for this category
  const relevantTips = tips[targetCategories[0]] || []
  
  let response = `🏷️ **${targetCategories.join(' & ')} Spending**\n\n`
  response += `💸 **Total Spent:** €${categorySpending.toFixed(2)}\n`
  response += `📊 **Number of Transactions:** ${categoryTransactions}\n`
  response += `💰 **Average per Transaction:** €${avgTransaction.toFixed(2)}\n\n`
  
  // Include savings tips directly
  response += `💡 **${targetCategories.join(' & ')} Savings Tips:**\n`
  relevantTips.forEach(tip => {
    response += `${tip}\n`
  })
  
  if (categorySpending > 0) {
    const potentialSavings = categorySpending * 0.15 // Assume 15% potential savings
    response += `\n📈 **Potential Monthly Savings:** €${(potentialSavings / 3).toFixed(2)}\n`
  }
  
  response += `\n🔄 **General Tips:**\n`
  response += `• Track your ${categoryKey} expenses daily\n`
  response += `• Set a monthly budget for ${categoryKey}\n`
  response += `• Look for alternatives before making purchases\n`
  response += `• Consider if the purchase is a need or want\n\n`
  
  response += `💬 Want tips for another category or overall savings advice?`
  
  return response
}

const getSavingsAdvice = (transactions) => {
  const categories = getCategoryBreakdown(transactions)
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1])
  
  const tips = {
    'Food & Dining': [
      '🍳 Cook more meals at home instead of dining out',
      '📱 Use food delivery apps less frequently',
      '🥪 Pack lunches for work',
      '🛒 Plan meals and make shopping lists'
    ],
    'Entertainment': [
      '🎬 Consider subscription sharing with family/friends',
      '🎵 Look for free entertainment options in your area',
      '📚 Use your local library for books, movies, and events',
      '🎮 Wait for sales before buying games or entertainment'
    ],
    'Shopping': [
      '🛍️ Create a 24-hour waiting period before non-essential purchases',
      '🔍 Compare prices across different retailers',
      '💳 Use cashback apps and browser extensions',
      '📝 Make shopping lists and stick to them'
    ],
    'Transport': [
      '🚗 Consider carpooling or public transportation',
      '🚲 Use bike-sharing or walk for short distances',
      '⛽ Use apps to find cheaper gas stations',
      '🅿️ Look for free parking alternatives'
    ],
    'Groceries & Cafe': [
      '☕ Make coffee at home instead of buying daily',
      '🛒 Shop with a list and stick to it',
      '🏪 Compare prices at different stores',
      '🥫 Buy generic brands for basics'
    ]
  }
  
  let advice = "💡 **Personalized Savings Tips**\n\n"
  
  if (sortedCategories.length > 0) {
    const topCategory = sortedCategories[0][0]
    const topAmount = sortedCategories[0][1]
    
    advice += `🎯 **Focus Area:** ${topCategory} (€${topAmount.toFixed(2)})\n\n`
    
    if (tips[topCategory]) {
      advice += tips[topCategory].join('\n') + '\n\n'
    }
    
    advice += `📈 **Potential Monthly Savings:** €${(topAmount * 0.2).toFixed(2)} - €${(topAmount * 0.4).toFixed(2)}\n\n`
  }
  
  advice += "🔄 **General Tips:**\n"
  advice += "• Set up automatic transfers to savings\n"
  advice += "• Use the 50/30/20 budgeting rule\n"
  advice += "• Review and cancel unused subscriptions\n"
  advice += "• Track your spending daily\n\n"
  advice += "Want specific advice for another category?"
  
  return advice
}

const getSpendingTrends = (transactions, monthlyData) => {
  if (!monthlyData || Object.keys(monthlyData).length < 2) {
    return "I need at least 2 months of data to show you spending trends. Keep tracking your expenses!"
  }
  
  const months = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b))
  const monthlySpending = months.map(month => {
    const monthTransactions = monthlyData[month]
    return {
      month,
      spending: monthTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
    }
  })
  
  let trendAnalysis = "📈 **Your Spending Trends**\n\n"
  
  for (let i = 0; i < monthlySpending.length; i++) {
    const current = monthlySpending[i]
    const monthName = new Date(current.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    
    trendAnalysis += `📅 **${monthName}:** €${current.spending.toFixed(2)}`
    
    if (i > 0) {
      const previous = monthlySpending[i - 1]
      const change = current.spending - previous.spending
      const changePercent = ((change / previous.spending) * 100).toFixed(1)
      
      if (change > 0) {
        trendAnalysis += ` (⬆️ +€${change.toFixed(2)}, +${changePercent}%)`
      } else if (change < 0) {
        trendAnalysis += ` (⬇️ -€${Math.abs(change).toFixed(2)}, ${changePercent}%)`
      } else {
        trendAnalysis += ` (➡️ No change)`
      }
    }
    trendAnalysis += '\n'
  }
  
  // Overall trend
  if (monthlySpending.length >= 2) {
    const firstMonth = monthlySpending[0].spending
    const lastMonth = monthlySpending[monthlySpending.length - 1].spending
    const overallChange = lastMonth - firstMonth
    const overallPercent = ((overallChange / firstMonth) * 100).toFixed(1)
    
    trendAnalysis += `\n🎯 **Overall Trend:** `
    if (overallChange > 0) {
      trendAnalysis += `Spending increased by €${overallChange.toFixed(2)} (${overallPercent}%)`
    } else if (overallChange < 0) {
      trendAnalysis += `Spending decreased by €${Math.abs(overallChange).toFixed(2)} (${Math.abs(overallPercent)}%)`
    } else {
      trendAnalysis += `Spending remained stable`
    }
  }
  
  return trendAnalysis
}

const getExpenseAnalysis = (transactions) => {
  const categories = getCategoryBreakdown(transactions)
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1])
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  let analysis = "🔍 **Where You Might Be Spending Too Much**\n\n"
  
  if (sortedCategories.length === 0) {
    return "I don't have enough transaction data to analyze your spending patterns. Please make sure your data is loaded!"
  }
  
  // Analyze spending patterns and identify problem areas
  analysis += "📊 **Your Top Spending Categories:**\n"
  sortedCategories.slice(0, 5).forEach((category, index) => {
    const emoji = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'][index]
    const percentage = ((category[1] / totalExpenses) * 100).toFixed(1)
    analysis += `${emoji} ${category[0]}: €${category[1].toFixed(2)} (${percentage}%)\n`
  })
  
  analysis += "\n🚨 **Areas of Concern:**\n"
  
  // Identify potential problem areas
  const problemAreas = []
  
  // Food & Dining analysis
  const foodSpending = categories['Food & Dining'] || 0
  const grocerySpending = categories['Groceries & Cafe'] || 0
  const totalFoodSpending = foodSpending + grocerySpending
  const foodPercentage = (totalFoodSpending / totalExpenses) * 100
  
  if (foodPercentage > 25) {
    problemAreas.push({
      category: 'Food & Dining',
      amount: totalFoodSpending,
      percentage: foodPercentage.toFixed(1),
      issue: 'Food spending is quite high',
      suggestion: 'Consider cooking more meals at home and reducing takeout/restaurant visits'
    })
  }
  
  // Entertainment analysis
  const entertainmentSpending = categories['Entertainment'] || 0
  const entertainmentPercentage = (entertainmentSpending / totalExpenses) * 100
  
  if (entertainmentPercentage > 15) {
    problemAreas.push({
      category: 'Entertainment',
      amount: entertainmentSpending,
      percentage: entertainmentPercentage.toFixed(1),
      issue: 'Entertainment spending is above average',
      suggestion: 'Look for free or low-cost entertainment alternatives'
    })
  }
  
  // Shopping analysis
  const shoppingSpending = categories['Shopping'] || 0
  const shoppingPercentage = (shoppingSpending / totalExpenses) * 100
  
  if (shoppingPercentage > 20) {
    problemAreas.push({
      category: 'Shopping',
      amount: shoppingSpending,
      percentage: shoppingPercentage.toFixed(1),
      issue: 'Shopping expenses are quite high',
      suggestion: 'Try implementing a 24-hour wait rule before purchases and create shopping lists'
    })
  }
  
  // Add problem areas to analysis
  if (problemAreas.length > 0) {
    problemAreas.forEach(area => {
      analysis += `• **${area.category}:** €${area.amount.toFixed(2)} (${area.percentage}%) - ${area.issue}\n`
      analysis += `  💡 *Suggestion:* ${area.suggestion}\n\n`
    })
  } else {
    analysis += "• Your spending seems well-balanced across categories! 🎉\n\n"
  }
  
  // Find largest single transaction
  const largestTransaction = transactions
    .filter(t => t.amount < 0)
    .reduce((max, t) => Math.abs(t.amount) > Math.abs(max.amount) ? t : max)
  
  if (largestTransaction) {
    analysis += `💸 **Largest Single Expense:** €${Math.abs(largestTransaction.amount).toFixed(2)}\n`
    analysis += `📝 **Description:** ${largestTransaction.description}\n`
    analysis += `📅 **Date:** ${largestTransaction.date.toLocaleDateString()}\n\n`
  }
  
  // Overall assessment
  analysis += "🎯 **Overall Assessment:**\n"
  if (problemAreas.length > 2) {
    analysis += "You have several areas where you could potentially reduce spending. Focus on the highest categories first!"
  } else if (problemAreas.length > 0) {
    analysis += "You're doing well overall, but there are a few areas where you could optimize your spending."
  } else {
    analysis += "Great job! Your spending appears to be well-distributed across categories."
  }
  
  return analysis
}

const getBudgetAdvice = (transactions) => {
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  
  const categories = getCategoryBreakdown(transactions)
  const monthlyIncome = totalIncome / 3 // Assuming 3 months of data
  const monthlyExpenses = totalExpenses / 3
  
  let budgetAdvice = "💰 **Budget Recommendations**\n\n"
  
  budgetAdvice += `📈 **Monthly Income:** €${monthlyIncome.toFixed(2)}\n`
  budgetAdvice += `📉 **Monthly Expenses:** €${monthlyExpenses.toFixed(2)}\n`
  budgetAdvice += `💵 **Net Monthly:** €${(monthlyIncome - monthlyExpenses).toFixed(2)}\n\n`
  
  budgetAdvice += "🎯 **50/30/20 Rule Breakdown:**\n"
  budgetAdvice += `• **Needs (50%):** €${(monthlyIncome * 0.5).toFixed(2)}\n`
  budgetAdvice += `• **Wants (30%):** €${(monthlyIncome * 0.3).toFixed(2)}\n`
  budgetAdvice += `• **Savings (20%):** €${(monthlyIncome * 0.2).toFixed(2)}\n\n`
  
  // Category budget suggestions
  budgetAdvice += "📊 **Suggested Monthly Category Budgets:**\n"
  const totalCategorySpending = Object.values(categories).reduce((sum, amount) => sum + amount, 0)
  
  Object.entries(categories).forEach(([category, amount]) => {
    const monthlyAmount = amount / 3
    const percentage = ((amount / totalCategorySpending) * 100).toFixed(1)
    budgetAdvice += `• **${category}:** €${monthlyAmount.toFixed(2)} (${percentage}%)\n`
  })
  
  return budgetAdvice
}

const getTimePeriodAnalysis = (input, transactions, monthlyData) => {
  // This is a simplified version - in a real app, you'd parse the time period more sophisticatedly
  const months = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b))
  const latestMonth = months[months.length - 1]
  
  if (input.includes('last month') || input.includes('previous month')) {
    const previousMonth = months[months.length - 2]
    if (previousMonth && monthlyData[previousMonth]) {
      const monthTransactions = monthlyData[previousMonth]
      const spending = monthTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
      const monthName = new Date(previousMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      
      return `📅 **${monthName} Analysis**\n\n` +
             `💸 **Total Spending:** €${spending.toFixed(2)}\n` +
             `📊 **Number of Transactions:** ${monthTransactions.filter(t => t.amount < 0).length}\n` +
             `💰 **Average Transaction:** €${(spending / monthTransactions.filter(t => t.amount < 0).length).toFixed(2)}\n\n` +
             `Want me to break this down by category?`
    }
  }
  
  return "I can analyze your spending for different time periods! Try asking about 'last month' or 'this month'."
}

const getComparisonAnalysis = (transactions, monthlyData) => {
  const months = Object.keys(monthlyData).sort((a, b) => new Date(a) - new Date(b))
  
  if (months.length < 2) {
    return "I need at least 2 months of data to make comparisons. Keep tracking your expenses!"
  }
  
  const latestMonth = months[months.length - 1]
  const previousMonth = months[months.length - 2]
  
  const latestSpending = monthlyData[latestMonth].filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const previousSpending = monthlyData[previousMonth].filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  const change = latestSpending - previousSpending
  const changePercent = ((change / previousSpending) * 100).toFixed(1)
  
  const latestMonthName = new Date(latestMonth).toLocaleDateString('en-US', { month: 'long' })
  const previousMonthName = new Date(previousMonth).toLocaleDateString('en-US', { month: 'long' })
  
  let comparison = `📊 **Month-to-Month Comparison**\n\n`
  comparison += `📅 **${previousMonthName}:** €${previousSpending.toFixed(2)}\n`
  comparison += `📅 **${latestMonthName}:** €${latestSpending.toFixed(2)}\n\n`
  
  if (change > 0) {
    comparison += `📈 **Increase:** €${change.toFixed(2)} (+${changePercent}%)\n`
    comparison += `💡 **Tip:** Your spending increased. Consider reviewing your recent purchases!`
  } else if (change < 0) {
    comparison += `📉 **Decrease:** €${Math.abs(change).toFixed(2)} (-${Math.abs(changePercent)}%)\n`
    comparison += `🎉 **Great job:** You've reduced your spending! Keep it up!`
  } else {
    comparison += `➡️ **No change:** Your spending remained consistent.`
  }
  
  return comparison
}

const getGeneralSpendingAnalysis = (transactions, monthlyData) => {
  if (!transactions || transactions.length === 0) {
    return "I don't have any transaction data to analyze yet. Please make sure your data is loaded!"
  }
  
  const categories = getCategoryBreakdown(transactions)
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const avgMonthlySpending = totalExpenses / 3 // Assuming 3 months of data
  
  let analysis = "💰 **Your Spending Overview**\n\n"
  
  analysis += `📊 **Total Spending:** €${totalExpenses.toFixed(2)}\n`
  analysis += `📈 **Monthly Average:** €${avgMonthlySpending.toFixed(2)}\n`
  analysis += `💵 **Income vs Expenses:** ${totalIncome > totalExpenses ? 'Positive' : 'Negative'} (€${(totalIncome - totalExpenses).toFixed(2)})\n\n`
  
  // Top categories
  const sortedCategories = Object.entries(categories).sort((a, b) => b[1] - a[1])
  analysis += "🏆 **Top 3 Spending Categories:**\n"
  sortedCategories.slice(0, 3).forEach((category, index) => {
    const emoji = ['🥇', '🥈', '🥉'][index]
    const percentage = ((category[1] / totalExpenses) * 100).toFixed(1)
    analysis += `${emoji} ${category[0]}: €${category[1].toFixed(2)} (${percentage}%)\n`
  })
  
  analysis += "\n💡 **Quick Insights:**\n"
  analysis += `• You spend about €${(avgMonthlySpending / 30).toFixed(2)} per day on average\n`
  analysis += `• Your biggest expense category is ${sortedCategories[0][0]}\n`
  analysis += `• You have ${Object.keys(categories).length} different spending categories\n\n`
  
  analysis += "🔍 Want me to dive deeper into any specific area? Just ask!"
  
  return analysis
}

const getDefaultResponse = () => {
  const suggestions = [
    "I'm here to help you understand your spending! Try asking me:\n\n• 'What's my spending summary?'\n• 'How much did I spend on food?'\n• 'What are my biggest expenses?'\n• 'Show me my spending trends'\n• 'Give me savings tips'",
    "I can help you analyze your finances! Here are some things you can ask:\n\n• Category-specific spending questions\n• Monthly comparisons\n• Savings recommendations\n• Budget advice\n• Expense breakdowns",
    "Let me help you with your finances! I can answer questions about:\n\n• Your spending patterns\n• Budget recommendations\n• Savings opportunities\n• Expense categories\n• Monthly trends"
  ]
  
  return suggestions[Math.floor(Math.random() * suggestions.length)]
}

// Utility functions
const getCategoryBreakdown = (transactions) => {
  const categories = {}
  
  transactions.filter(t => t.amount < 0).forEach(transaction => {
    const category = categorizeTransaction(transaction.description)
    if (!categories[category]) {
      categories[category] = 0
    }
    categories[category] += Math.abs(transaction.amount)
  })
  
  return categories
}

const categorizeTransaction = (description) => {
  const desc = description.toLowerCase()
  
  if (desc.includes('mcdonald') || desc.includes('dpz') || desc.includes('domino') || desc.includes('pizza')) {
    return 'Food & Dining'
  }
  if (desc.includes('netflix') || desc.includes('spotify') || desc.includes('concert') || desc.includes('cinema')) {
    return 'Entertainment'
  }
  if (desc.includes('bookstore') || desc.includes('amazon') || desc.includes('amzn')) {
    return 'Shopping'
  }
  if (desc.includes('parking') || desc.includes('garage')) {
    return 'Transport'
  }
  if (desc.includes('lidl') || desc.includes('local deli') || desc.includes('starbucks')) {
    return 'Groceries & Cafe'
  }
  if (desc.includes('payroll') || desc.includes('acme')) {
    return 'Income'
  }
  if (desc.includes('refund')) {
    return 'Refunds'
  }
  if (desc.includes('rent') || desc.includes('monthlyren')) {
    return 'Housing'
  }
  
  return 'Other'
}

const getCategorySpecificSavings = (input, transactions) => {
  const categoryMap = {
    'food': ['Food & Dining', 'Groceries & Cafe'],
    'dining': ['Food & Dining'],
    'entertainment': ['Entertainment'],
    'shopping': ['Shopping'],
    'transport': ['Transport'],
    'groceries': ['Groceries & Cafe'],
    'housing': ['Housing'],
    'rent': ['Housing']
  }
  
  const tips = {
    'Food & Dining': [
      '🍳 Cook more meals at home instead of dining out',
      '📱 Use food delivery apps less frequently',
      '🥪 Pack lunches for work',
      '🛒 Plan meals and make shopping lists',
      '🍽️ Try meal prep on weekends',
      '🥗 Choose restaurants with lunch specials'
    ],
    'Entertainment': [
      '🎬 Consider subscription sharing with family/friends',
      '🎵 Look for free entertainment options in your area',
      '📚 Use your local library for books, movies, and events',
      '🎮 Wait for sales before buying games or entertainment',
      '🏞️ Explore free outdoor activities and parks',
      '🎪 Look for community events and festivals'
    ],
    'Shopping': [
      '🛍️ Create a 24-hour waiting period before non-essential purchases',
      '🔍 Compare prices across different retailers',
      '💳 Use cashback apps and browser extensions',
      '📝 Make shopping lists and stick to them',
      '🏷️ Look for sales and use coupons',
      '🛒 Consider buying generic brands'
    ],
    'Transport': [
      '🚗 Consider carpooling or public transportation',
      '🚲 Use bike-sharing or walk for short distances',
      '⛽ Use apps to find cheaper gas stations',
      '🅿️ Look for free parking alternatives',
      '🚌 Get a monthly transit pass if you use public transport regularly',
      '🚶‍♀️ Walk or cycle for trips under 2km',
      '🚕 Use ride-sharing apps during off-peak hours for better rates'
    ],
    'Groceries & Cafe': [
      '☕ Make coffee at home instead of buying daily',
      '🛒 Shop with a list and stick to it',
      '🏪 Compare prices at different stores',
      '🥫 Buy generic brands for basics',
      '🍌 Buy seasonal produce',
      '🥪 Prepare your own snacks and lunches'
    ],
    'Housing': [
      '🏠 Consider refinancing if you have a mortgage',
      '💡 Use energy-efficient appliances to reduce utility bills',
      '🌡️ Adjust thermostat settings to save on heating/cooling',
      '🚿 Take shorter showers to reduce water bills',
      '🏠 Look for roommates to split costs',
      '🔧 Learn basic home repairs to avoid service calls'
    ]
  }
  
  let targetCategories = []
  let categoryKey = ''
  
  for (const [key, categories] of Object.entries(categoryMap)) {
    if (input.includes(key)) {
      targetCategories = categories
      categoryKey = key
      break
    }
  }
  
  if (targetCategories.length === 0) {
    return "I couldn't identify the category you're asking about. Try asking about: food, entertainment, shopping, transport, groceries, or housing!"
  }
  
  // Get spending data for this category
  const categorySpending = transactions
    .filter(t => t.amount < 0 && targetCategories.includes(categorizeTransaction(t.description)))
    .reduce((sum, t) => sum + Math.abs(t.amount), 0)
  
  // Get the tips for this category
  const relevantTips = tips[targetCategories[0]] || []
  
  let advice = `💡 **${targetCategories.join(' & ')} Savings Tips**\n\n`
  
  if (categorySpending > 0) {
    advice += `💸 **Current Spending:** €${categorySpending.toFixed(2)}\n\n`
  }
  
  advice += `🎯 **Specific Tips for ${targetCategories.join(' & ')}:**\n`
  relevantTips.forEach(tip => {
    advice += `${tip}\n`
  })
  
  if (categorySpending > 0) {
    const potentialSavings = categorySpending * 0.15 // Assume 15% potential savings
    advice += `\n📈 **Potential Monthly Savings:** €${(potentialSavings / 3).toFixed(2)}\n`
  }
  
  advice += `\n🔄 **General Tips:**\n`
  advice += `• Track your ${categoryKey} expenses daily\n`
  advice += `• Set a monthly budget for ${categoryKey}\n`
  advice += `• Look for alternatives before making purchases\n`
  advice += `• Consider if the purchase is a need or want\n\n`
  
  advice += `💬 Want tips for another category or overall savings advice?`
  
  return advice
}
