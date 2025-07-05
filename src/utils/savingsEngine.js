import { categorizeTransaction } from './csvParser'

export const calculateSavingsCapacity = (monthlyData) => {
  const monthlyAverages = {}
  let totalIncome = 0
  let totalExpenses = 0
  let monthCount = 0

  Object.entries(monthlyData).forEach(([month, data]) => {
    totalIncome += data.income
    totalExpenses += data.expenses
    monthCount++
  })

  const avgIncome = totalIncome / monthCount
  const avgExpenses = totalExpenses / monthCount
  const avgSavings = avgIncome - avgExpenses

  // Calculate category averages
  const categoryTotals = {}
  Object.entries(monthlyData).forEach(([month, data]) => {
    Object.entries(data.categories).forEach(([category, amount]) => {
      if (!categoryTotals[category]) {
        categoryTotals[category] = 0
      }
      categoryTotals[category] += amount
    })
  })

  const categoryAverages = {}
  Object.entries(categoryTotals).forEach(([category, total]) => {
    categoryAverages[category] = total / monthCount
  })

  return {
    avgIncome,
    avgExpenses,
    avgSavings,
    categoryAverages,
    savingsRate: (avgSavings / avgIncome) * 100
  }
}

export const suggestSavingsAmount = (savingsCapacity, currentGoals = []) => {
  const { avgIncome, avgExpenses, avgSavings } = savingsCapacity
  
  // Account for existing goals first
  const existingGoalAmount = currentGoals.reduce((sum, goal) => sum + goal.monthlyAmount, 0)
  const availableForNewGoals = Math.max(0, avgSavings - existingGoalAmount)
  
  // Conservative approach: 25-35% of available surplus, capped at 10% of income
  const conservativePercentage = 0.30 // 30% of available surplus
  const conservativeSuggestion = Math.min(
    availableForNewGoals * conservativePercentage,
    avgIncome * 0.10 // Safety cap at 10% of income
  )
  
  // Aggressive approach: 60-80% of available surplus, capped at 20% of income  
  const aggressivePercentage = 0.70 // 70% of available surplus
  const aggressiveSuggestion = Math.min(
    availableForNewGoals * aggressivePercentage,
    avgIncome * 0.20 // Safety cap at 20% of income
  )

  return {
    conservative: Math.max(0, conservativeSuggestion),
    aggressive: Math.max(0, aggressiveSuggestion),
    available: availableForNewGoals,
    currentSavings: avgSavings
  }
}

export const generateCutbackSuggestions = (categoryAverages, savingsCapacity) => {
  const suggestions = []
  
  // Define categories that are typically flexible
  const flexibleCategories = {
    'Food & Dining': {
      maxReduction: 0.25,
      difficulty: 'Easy',
      tips: ['Cook more meals at home', 'Reduce takeout frequency', 'Use meal planning']
    },
    'Entertainment': {
      maxReduction: 0.30,
      difficulty: 'Easy',
      tips: ['Find free activities', 'Use streaming services instead of cinema', 'Look for discounts']
    },
    'Shopping': {
      maxReduction: 0.40,
      difficulty: 'Medium',
      tips: ['Create a shopping list', 'Wait 24 hours before purchases', 'Compare prices online']
    },
    'Groceries & Cafe': {
      maxReduction: 0.15,
      difficulty: 'Easy',
      tips: ['Buy generic brands', 'Use coupons', 'Avoid impulse buys']
    },
    'Transport': {
      maxReduction: 0.20,
      difficulty: 'Medium',
      tips: ['Use public transport', 'Walk or bike when possible', 'Carpool']
    }
  }

  Object.entries(categoryAverages).forEach(([category, monthlyAmount]) => {
    if (flexibleCategories[category] && monthlyAmount > 50) { // Only suggest if spending > $50/month
      const categoryInfo = flexibleCategories[category]
      const reductionPercentages = [0.10, 0.15, 0.20, categoryInfo.maxReduction]
      
      reductionPercentages.forEach(percentage => {
        if (percentage <= categoryInfo.maxReduction) {
          const potentialSavings = monthlyAmount * percentage
          const newAmount = monthlyAmount - potentialSavings
          
          suggestions.push({
            category,
            currentAmount: monthlyAmount,
            reductionPercentage: percentage * 100,
            potentialSavings,
            newAmount,
            difficulty: categoryInfo.difficulty,
            tips: categoryInfo.tips,
            annualSavings: potentialSavings * 12
          })
        }
      })
    }
  })

  // Sort by potential savings (highest first)
  return suggestions.sort((a, b) => b.potentialSavings - a.potentialSavings)
}

