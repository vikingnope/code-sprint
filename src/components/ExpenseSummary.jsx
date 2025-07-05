import { categorizeTransaction } from '@/utils/csvParser'

const ExpenseSummary = ({ monthlyData, transactions }) => {
  const getCurrentMonth = () => {
    return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
  }

  const getTopCategories = () => {
    const categoryTotals = {}
    
    transactions.forEach(transaction => {
      if (transaction.type === 'debit') {
        const category = categorizeTransaction(transaction.description)
        if (!categoryTotals[category]) {
          categoryTotals[category] = 0
        }
        categoryTotals[category] += Math.abs(transaction.amount)
      }
    })

    return Object.entries(categoryTotals)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, amount]) => ({
        category,
        amount: Math.round(amount * 100) / 100
      }))
  }

  const getAverageMonthlyExpense = () => {
    const monthCount = Object.keys(monthlyData).length
    const totalExpenses = Object.values(monthlyData).reduce((sum, data) => sum + data.expenses, 0)
    return monthCount > 0 ? Math.round((totalExpenses / monthCount) * 100) / 100 : 0
  }

  const topCategories = getTopCategories()
  const averageMonthlyExpense = getAverageMonthlyExpense()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Expense Summary</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Average Monthly Spending</h3>
          <p className="text-2xl font-bold text-blue-600">€{averageMonthlyExpense.toLocaleString()}</p>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Top Spending Categories</h3>
          <div className="space-y-3">
            {topCategories.map(({ category, amount }, index) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                  </div>
                  <span className="text-gray-700 font-medium">{category}</span>
                </div>
                <span className="text-gray-900 font-semibold">€{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseSummary
