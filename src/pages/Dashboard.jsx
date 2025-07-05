import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { parseCsvData, getMonthlyData, categorizeTransaction } from '@/utils/csvParser'
import ExpenseSummary from '@/components/ExpenseSummary'
import csvData from '@assets/codesprint_open_2025_sample_data.csv?raw'
import { FaArrowUp, FaArrowDown, FaWallet, FaChartLine, FaCalendarAlt, FaFilter } from 'react-icons/fa'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16', '#EC4899', '#6366F1']

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-300 font-medium">Loading your financial dashboard...</p>
        </div>
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
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                Financial Dashboard
              </h1>
              <p className="text-slate-300 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                Your expense overview for the past 3 months
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-2 shadow-sm border border-slate-700">
                <FaFilter className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Total Income</p>
                <p className="text-3xl font-bold text-green-400">€{totalIncome.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <FaArrowUp className="text-green-400 text-sm" />
                  <span className="text-sm text-green-400 font-medium">+12.5%</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-xl border border-green-500/30">
                <FaArrowUp className="w-8 h-8 text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Total Expenses</p>
                <p className="text-3xl font-bold text-red-400">€{totalExpenses.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-2">
                  <FaArrowDown className="text-red-400 text-sm" />
                  <span className="text-sm text-red-400 font-medium">-8.2%</span>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-400/20 rounded-xl border border-red-500/30">
                <FaArrowDown className="w-8 h-8 text-red-400" />
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-400 mb-1">Net Balance</p>
                <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  €{netBalance.toLocaleString()}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <FaWallet className={`text-sm ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className={`text-sm font-medium ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {netBalance >= 0 ? 'Positive' : 'Negative'} Balance
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-xl border ${netBalance >= 0 ? 'bg-gradient-to-br from-green-500/20 to-green-400/20 border-green-500/30' : 'bg-gradient-to-br from-red-500/20 to-red-400/20 border-red-500/30'}`}>
                <FaWallet className={`w-8 h-8 ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Monthly Overview Chart */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 mb-8 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-6">
            <FaChartLine className="text-blue-400 text-xl" />
            <h2 className="text-2xl font-bold text-slate-200">Monthly Overview</h2>
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
              <YAxis tick={{ fill: '#9ca3af' }} />
              <Tooltip 
                formatter={(value) => [`€${value.toLocaleString()}`, '']} 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #374151', 
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                  color: '#f1f5f9'
                }}
              />
              <Bar dataKey="income" fill="#10B981" name="Income" radius={[4, 4, 0, 0]} />
              <Bar dataKey="expenses" fill="#EF4444" name="Expenses" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="lg:col-span-2 bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-200">Expense Categories</h2>
              <select 
                value={selectedMonth} 
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-200"
              >
                {Object.keys(monthlyData).map(month => (
                  <option key={month} value={month} className="bg-slate-700 text-slate-200">{month}</option>
                ))}
              </select>
            </div>
            {categoryData.length > 0 && (
              <div className="space-y-8">
                {/* Modern Pie Chart */}
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={false}
                        outerRadius={140}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        stroke="#374151"
                        strokeWidth={2}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`€${value.toLocaleString()}`, 'Amount']} 
                        contentStyle={{ 
                          backgroundColor: '#1e293b', 
                          border: '1px solid #374151', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                          color: '#ffffff'
                        }}
                        labelStyle={{
                          color: '#ffffff',
                          fontWeight: 'bold'
                        }}
                        itemStyle={{
                          color: '#ffffff'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                {/* Modern Legend in 2-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryData.map((entry, index) => {
                    const percentage = ((entry.value / categoryData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1);
                    return (
                      <div key={entry.name} className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-lg border border-slate-600/50 hover:bg-slate-600/30 transition-colors">
                        <div 
                          className="w-5 h-5 rounded-full shadow-lg flex-shrink-0"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-200 font-medium text-sm truncate">{entry.name}</p>
                          <p className="text-slate-400 text-xs">{percentage}%</p>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-slate-200 font-bold text-sm">€{entry.value.toLocaleString()}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Expense Summary */}
          <div className="lg:col-span-1">
            <ExpenseSummary monthlyData={monthlyData} transactions={transactions} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Transactions */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {recentTransactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-600/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-full border ${transaction.type === 'credit' ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                      {transaction.type === 'credit' ? (
                        <FaArrowUp className={`w-4 h-4 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                      ) : (
                        <FaArrowDown className={`w-4 h-4 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-200 truncate">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-slate-400">
                        {transaction.date.toLocaleDateString()} • {categorizeTransaction(transaction.description)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                      {transaction.type === 'credit' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Spending Trend */}
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-200 mb-6">Spending Trend</h2>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} />
                <YAxis tick={{ fill: '#9ca3af' }} />
                <Tooltip 
                  formatter={(value) => [`€${value.toLocaleString()}`, '']} 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: '1px solid #374151', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
                    color: '#f1f5f9'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#EF4444" 
                  strokeWidth={3} 
                  name="Expenses"
                  dot={{ fill: '#EF4444', strokeWidth: 2, r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="net" 
                  stroke="#10B981" 
                  strokeWidth={3} 
                  name="Net Balance"
                  dot={{ fill: '#10B981', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