export const generateSmartSuggestions = (categoryAverages, transactions) => {
  const suggestions = []
  
  // Analyze spending patterns
  const spendingPatterns = analyzeSpendingPatterns(transactions)
  
  // High-frequency low-value purchases
  if (spendingPatterns.frequentSmallPurchases.length > 0) {
    spendingPatterns.frequentSmallPurchases.forEach(pattern => {
      suggestions.push({
        type: 'frequency',
        title: `Reduce ${pattern.description} purchases`,
        description: `You make ${pattern.frequency} small purchases averaging $${pattern.avgAmount.toFixed(2)}`,
        potentialSavings: pattern.totalMonthly * 0.3,
        difficulty: 'Easy',
        category: pattern.category,
        actionItems: [
          'Set a weekly budget for small purchases',
          'Use a spending tracker app',
          'Consider bulk buying'
        ]
      })
    })
  }

  // Weekend vs weekday spending
  if (spendingPatterns.weekendPremium > 20) {
    suggestions.push({
      type: 'timing',
      title: 'Reduce weekend premium spending',
      description: `You spend ${spendingPatterns.weekendPremium.toFixed(0)}% more on weekends`,
      potentialSavings: spendingPatterns.weekendExcess * 0.4,
      difficulty: 'Medium',
      category: 'Entertainment',
      actionItems: [
        'Plan weekend activities in advance',
        'Set a weekend spending limit',
        'Find free weekend activities'
      ]
    })
  }

  // Late-night purchases (typically impulse buys)
  if (spendingPatterns.lateNightSpending > 0) {
    suggestions.push({
      type: 'timing',
      title: 'Avoid late-night impulse purchases',
      description: `Late-night purchases account for $${spendingPatterns.lateNightSpending.toFixed(2)} monthly`,
      potentialSavings: spendingPatterns.lateNightSpending * 0.6,
      difficulty: 'Easy',
      category: 'Shopping',
      actionItems: [
        'Use shopping cart delay features',
        'Set phone spending limits after 9 PM',
        'Create a wish list instead of buying immediately'
      ]
    })
  }

  return suggestions.sort((a, b) => b.potentialSavings - a.potentialSavings)
}

const analyzeSpendingPatterns = (transactions) => {
  const patterns = {
    frequentSmallPurchases: [],
    weekendPremium: 0,
    weekendExcess: 0,
    lateNightSpending: 0
  }

  // Group transactions by description/merchant
  const merchantGroups = {}
  let weekdayTotal = 0
  let weekendTotal = 0
  let weekdayCount = 0
  let weekendCount = 0
  let lateNightTotal = 0

  transactions.forEach(transaction => {
    if (transaction.type === 'debit') {
      const amount = Math.abs(transaction.amount)
      const date = new Date(transaction.date)
      const hour = date.getHours()
      const dayOfWeek = date.getDay()
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
      
      // Group by merchant
      const merchant = transaction.description.toLowerCase()
      if (!merchantGroups[merchant]) {
        merchantGroups[merchant] = {
          transactions: [],
          total: 0,
          category: categorizeTransaction(transaction.description)
        }
      }
      merchantGroups[merchant].transactions.push(transaction)
      merchantGroups[merchant].total += amount

      // Weekend vs weekday analysis
      if (isWeekend) {
        weekendTotal += amount
        weekendCount++
      } else {
        weekdayTotal += amount
        weekdayCount++
      }

      // Late night spending (after 9 PM)
      if (hour >= 21 || hour <= 2) {
        lateNightTotal += amount
      }
    }
  })

  // Analyze frequent small purchases
  Object.entries(merchantGroups).forEach(([merchant, data]) => {
    if (data.transactions.length >= 3) { // At least 3 transactions
      const avgAmount = data.total / data.transactions.length
      if (avgAmount < 25) { // Small amounts
        patterns.frequentSmallPurchases.push({
          description: merchant,
          frequency: data.transactions.length,
          avgAmount,
          totalMonthly: data.total,
          category: data.category
        })
      }
    }
  })

  // Calculate weekend premium
  const avgWeekday = weekdayCount > 0 ? weekdayTotal / weekdayCount : 0
  const avgWeekend = weekendCount > 0 ? weekendTotal / weekendCount : 0
  if (avgWeekday > 0) {
    patterns.weekendPremium = ((avgWeekend - avgWeekday) / avgWeekday) * 100
    patterns.weekendExcess = Math.max(0, avgWeekend - avgWeekday) * weekendCount
  }

  patterns.lateNightSpending = lateNightTotal

  return patterns
}

export const calculateGoalProgress = (goal, monthlyData) => {
  const monthsElapsed = Math.max(1, 
    Object.keys(monthlyData).length
  )
  
  const expectedProgress = goal.monthlyAmount * monthsElapsed
  const actualProgress = goal.currentAmount || 0
  
  return {
    percentage: Math.min(100, (actualProgress / goal.targetAmount) * 100),
    monthsToGoal: Math.ceil((goal.targetAmount - actualProgress) / goal.monthlyAmount),
    onTrack: actualProgress >= expectedProgress * 0.9, // 90% of expected
    shortfall: Math.max(0, expectedProgress - actualProgress)
  }
}
