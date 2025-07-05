// Alert Engine for Financial Dashboard
// Provides rule-based alerts for spending patterns and financial goals

import { useAlertPreferences } from './alertPreferences'

export const ALERT_TYPES = {
  BUDGET_WARNING: 'budget_warning',
  BUDGET_EXCEEDED: 'budget_exceeded',
  UNUSUAL_SPENDING: 'unusual_spending',
  CATEGORY_SPIKE: 'category_spike',
  INCOME_DROP: 'income_drop',
  SAVINGS_OPPORTUNITY: 'savings_opportunity',
  RECURRING_EXPENSE: 'recurring_expense'
}

export const ALERT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

export class AlertEngine {
  constructor(monthlyData, transactions, preferences = null) {
    this.monthlyData = monthlyData
    this.transactions = transactions
    this.alerts = []
    // Accept preferences as a parameter or get from the store
    this.preferences = preferences || useAlertPreferences.getState()
  }

  // Main method to generate all alerts
  generateAlerts() {
    this.alerts = []
    
    // Get current month data
    const currentMonth = this.getCurrentMonth()
    const currentMonthData = this.monthlyData[currentMonth]
    const previousMonth = this.getPreviousMonth()
    const previousMonthData = this.monthlyData[previousMonth]

    if (currentMonthData) {
      this.checkBudgetAlerts(currentMonth, currentMonthData)
      this.checkCategorySpikes(currentMonth, currentMonthData, previousMonthData)
      this.checkUnusualSpending(currentMonth, currentMonthData)
      this.checkSavingsOpportunities(currentMonth, currentMonthData)
    }

    if (previousMonthData) {
      this.checkIncomeChanges(currentMonthData, previousMonthData)
    }

    return this.alerts.sort((a, b) => this.getSeverityWeight(b.severity) - this.getSeverityWeight(a.severity))
  }

  // Check budget-related alerts
  checkBudgetAlerts(month, monthData) {
    if (!this.preferences.getAlertSetting('budgetExceededEnabled')) return

    Object.entries(monthData.categories).forEach(([category, spent]) => {
      const budget = this.preferences.getBudgetThreshold(category)
      const percentage = (spent / budget) * 100
      const warningThreshold = this.preferences.getAlertSetting('budgetWarningThreshold')

      if (percentage >= 100) {
        this.addAlert({
          type: ALERT_TYPES.BUDGET_EXCEEDED,
          severity: ALERT_SEVERITY.CRITICAL,
          title: `${category} Budget Exceeded!`,
          message: `You've spent €${spent.toFixed(2)} on ${category} this month, which is ${percentage.toFixed(0)}% of your €${budget} budget.`,
          category,
          value: spent,
          threshold: budget,
          percentage: percentage.toFixed(1)
        })
      } else if (percentage >= warningThreshold) {
        this.addAlert({
          type: ALERT_TYPES.BUDGET_WARNING,
          severity: ALERT_SEVERITY.HIGH,
          title: `${category} Budget Alert`,
          message: `You've spent ${percentage.toFixed(0)}% of your ${category} budget this month (€${spent.toFixed(2)} of €${budget}).`,
          category,
          value: spent,
          threshold: budget,
          percentage: percentage.toFixed(1)
        })
      }
    })
  }

  // Check for unusual spending patterns
  checkCategorySpikes(month, currentData, previousData) {
    if (!previousData || !this.preferences.getAlertSetting('categorySpikesEnabled')) return

    const minSpending = this.preferences.getAlertSetting('minimumSpendingForAlerts')

    Object.entries(currentData.categories).forEach(([category, currentSpent]) => {
      const previousSpent = previousData.categories[category] || 0
      
      if (previousSpent > 0 && currentSpent > minSpending) {
        const increase = ((currentSpent - previousSpent) / previousSpent) * 100
        
        if (increase > 50) {
          this.addAlert({
            type: ALERT_TYPES.CATEGORY_SPIKE,
            severity: ALERT_SEVERITY.MEDIUM,
            title: `${category} Spending Spike`,
            message: `Your ${category} spending increased by ${increase.toFixed(0)}% compared to last month (€${currentSpent.toFixed(2)} vs €${previousSpent.toFixed(2)}).`,
            category,
            value: currentSpent,
            previousValue: previousSpent,
            increase: increase.toFixed(1)
          })
        }
      }
    })
  }

