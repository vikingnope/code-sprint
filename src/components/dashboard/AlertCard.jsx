import { useState, useEffect } from 'react'
import { generateAlertsWithCurrentPreferences, ALERT_SEVERITY } from '@/utils/alertEngine'
import AlertSettings from './AlertSettings'
import { 
  FaExclamationTriangle, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaTimes,
  FaBell,
  FaCog
} from 'react-icons/fa'

const AlertCard = ({ monthlyData, transactions, maxAlerts = 3 }) => {
  const [alerts, setAlerts] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (Object.keys(monthlyData).length > 0) {
      const generatedAlerts = generateAlertsWithCurrentPreferences(monthlyData, transactions)
      setAlerts(generatedAlerts)
    }
  }, [monthlyData, transactions])

  const visibleAlerts = alerts
    .filter(alert => !dismissedAlerts.has(alert.id))
    .slice(0, maxAlerts)

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
  }

  const handleSettingsClose = () => {
    setShowSettings(false)
    // Regenerate alerts after settings change
    if (Object.keys(monthlyData).length > 0) {
      const generatedAlerts = generateAlertsWithCurrentPreferences(monthlyData, transactions)
      setAlerts(generatedAlerts)
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case ALERT_SEVERITY.CRITICAL:
        return <FaExclamationTriangle className="text-red-400" />
      case ALERT_SEVERITY.HIGH:
        return <FaExclamationCircle className="text-orange-400" />
      case ALERT_SEVERITY.MEDIUM:
        return <FaExclamationCircle className="text-yellow-400" />
      case ALERT_SEVERITY.LOW:
        return <FaInfoCircle className="text-blue-400" />
      default:
        return <FaInfoCircle className="text-gray-400" />
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case ALERT_SEVERITY.CRITICAL:
        return 'border-red-500/50 bg-red-500/5'
      case ALERT_SEVERITY.HIGH:
        return 'border-orange-500/50 bg-orange-500/5'
      case ALERT_SEVERITY.MEDIUM:
        return 'border-yellow-500/50 bg-yellow-500/5'
      case ALERT_SEVERITY.LOW:
        return 'border-blue-500/50 bg-blue-500/5'
      default:
        return 'border-gray-500/50 bg-gray-500/5'
    }
  }

  if (visibleAlerts.length === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <FaBell className="text-green-400" />
            Financial Alerts
          </h3>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Alert Settings"
          >
            <FaCog className="text-slate-400 hover:text-white" size={14} />
          </button>
        </div>
        <div className="text-center py-8">
          <FaBell className="text-green-400 text-3xl mx-auto mb-3" />
          <p className="text-slate-300">All good! No alerts at the moment.</p>
          <p className="text-slate-400 text-sm mt-1">Keep up the great financial habits!</p>
        </div>
        
        {showSettings && (
          <AlertSettings onClose={handleSettingsClose} />
        )}
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <FaBell className="text-yellow-400" />
          Financial Alerts
        </h3>
        <div className="flex items-center gap-2">
          {alerts.length > maxAlerts && (
            <span className="text-xs text-slate-400">
              +{alerts.length - maxAlerts} more
            </span>
          )}
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
            title="Alert Settings"
          >
            <FaCog className="text-slate-400 hover:text-white" size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {visibleAlerts.map((alert) => (
          <div 
            key={alert.id} 
            className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} transition-all hover:bg-opacity-20`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                <div className="mt-0.5">
                  {getSeverityIcon(alert.severity)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">
                    {alert.title}
                  </h4>
                  <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                    {alert.message}
                  </p>
                  {alert.category && (
                    <div className="mt-2 flex items-center gap-1">
                      <span className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-300">
                        {alert.category}
                      </span>
                      {alert.percentage && (
                        <span className="px-2 py-0.5 bg-slate-700/50 rounded text-xs text-slate-300">
                          {alert.percentage}%
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 hover:bg-slate-700/50 rounded transition-colors ml-2 flex-shrink-0"
              >
                <FaTimes className="text-slate-400 hover:text-white" size={10} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showSettings && (
        <AlertSettings onClose={handleSettingsClose} />
      )}
    </div>
  )
}

export default AlertCard
