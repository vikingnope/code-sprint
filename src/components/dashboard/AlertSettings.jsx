import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useAlertPreferences } from '@/utils/alertPreferences'
import { FaCog, FaSave, FaUndo } from 'react-icons/fa'

const AlertSettings = ({ onClose }) => {
  const {
    budgetThresholds,
    alertSettings,
    setBudgetThreshold,
    setAlertSetting,
    resetToDefaults
  } = useAlertPreferences()

  const [localBudgetThresholds, setLocalBudgetThresholds] = useState(budgetThresholds || {})
  const [localAlertSettings, setLocalAlertSettings] = useState(alertSettings || {})

  // Load preferences on component mount
  useEffect(() => {
    setLocalBudgetThresholds(budgetThresholds || {})
    setLocalAlertSettings(alertSettings || {})
  }, [budgetThresholds, alertSettings])

  const handleBudgetChange = (category, value) => {
    setLocalBudgetThresholds(prev => ({
      ...prev,
      [category]: Number(value)
    }))
  }

  const handleSettingChange = (setting, value) => {
    setLocalAlertSettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const saveSettings = () => {
    // Update budget thresholds
    Object.entries(localBudgetThresholds).forEach(([category, amount]) => {
      setBudgetThreshold(category, amount)
    })

    // Update alert settings
    Object.entries(localAlertSettings).forEach(([setting, value]) => {
      setAlertSetting(setting, value)
    })

    onClose?.()
  }

  const handleResetToDefaults = () => {
    resetToDefaults()
    // No need to manually update local state as it will be updated via useEffect
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm sm:flex sm:items-center sm:justify-center sm:p-4" style={{ zIndex: 10000 }}>
      {/* Mobile: Full screen modal */}
      <div className="sm:hidden fixed inset-0 bg-slate-800 overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FaCog className="text-blue-400" />
            Alert Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl p-2 -m-2"
          >
            ✕
          </button>
        </div>
        
        <div className="px-4 py-4 space-y-6 pb-32">
          {/* Budget Thresholds */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">Category Budgets (€)</h3>
            <div className="space-y-3">
              {Object.entries(localBudgetThresholds).map(([category, amount]) => (
                <div key={category} className="bg-slate-700 rounded-lg p-3">
                  <label className="text-slate-300 text-sm block mb-2">{category}</label>
                  <input
                    type="number"
                    value={amount || 0}
                    onChange={(e) => handleBudgetChange(category, e.target.value)}
                    className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Alert Settings */}
          <div>
            <h3 className="text-base font-semibold text-white mb-4">Alert Preferences</h3>
            <div className="space-y-3">
              <div className="bg-slate-700 rounded-lg p-3">
                <label className="text-slate-300 text-sm block mb-2">Budget Warning Threshold (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={localAlertSettings.budgetWarningThreshold || 80}
                  onChange={(e) => handleSettingChange('budgetWarningThreshold', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="bg-slate-700 rounded-lg p-3">
                <label className="text-slate-300 text-sm block mb-2">Minimum Spending for Alerts (€)</label>
                <input
                  type="number"
                  min="0"
                  value={localAlertSettings.minimumSpendingForAlerts || 0}
                  onChange={(e) => handleSettingChange('minimumSpendingForAlerts', Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-600 text-white rounded border border-slate-500 focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Toggle switches */}
              {[
                { key: 'budgetExceededEnabled', label: 'Budget Exceeded Alerts' },
                { key: 'categorySpikesEnabled', label: 'Category Spike Alerts' },
                { key: 'unusualSpendingEnabled', label: 'Unusual Spending Alerts' },
                { key: 'savingsOpportunitiesEnabled', label: 'Savings Opportunity Alerts' },
                { key: 'incomeChangesEnabled', label: 'Income Change Alerts' }
              ].map(({ key, label }) => {
                const isEnabled = localAlertSettings[key] ?? true
                return (
                  <div key={key} className="bg-slate-700 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 text-sm flex-1 pr-3">{label}</label>
                      <button
                        onClick={() => handleSettingChange(key, !isEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-200 ${
                          isEnabled ? 'bg-blue-500' : 'bg-slate-600'
                        }`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sticky bottom buttons */}
        <div className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 p-4 space-y-3">
          <button
            onClick={saveSettings}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <FaSave />
            Save Settings
          </button>
          <button
            onClick={handleResetToDefaults}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <FaUndo />
            Reset to Defaults
          </button>
        </div>
      </div>

      {/* Desktop: Centered modal */}
      <div className="hidden sm:block bg-slate-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <FaCog className="text-blue-400" />
            Alert Settings
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Budget Thresholds */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Category Budgets (€)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(localBudgetThresholds).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <label className="text-slate-300 text-sm">{category}</label>
                  <input
                    type="number"
                    value={amount || 0}
                    onChange={(e) => handleBudgetChange(category, e.target.value)}
                    className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-400 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Alert Settings */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Alert Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-slate-300 text-sm">Budget Warning Threshold (%)</label>
                <input
                  type="number"
                  min="50"
                  max="100"
                  value={localAlertSettings.budgetWarningThreshold || 80}
                  onChange={(e) => handleSettingChange('budgetWarningThreshold', Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-slate-300 text-sm">Minimum Spending for Alerts (€)</label>
                <input
                  type="number"
                  min="0"
                  value={localAlertSettings.minimumSpendingForAlerts || 0}
                  onChange={(e) => handleSettingChange('minimumSpendingForAlerts', Number(e.target.value))}
                  className="w-20 px-2 py-1 bg-slate-700 text-white rounded border border-slate-600 focus:border-blue-400 focus:outline-none"
                />
              </div>

              {/* Toggle switches */}
              {[
                { key: 'budgetExceededEnabled', label: 'Budget Exceeded Alerts' },
                { key: 'categorySpikesEnabled', label: 'Category Spike Alerts' },
                { key: 'unusualSpendingEnabled', label: 'Unusual Spending Alerts' },
                { key: 'savingsOpportunitiesEnabled', label: 'Savings Opportunity Alerts' },
                { key: 'incomeChangesEnabled', label: 'Income Change Alerts' }
              ].map(({ key, label }) => {
                const isEnabled = localAlertSettings[key] ?? true
                return (
                  <div key={key} className="flex items-center justify-between">
                    <label className="text-slate-300 text-sm">{label}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">
                        {isEnabled ? 'ON' : 'OFF'}
                      </span>
                      <button
                        onClick={() => handleSettingChange(key, !isEnabled)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-200 overflow-hidden ${
                          isEnabled ? 'bg-blue-500 hover:bg-blue-600' : 'bg-slate-600 hover:bg-slate-500'
                        }`}
                        title={`${isEnabled ? 'Enabled' : 'Disabled'}`}
                      >
                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                          isEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-700">
            <button
              onClick={saveSettings}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <FaSave />
              Save Settings
            </button>
            <button
              onClick={handleResetToDefaults}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <FaUndo />
              Reset
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(modalContent, document.body)
}

export default AlertSettings
