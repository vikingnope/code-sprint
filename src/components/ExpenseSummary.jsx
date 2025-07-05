import { categorizeTransaction } from '@/utils/csvParser'
import { FaTrophy, FaChartPie, FaCalculator } from 'react-icons/fa'

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

  const categoryIcons = {
    'Food & Dining': '🍽️',
    'Entertainment': '🎬',
    'Shopping': '🛍️',
    'Transport': '🚗',
    'Groceries & Cafe': '☕',
    'Housing': '🏠',
    'Services': '⚙️',
    'Fees': '💳',
    'Other': '📦'
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center gap-3 mb-6">
        <FaChartPie className="text-purple-400 text-xl" />
        <h2 className="text-2xl font-bold text-slate-200">Expense Summary</h2>
      </div>
      
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-slate-700/50 to-slate-600/50 border border-slate-600 rounded-xl p-4">
          <div className="flex items-center gap-3 mb-2">
            <FaCalculator className="text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-200">Average Monthly Spending</h3>
          </div>
          <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            €{averageMonthlyExpense.toLocaleString()}
          </p>
        </div>

        <div>
          <div className="flex items-center gap-3 mb-4">
            <FaTrophy className="text-yellow-400" />
            <h3 className="text-lg font-semibold text-slate-200">Top Spending Categories</h3>
          </div>
          <div className="space-y-3">
            {topCategories.map(({ category, amount }, index) => (
              <div key={category} className="flex items-center justify-between p-3 bg-slate-700/50 border border-slate-600 rounded-lg hover:bg-slate-600/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    index === 0 ? 'bg-yellow-500/20 border-yellow-500/30' : 
                    index === 1 ? 'bg-slate-500/20 border-slate-500/30' : 
                    index === 2 ? 'bg-orange-500/20 border-orange-500/30' : 'bg-blue-500/20 border-blue-500/30'
                  }`}>
                    <span className="text-xl">
                      {categoryIcons[category] || '📦'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-200 font-medium">{category}</span>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        index === 0 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 
                        index === 1 ? 'bg-slate-500/20 text-slate-300 border border-slate-500/30' : 
                        index === 2 ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}>
                        #{index + 1}
                      </span>
                    </div>
                  </div>
                </div>
                <span className="text-slate-100 font-bold text-lg">€{amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseSummary
