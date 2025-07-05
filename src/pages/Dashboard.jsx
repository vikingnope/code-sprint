import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { parseCsvData, getMonthlyData, categorizeTransaction } from '@/utils/csvParser'
import ExpenseSummary from '@/components/ExpenseSummary'
import csvData from '@assets/codesprint_open_2025_sample_data.csv?raw'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF7300', '#00C49F', '#FFBB28']

const Dashboard = () => {
  const [transactions, setTransactions] = useState([])
  const [monthlyData, setMonthlyData] = useState({})
  const [selectedMonth, setSelectedMonth] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const parsedData = parseCsvData(csvData)
      const filteredData = parsedData.filter(transaction => 
        transaction.date && !isNaN(transaction.date.getTime())
      )
      
      // Filter to last 3 months (April, May, June 2025)
      const threeMonthsAgo = new Date('2025-04-01')
      const recentTransactions = filteredData.filter(transaction => 
        transaction.date >= threeMonthsAgo
      )
      
      setTransactions(recentTransactions)
      const monthly = getMonthlyData(recentTransactions)
      setMonthlyData(monthly)
      
      // Set default selected month to the latest month
      const months = Object.keys(monthly).sort((a, b) => new Date(a) - new Date(b))
      if (months.length > 0) {
        setSelectedMonth(months[months.length - 1])
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error parsing CSV data:', error)
      setLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading your financial dashboard...</div>
      </div>
    )
  }

  const monthlyChartData = Object.entries(monthlyData).map(([month, data]) => ({
    month: month.split(' ')[0], // Get just the month name
    income: data.income,
    expenses: data.expenses,
    net: data.income - data.expenses
  }))

  const categoryData = selectedMonth && monthlyData[selectedMonth] 
    ? Object.entries(monthlyData[selectedMonth].categories).map(([category, amount]) => ({
        name: category,
        value: Math.round(amount * 100) / 100
      }))
    : []

  const totalIncome = Object.values(monthlyData).reduce((sum, data) => sum + data.income, 0)
  const totalExpenses = Object.values(monthlyData).reduce((sum, data) => sum + data.expenses, 0)
  const netBalance = totalIncome - totalExpenses

  const recentTransactions = transactions
    .sort((a, b) => b.date - a.date)
    .slice(0, 10)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Financial Dashboard</h1>
          <p className="text-gray-600">Your expense overview for the past 3 months</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Income</p>
                <p className="text-2xl font-bold text-green-600">€{totalIncome.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">€{totalExpenses.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Net Balance</p>
                <p className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  €{netBalance.toLocaleString()}
                </p>
              </div>
              <div className={`p-3 rounded-full ${netBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                <svg className={`w-6 h-6 ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Overview Chart */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Monthly Overview</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, '']} />
              <Bar dataKey="income" fill="#10B981" name="Income" />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Expense Categories</h2>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.keys(monthlyData).map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            {categoryData.length > 0 && (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Expense Summary */}
          <div className="lg:col-span-1">
            <ExpenseSummary monthlyData={monthlyData} transactions={transactions} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.date.toLocaleDateString()} • {categorizeTransaction(transaction.description)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Spending Trend */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Spending Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`€${value.toLocaleString()}`, '']} />
                <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={2} name="Expenses" />
                <Line type="monotone" dataKey="net" stroke="#10B981" strokeWidth={2} name="Net Balance" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
