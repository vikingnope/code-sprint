// Demo utility to simulate alert scenarios for testing
// This can be used to test the alert system with different data scenarios

export const createTestScenarios = () => {
  const baseDate = new Date('2025-06-01')
  
  // Scenario 1: Budget exceeded alerts
  const budgetExceededScenario = {
    transactions: [
      { date: new Date('2025-06-01'), description: 'Netflix subscription', amount: 15, type: 'debit' },
      { date: new Date('2025-06-02'), description: 'Spotify premium', amount: 25, type: 'debit' },
      { date: new Date('2025-06-03'), description: 'Cinema tickets', amount: 30, type: 'debit' },
      { date: new Date('2025-06-04'), description: 'Concert tickets', amount: 150, type: 'debit' }, // This should trigger entertainment budget alert
      { date: new Date('2025-06-05'), description: 'McDonald\'s lunch', amount: 12, type: 'debit' },
      { date: new Date('2025-06-06'), description: 'Pizza delivery', amount: 25, type: 'debit' },
      { date: new Date('2025-06-07'), description: 'Restaurant dinner', amount: 80, type: 'debit' },
      { date: new Date('2025-06-08'), description: 'Groceries', amount: 120, type: 'debit' },
      { date: new Date('2025-06-09'), description: 'More restaurant visits', amount: 200, type: 'debit' }, // This should trigger food budget alert
      { date: new Date('2025-06-10'), description: 'Salary', amount: 3000, type: 'credit' },
    ]
  }

  // Scenario 2: Category spike alerts
  const categorySpikesScenario = {
    previousMonth: {
      'Entertainment': 50,
      'Food & Dining': 200,
      'Shopping': 100
    },
    currentMonth: {
      'Entertainment': 180, // 260% increase
      'Food & Dining': 320, // 60% increase
      'Shopping': 95 // Slight decrease
    }
  }

  // Scenario 3: Unusual spending pattern
  const unusualSpendingScenario = {
    averageMonthlySpending: 1200,
    currentMonthSpending: 1800 // 50% increase
  }

  // Scenario 4: Low savings rate
  const lowSavingsScenario = {
    income: 3000,
    expenses: 2850, // Only 5% savings rate
  }

  return {
    budgetExceededScenario,
    categorySpikesScenario,
    unusualSpendingScenario,
    lowSavingsScenario
  }
}

// Function to create test monthly data that will trigger alerts
export const createTestMonthlyData = () => {
  return {
    'June 2025': {
      income: 3000,
      expenses: 2850,
      categories: {
        'Entertainment': 180, // Will exceed default budget of 150
        'Food & Dining': 320, // Will exceed default budget of 300
        'Shopping': 95,
        'Transport': 60,
        'Groceries & Cafe': 280, // Close to budget limit
        'Housing': 600,
        'Services': 85,
        'Other': 30
      }
    },
    'May 2025': {
      income: 3200,
      expenses: 2100,
      categories: {
        'Entertainment': 50,
        'Food & Dining': 200,
        'Shopping': 100,
        'Transport': 80,
        'Groceries & Cafe': 250,
        'Housing': 800,
        'Services': 100,
        'Other': 20
      }
    },
    'April 2025': {
      income: 3100,
      expenses: 2050,
      categories: {
        'Entertainment': 60,
        'Food & Dining': 180,
        'Shopping': 120,
        'Transport': 70,
        'Groceries & Cafe': 240,
        'Housing': 800,
        'Services': 90,
        'Other': 25
      }
    }
  }
}

// Helper function to create test transactions
export const createTestTransactions = () => {
  const transactions = []
  const categories = [
    { desc: 'Netflix subscription', category: 'Entertainment', amount: 15 },
    { desc: 'Spotify premium', category: 'Entertainment', amount: 25 },
    { desc: 'Concert tickets', category: 'Entertainment', amount: 150 },
    { desc: 'McDonald\'s lunch', category: 'Food & Dining', amount: 12 },
    { desc: 'Pizza delivery', category: 'Food & Dining', amount: 25 },
    { desc: 'Restaurant dinner', category: 'Food & Dining', amount: 80 },
    { desc: 'Fancy restaurant', category: 'Food & Dining', amount: 200 },
    { desc: 'Amazon purchase', category: 'Shopping', amount: 45 },
    { desc: 'Zara shopping', category: 'Shopping', amount: 80 },
    { desc: 'Lidl groceries', category: 'Groceries & Cafe', amount: 120 },
    { desc: 'Starbucks coffee', category: 'Groceries & Cafe', amount: 8 },
    { desc: 'Parking garage', category: 'Transport', amount: 15 },
    { desc: 'Monthly rent', category: 'Housing', amount: 600 },
    { desc: 'Malta Post services', category: 'Services', amount: 25 },
    { desc: 'Payroll deposit', category: 'Income', amount: 3000 }
  ]

  // Create transactions for the past 3 months
  const months = ['April', 'May', 'June']
  months.forEach((month, monthIndex) => {
    categories.forEach((item, index) => {
      const date = new Date(`2025-${monthIndex + 4}-${(index % 28) + 1}`)
      transactions.push({
        date,
        description: item.desc,
        amount: item.amount,
        type: item.category === 'Income' ? 'credit' : 'debit'
      })
    })
  })

  return transactions
}

export default { createTestScenarios, createTestMonthlyData, createTestTransactions }
