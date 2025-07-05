import { useState, useEffect } from 'react'
import { FaLightbulb, FaRocket, FaShieldAlt, FaChartLine, FaClock, FaRobot } from 'react-icons/fa'
import { FaArrowTrendDown } from 'react-icons/fa6'
import { 
  suggestSavingsAmount, 
  generateCutbackSuggestions, 
  generateSmartSuggestions 
} from '@/utils/savingsEngine'

const SavingsRecommendations = ({ savingsCapacity, monthlyData, transactions, currentGoals = [] }) => {
  const [activeTab, setActiveTab] = useState('capacity')
  const [savingsAmount, setSavingsAmount] = useState(null)
  const [cutbackSuggestions, setCutbackSuggestions] = useState([])
  const [smartSuggestions, setSmartSuggestions] = useState([])
  const [selectedSuggestions, setSelectedSuggestions] = useState(new Set())

  useEffect(() => {
    if (savingsCapacity && Object.keys(savingsCapacity).length > 0) {
      const amount = suggestSavingsAmount(savingsCapacity, currentGoals)
      setSavingsAmount(amount)
      
      const cutbacks = generateCutbackSuggestions(savingsCapacity.categoryAverages, savingsCapacity)
      setCutbackSuggestions(cutbacks)
      
      const smart = generateSmartSuggestions(savingsCapacity.categoryAverages, transactions)
      setSmartSuggestions(smart)
    }
  }, [savingsCapacity, currentGoals, transactions])

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
    smartSuggestions.forEach((suggestion, index) => {
      if (selectedSuggestions.has(`smart-${index}`)) {
        total += suggestion.potentialSavings
      }
    })
    return total
  }

  const SavingsCapacityTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
          <FaChartLine className="mr-2 text-blue-400" />
          Your Savings Capacity
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="text-sm text-slate-400">Current Monthly Savings</div>
            <div className="text-2xl font-bold text-green-400">
              ${savingsAmount?.currentSavings?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-slate-500">
              {savingsCapacity?.savingsRate?.toFixed(1) || 0}% of income
            </div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="text-sm text-slate-400">Available for New Goals</div>
            <div className="text-2xl font-bold text-blue-400">
              ${savingsAmount?.available?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-slate-500">After current goals</div>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
            <div className="text-sm text-slate-400">Avg Monthly Income</div>
            <div className="text-2xl font-bold text-slate-200">
              ${savingsCapacity?.avgIncome?.toFixed(2) || '0.00'}
            </div>
            <div className="text-sm text-slate-500">Last 3 months</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-lg p-4 border border-green-500/30">
            <div className="flex items-center mb-2">
              <FaShieldAlt className="text-green-400 mr-2" />
              <span className="font-medium text-slate-200">Conservative Approach</span>
            </div>
            <div className="text-2xl font-bold text-green-400 mb-1">
              ${savingsAmount?.conservative?.toFixed(2) || '0.00'}
            </div>
            <p className="text-sm text-slate-400">
              Safe amount to save without lifestyle changes
            </p>
          </div>
          
          <div className="bg-slate-700/50 rounded-lg p-4 border border-blue-500/30">
            <div className="flex items-center mb-2">
              <FaRocket className="text-blue-400 mr-2" />
              <span className="font-medium text-slate-200">Aggressive Approach</span>
            </div>
            <div className="text-2xl font-bold text-blue-400 mb-1">
              ${savingsAmount?.aggressive?.toFixed(2) || '0.00'}
            </div>
            <p className="text-sm text-slate-400">
              Maximum recommended with minor adjustments
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const CutbackSuggestionsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
          <FaArrowTrendDown className="mr-2 text-orange-400" />
          Spending Reduction Opportunities
        </h3>
        
        <div className="grid gap-4">
          {cutbackSuggestions.slice(0, 8).map((suggestion, index) => (
            <div 
              key={index}
              className={`bg-slate-700/50 rounded-lg p-4 border-2 transition-all cursor-pointer ${
                selectedSuggestions.has(`cutback-${index}`) 
                  ? 'border-green-400 bg-green-400/10' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => toggleSuggestion(`cutback-${index}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-slate-200">{suggestion.category}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      suggestion.difficulty === 'Easy' ? 'bg-green-400/20 text-green-400' :
                      suggestion.difficulty === 'Medium' ? 'bg-yellow-400/20 text-yellow-400' :
                      'bg-red-400/20 text-red-400'
                    }`}>
                      {suggestion.difficulty}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-400 mb-2">
                    Reduce by {suggestion.reductionPercentage}%: 
                    ${suggestion.currentAmount.toFixed(2)} → ${suggestion.newAmount.toFixed(2)}
                  </div>
                  
                  <div className="flex items-center text-sm text-slate-500">
                    <span>💡 Tips: {suggestion.tips.slice(0, 2).join(', ')}</span>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">
                    +${suggestion.potentialSavings.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-500">per month</div>
                  <div className="text-xs text-slate-600">
                    ${suggestion.annualSavings.toFixed(0)}/year
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const SmartSuggestionsTab = () => (
    <div className="space-y-6">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
          <FaRobot className="mr-2 text-purple-400" />
          AI-Powered Insights
        </h3>
        
        <div className="grid gap-4">
          {smartSuggestions.map((suggestion, index) => (
            <div 
              key={index}
              className={`bg-slate-700/50 rounded-lg p-4 border-2 transition-all cursor-pointer ${
                selectedSuggestions.has(`smart-${index}`) 
                  ? 'border-purple-400 bg-purple-400/10' 
                  : 'border-slate-600 hover:border-slate-500'
              }`}
              onClick={() => toggleSuggestion(`smart-${index}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="font-medium text-slate-200">{suggestion.title}</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${
                      suggestion.type === 'frequency' ? 'bg-blue-400/20 text-blue-400' :
                      suggestion.type === 'timing' ? 'bg-orange-400/20 text-orange-400' :
                      'bg-slate-600/50 text-slate-400'
                    }`}>
                      {suggestion.type}
                    </span>
                  </div>
                  
                  <div className="text-sm text-slate-400 mb-3">
                    {suggestion.description}
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm font-medium text-slate-300">Action Items:</div>
                    {suggestion.actionItems.map((item, i) => (
                      <div key={i} className="text-sm text-slate-400 flex items-center">
                        <span className="w-2 h-2 bg-slate-500 rounded-full mr-2"></span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg font-bold text-purple-400">
                    +${suggestion.potentialSavings.toFixed(2)}
                  </div>
                  <div className="text-sm text-slate-500">per month</div>
                  <div className="text-xs text-slate-600">
                    ${(suggestion.potentialSavings * 12).toFixed(0)}/year
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {smartSuggestions.length === 0 && (
          <div className="text-center py-8">
            <FaRobot className="text-slate-400 text-4xl mx-auto mb-4" />
            <p className="text-slate-400">
              No AI insights available yet. Add more transaction data to get personalized recommendations.
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const tabs = [
    { id: 'capacity', label: 'Savings Capacity', icon: FaChartLine },
    { id: 'cutbacks', label: 'Spending Cuts', icon: FaArrowTrendDown },
    { id: 'smart', label: 'AI Insights', icon: FaRobot }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-200">Savings Recommendations</h2>
        {selectedSuggestions.size > 0 && (
          <div className="bg-green-400/20 text-green-400 px-4 py-2 rounded-lg border border-green-400/30">
            <span className="font-medium">
              Selected savings: +${getTotalPotentialSavings().toFixed(2)}/month
            </span>
          </div>
        )}
      </div>

      <div className="mb-6">
        <nav className="flex space-x-8">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-4 font-medium text-sm flex items-center space-x-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-400/20 text-blue-400'
                  : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              <tab.icon />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'capacity' && <SavingsCapacityTab />}
      {activeTab === 'cutbacks' && <CutbackSuggestionsTab />}
      {activeTab === 'smart' && <SmartSuggestionsTab />}
    </div>
  )
}

export default SavingsRecommendations
