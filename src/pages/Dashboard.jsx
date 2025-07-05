import { useState, useEffect } from 'react'
import { parseCsvData, getMonthlyData } from '@/utils/csvParser'
import ExpenseSummary from '@/components/dashboard/ExpenseSummary'
import SummaryCards from '@/components/dashboard/SummaryCards'
import MonthlyOverview from '@/components/dashboard/MonthlyOverview'
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown'
import RecentTransactions from '@/components/dashboard/RecentTransactions'
import SpendingTrend from '@/components/dashboard/SpendingTrend'
import AlertCard from '@/components/dashboard/AlertCard'
import SpendyBuddy from '@/components/chatbot/SpendyBuddy'
import csvData from '@assets/codesprint_open_2025_sample_data.csv?raw'
import { FaCalendarAlt, FaFilter } from 'react-icons/fa'

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
        <SummaryCards monthlyData={monthlyData} />

        {/* Financial Alerts */}
        <div className="mb-8">
          <AlertCard monthlyData={monthlyData} transactions={transactions} />
        </div>

        {/* Monthly Overview Chart */}
        <MonthlyOverview monthlyData={monthlyData} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <CategoryBreakdown 
            monthlyData={monthlyData} 
            selectedMonth={selectedMonth} 
            setSelectedMonth={setSelectedMonth} 
          />

          {/* Expense Summary */}
          <ExpenseSummary monthlyData={monthlyData} transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Transactions */}
          <RecentTransactions transactions={transactions} />

          {/* Monthly Spending Trend */}
          <SpendingTrend monthlyData={monthlyData} />
        </div>
      </div>
      
      {/* SpendyBuddy Chatbot */}
      <SpendyBuddy transactions={transactions} monthlyData={monthlyData} />
    </div>
  )
}

export default Dashboard
