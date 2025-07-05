import { useState, useEffect } from 'react'
import { FaLightbulb, FaRocket, FaShieldAlt, FaChartLine, FaClock } from 'react-icons/fa'
import { FaArrowTrendDown } from 'react-icons/fa6'
import { 
  suggestSavingsAmount, 
  generateCutbackSuggestions 
} from '@/utils/savingsEngine'

const SavingsRecommendations = ({ savingsCapacity, monthlyData, transactions, currentGoals = [] }) => {
  const [activeTab, setActiveTab] = useState('capacity')
  const [savingsAmount, setSavingsAmount] = useState(null)
  const [cutbackSuggestions, setCutbackSuggestions] = useState([])
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set())

  useEffect(() => {
    if (savingsCapacity && Object.keys(savingsCapacity).length > 0) {
      const cutbacks = generateCutbackSuggestions(savingsCapacity.categoryAverages, savingsCapacity)
      setCutbackSuggestions(cutbacks)
    }
  }, [savingsCapacity])

  // Recalculate savings amount whenever selected suggestions change
  useEffect(() => {
    if (savingsCapacity && Object.keys(savingsCapacity).length > 0) {
      const adjustedCapacity = calculateAdjustedCapacity(savingsCapacity, cutbackSuggestions, selectedSuggestions)
      const amount = suggestSavingsAmount(adjustedCapacity, currentGoals)
      setSavingsAmount(amount)
    }
  }, [savingsCapacity, currentGoals, cutbackSuggestions, selectedSuggestions])

  const calculateAdjustedCapacity = (originalCapacity, cutbacks, selectedSuggestions) => {
    const totalPotentialSavings = getTotalPotentialSavings()
    
    return {
      ...originalCapacity,
      avgSavings: originalCapacity.avgSavings + totalPotentialSavings,
      avgExpenses: originalCapacity.avgExpenses - totalPotentialSavings,
      savingsRate: ((originalCapacity.avgSavings + totalPotentialSavings) / originalCapacity.avgIncome) * 100
    }
  }

  const toggleSuggestion = (suggestionId) => {
    const newSelected = new Set(selectedSuggestions)
    if (newSelected.has(suggestionId)) {
      newSelected.delete(suggestionId)
    } else {
      newSelected.add(suggestionId)
    }
    setSelectedSuggestions(newSelected)
  }

  const getTotalPotentialSavings = () => {
    let total = 0
    cutbackSuggestions.forEach((suggestion, index) => {
      if (selectedSuggestions.has(`cutback-${index}`)) {
        total += suggestion.potentialSavings
      }
    })
    return total
  }

  const SavingsCapacityTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-blue-400" />
          Your Savings Capacity
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border border-slate-600">
            <div className="text-xs sm:text-sm text-slate-400">Current Monthly Savings</div>
            <div className="text-xl sm:text-2xl font-bold text-green-400">
              €{savingsAmount?.currentSavings?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500">
              {savingsCapacity?.savingsRate?.toFixed(1) || 0}% of income
            </div>
            {getTotalPotentialSavings() > 0 && (
              <div className="text-xs text-green-400 mt-1">
                +€{getTotalPotentialSavings().toFixed(2)} from cuts
              </div>
            )}
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border border-slate-600">
            <div className="text-xs sm:text-sm text-slate-400">Available for New Goals</div>
            <div className="text-xl sm:text-2xl font-bold text-blue-400">
              €{savingsAmount?.available?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500">After current goals</div>
            {getTotalPotentialSavings() > 0 && (
              <div className="text-xs text-blue-400 mt-1">
                Includes selected cuts
              </div>
            )}
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border border-slate-600">
            <div className="text-xs sm:text-sm text-slate-400">Avg Monthly Income</div>
            <div className="text-xl sm:text-2xl font-bold text-slate-200">
              €{savingsCapacity?.avgIncome?.toFixed(2) || '0.00'}
            </div>
            <div className="text-xs sm:text-sm text-slate-500">Last 3 months</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border border-green-500/30">
            <div className="flex items-center mb-2">
              <FaShieldAlt className="text-green-400 mr-2 text-sm" />
              <span className="font-medium text-slate-200 text-sm sm:text-base">Conservative Approach</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-green-400 mb-1">
              €{savingsAmount?.conservative?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {getTotalPotentialSavings() > 0 
                ? 'Safe amount including selected spending cuts' 
                : 'Safe amount to save without lifestyle changes'}
            </p>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-3 sm:p-4 border border-blue-500/30">
            <div className="flex items-center mb-2">
              <FaRocket className="text-blue-400 mr-2 text-sm" />
              <span className="font-medium text-slate-200 text-sm sm:text-base">Aggressive Approach</span>
            </div>
            <div className="text-xl sm:text-2xl font-bold text-blue-400 mb-1">
              €{savingsAmount?.aggressive?.toFixed(2) || '0.00'}
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {getTotalPotentialSavings() > 0 
                ? 'Maximum potential with selected spending cuts' 
                : 'Maximum recommended with minor adjustments'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const CutbackSuggestionsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
          <FaArrowTrendDown className="mr-2 text-orange-400" />
          Spending Reduction Opportunities
        </h3>
        
        <div className="grid gap-4">
          {cutbackSuggestions.slice(0, 8).map((suggestion, index) => (
            <div 
              key={index}
              className={`bg-slate-700/50 rounded-lg p-3 sm:p-4 border-2 transition-all cursor-pointer ${
                selectedSuggestions.has(`cutback-${index}`) 
                  ? 'border-green-400 bg-green-400/10' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => toggleSuggestion(`cutback-${index}`)}
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-medium text-slate-200 text-sm sm:text-base">{suggestion.category}</span>
                    <span className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                      suggestion.difficulty === 'Easy' ? 'bg-green-400/20 text-green-400' :
                      suggestion.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-red-400/20 text-red-400'
                    }`}>
                      {suggestion.difficulty}
                    </span>
                  </div>
                  
                  <div className="text-xs sm:text-sm text-slate-400 mb-2 break-words">
                    Reduce by {suggestion.reductionPercentage}%: 
                    €{suggestion.currentAmount.toFixed(2)} → €{suggestion.newAmount.toFixed(2)}
                  </div>
                  
                  <div className="flex items-center text-xs sm:text-sm text-slate-500">
                    <span className="break-words">💡 Tips: {suggestion.tips.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
                
                <div className="text-right flex-shrink-0">
                  <div className="text-lg font-bold text-green-400">
                    +€{suggestion.potentialSavings.toFixed(2)}
                  </div>
                  <div className="text-xs sm:text-sm text-slate-500">per month</div>
                  <div className="text-xs text-slate-600">
                    €{suggestion.annualSavings.toFixed(0)}/year
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const tabs = [
    { id: 'capacity', label: 'Savings Capacity', icon: FaChartLine },
    { id: 'cutbacks', label: 'Spending Cuts', icon: FaArrowTrendDown }
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-200">Savings Recommendations</h2>
        {selectedSuggestions.size > 0 && (
          <div className="bg-green-400/20 text-green-400 px-3 sm:px-4 py-2 rounded-lg border border-green-400/30 text-sm">
            <span className="font-medium">
              Selected savings: +€{getTotalPotentialSavings().toFixed(2)}/month
            </span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <nav className="flex flex-wrap gap-2 sm:gap-4">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-3 sm:px-4 font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 rounded-lg transition-colors flex-shrink-0 ${
                activeTab === tab.id
                  ? 'bg-blue-400/20 text-blue-400'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <tab.icon className="text-xs sm:text-sm" />
              <span className="whitespace-nowrap">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'capacity' && (
        <div className="animate-fade-in">
          <SavingsCapacityTab />
        </div>
      )}
      {activeTab === 'cutbacks' && (
        <div className="animate-fade-in">
          <CutbackSuggestionsTab />
        </div>
      )}
    </div>
  )
}

export default SavingsRecommendations