  // Check for unusual total spending
  checkUnusualSpending(month, monthData) {
    if (!this.preferences.getAlertSetting('unusualSpendingEnabled')) return

    const totalSpent = monthData.expenses
    const avgSpending = this.getAverageMonthlySpending()
    
    if (avgSpending > 0) {
      const difference = ((totalSpent - avgSpending) / avgSpending) * 100
      
      if (difference > 25 && totalSpent > 1000) {
        this.addAlert({
          type: ALERT_TYPES.UNUSUAL_SPENDING,
          severity: ALERT_SEVERITY.MEDIUM,
          title: 'Unusual Spending Pattern',
          message: `Your total spending this month (€${totalSpent.toFixed(2)}) is ${difference.toFixed(0)}% higher than your average (€${avgSpending.toFixed(2)}).`,
          value: totalSpent,
          average: avgSpending,
          difference: difference.toFixed(1)
        })
      }
    }
  }

  // Check for savings opportunities
  checkSavingsOpportunities(month, monthData) {
    if (!this.preferences.getAlertSetting('savingsOpportunitiesEnabled')) return

    const income = monthData.income
    const expenses = monthData.expenses
    const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0
    
    if (savingsRate < 10 && income > 0) {
      this.addAlert({
        type: ALERT_TYPES.SAVINGS_OPPORTUNITY,
        severity: ALERT_SEVERITY.LOW,
        title: 'Low Savings Rate',
        message: `You're only saving ${savingsRate.toFixed(1)}% of your income this month. Consider reviewing your expenses to increase savings.`,
        savingsRate: savingsRate.toFixed(1),
        income,
        expenses
      })
    }
  }

  // Check for income changes
  checkIncomeChanges(currentData, previousData) {
    if (!this.preferences.getAlertSetting('incomeChangesEnabled')) return

    const currentIncome = currentData.income
    const previousIncome = previousData.income
    
    if (previousIncome > 0 && currentIncome > 0) {
      const change = ((currentIncome - previousIncome) / previousIncome) * 100
      
      if (change < -20) {
        this.addAlert({
          type: ALERT_TYPES.INCOME_DROP,
          severity: ALERT_SEVERITY.HIGH,
          title: 'Income Decrease Alert',
          message: `Your income decreased by ${Math.abs(change).toFixed(0)}% compared to last month (€${currentIncome.toFixed(2)} vs €${previousIncome.toFixed(2)}).`,
          value: currentIncome,
          previousValue: previousIncome,
          change: change.toFixed(1)
        })
      }
    }
  }

  // Helper methods
  getCurrentMonth() {
    const months = Object.keys(this.monthlyData).sort((a, b) => new Date(a) - new Date(b))
    return months[months.length - 1]
  }

  getPreviousMonth() {
    const months = Object.keys(this.monthlyData).sort((a, b) => new Date(a) - new Date(b))
    return months[months.length - 2]
  }

  getAverageMonthlySpending() {
    const months = Object.keys(this.monthlyData)
    if (months.length === 0) return 0
    
    const totalSpending = months.reduce((sum, month) => sum + this.monthlyData[month].expenses, 0)
    return totalSpending / months.length
  }

  addAlert(alert) {
    this.alerts.push({
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      ...alert
    })
  }

  getSeverityWeight(severity) {
    switch (severity) {
      case ALERT_SEVERITY.CRITICAL: return 4
      case ALERT_SEVERITY.HIGH: return 3
      case ALERT_SEVERITY.MEDIUM: return 2
      case ALERT_SEVERITY.LOW: return 1
      default: return 0
    }
  }
}

// Factory function to create alerts
export const generateAlerts = (monthlyData, transactions, preferences = null) => {
  const engine = new AlertEngine(monthlyData, transactions, preferences)
  return engine.generateAlerts()
}

// Utility function to generate alerts with current preferences
export const generateAlertsWithCurrentPreferences = (monthlyData, transactions) => {
  const preferences = useAlertPreferences.getState()
  return generateAlerts(monthlyData, transactions, preferences)
}
