import { useState, useEffect } from 'react'
import { parseCsvData, getMonthlyData } from '@/utils/csvParser'
import { calculateSavingsCapacity } from '@/utils/savingsEngine'
import SavingsGoals from '@/components/savings/SavingsGoals'
import SavingsRecommendations from '@/components/savings/SavingsRecommendations'
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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">Savings Center</h1>
          <p className="text-slate-300">
            Set savings goals and get personalized recommendations to reach them faster
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-slate-700">
            <div className="text-sm text-slate-400">Current Monthly Savings</div>
            <div className="text-2xl font-bold text-green-400">
              ${savingsCapacity?.avgSavings?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-slate-500">
              {savingsCapacity?.savingsRate?.toFixed(1) || 0}% of income
            </div>
          </div>
          
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-slate-700">
            <div className="text-sm text-slate-400">Active Goals</div>
            <div className="text-2xl font-bold text-blue-400">
              {currentGoals.length}
            </div>
            <div className="text-sm text-slate-500">
              Total target: ${currentGoals.reduce((sum, goal) => sum + goal.targetAmount, 0).toFixed(0)}
            </div>
          </div>
          
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-slate-700">
            <div className="text-sm text-slate-400">Monthly Goal Contributions</div>
            <div className="text-2xl font-bold text-purple-400">
              ${currentGoals.reduce((sum, goal) => sum + goal.monthlyAmount, 0).toFixed(2)}
            </div>
            <div className="text-sm text-slate-500">Committed</div>
          </div>
          
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-slate-700">
            <div className="text-sm text-slate-400">Savings Rate</div>
            <div className="text-2xl font-bold text-indigo-400">
              {savingsCapacity?.savingsRate?.toFixed(1) || 0}%
            </div>
            <div className="text-sm text-slate-500">
              {savingsCapacity?.savingsRate > 20 ? 'Excellent' : 
               savingsCapacity?.savingsRate > 10 ? 'Good' : 'Needs improvement'}
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Side - Savings Goals */}
          <div className="space-y-6">
            <SavingsGoals 
              monthlyData={monthlyData} 
              savingsCapacity={savingsCapacity}
            />
          </div>
          
          {/* Right Side - Recommendations */}
          <div className="space-y-6">
            <SavingsRecommendations 
              savingsCapacity={savingsCapacity}
              monthlyData={monthlyData}
              transactions={transactions}
              currentGoals={currentGoals}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Savings
