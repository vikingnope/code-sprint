import { useState, useEffect } from 'react'
import { parseCsvData, getMonthlyData } from '@/utils/csvParser'
import { calculateSavingsCapacity } from '@/utils/savingsEngine'
import SavingsGoals from '@/components/savings/SavingsGoals'
import SavingsRecommendations from '@/components/savings/SavingsRecommendations'
import SpendyBuddy from '@/components/chatbot/SpendyBuddy'
import csvData from '@assets/codesprint_open_2025_sample_data.csv?raw'

const Savings = () => {
  const [transactions, setTransactions] = useState([])
  const [monthlyData, setMonthlyData] = useState({})
  const [savingsCapacity, setSavingsCapacity] = useState({})
  const [currentGoals, setCurrentGoals] = useState([])
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
      
      // Calculate savings capacity
      const capacity = calculateSavingsCapacity(monthly)
      setSavingsCapacity(capacity)
      
      setLoading(false)
    } catch (error) {
      console.error('Error parsing CSV data:', error)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const savedGoals = localStorage.getItem('savingsGoals')
    if (savedGoals) {
      setCurrentGoals(JSON.parse(savedGoals))
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-slate-600 border-t-blue-400 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-slate-300 font-medium">Loading savings data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1 sm:mb-2">
            Savings Center
          </h1>
          <p className="text-xs sm:text-sm lg:text-base text-slate-300 leading-relaxed">
            Set goals and get recommendations to save more
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 lg:mb-8">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border border-slate-700">
            <div className="text-xs sm:text-sm text-slate-400 mb-2">Current Monthly Savings</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 mb-2">
              €{savingsCapacity?.avgSavings?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500">
              {savingsCapacity?.savingsRate?.toFixed(1) || 0}% of income
            </div>
          </div>
          
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border border-slate-700">
            <div className="text-xs sm:text-sm text-slate-400 mb-2">Active Goals</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-400 mb-2">
              {currentGoals.length}
            </div>
            <div className="text-xs sm:text-sm text-slate-500">
              Target: €{currentGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toFixed(0)}
            </div>
          </div>
          
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border border-slate-700">
            <div className="text-xs sm:text-sm text-slate-400 mb-2">Monthly Contributions</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-400 mb-2">
              €{currentGoals.reduce((sum, goal) => sum + goal.monthlyAmount, 0).toFixed(2)}
            </div>
            <div className="text-xs sm:text-sm text-slate-500">Committed</div>
          </div>
          
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-5 lg:p-6 shadow-sm border border-slate-700">
            <div className="text-xs sm:text-sm text-slate-400 mb-2">Savings Rate</div>
            <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-indigo-400 mb-2">
              {savingsCapacity?.savingsRate?.toFixed(1) || 0}%
            </div>
            <div className="text-xs sm:text-sm text-slate-500">
              {savingsCapacity?.savingsRate > 20 ? 'Excellent' : 
               savingsCapacity?.savingsRate > 10 ? 'Good' : 'Needs improvement'}
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 relative">
          {/* Left Side - Savings Goals */}
          <div className="space-y-4 sm:space-y-6 order-1 lg:pr-4">
            <SavingsGoals 
              monthlyData={monthlyData} 
              savingsCapacity={savingsCapacity}
            />
          </div>
          
          {/* Desktop Divider */}
          <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-600 to-transparent transform -translate-x-1/2"></div>
          
          {/* Right Side - Recommendations */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:pl-4">
            <SavingsRecommendations 
              savingsCapacity={savingsCapacity}
              monthlyData={monthlyData}
              transactions={transactions}
              currentGoals={currentGoals}
            />
          </div>
        </div>
      </div>
      
      {/* SpendyBuddy Chatbot */}
      <SpendyBuddy transactions={transactions} monthlyData={monthlyData} />
    </div>
  )
}

export default Savings
