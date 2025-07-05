import { useState, useEffect } from 'react'
import { generateAlertsWithCurrentPreferences, ALERT_SEVERITY } from '@/utils/alertEngine'
import { 
  FaExclamationTriangle, 
  FaExclamationCircle, 
  FaInfoCircle, 
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa'

const AlertBanner = ({ monthlyData, transactions }) => {
  const [alerts, setAlerts] = useState([])
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())
  const [isCollapsed, setIsCollapsed] = useState(false)

  useEffect(() => {
    if (Object.keys(monthlyData).length > 0) {
      const generatedAlerts = generateAlertsWithCurrentPreferences(monthlyData, transactions)
      setAlerts(generatedAlerts)
    }
  }, [monthlyData, transactions])

  const visibleAlerts = alerts.filter(alert => !dismissedAlerts.has(alert.id))

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
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
        return 'border-red-500 bg-red-500/10'
      case ALERT_SEVERITY.HIGH:
        return 'border-orange-500 bg-orange-500/10'
      case ALERT_SEVERITY.MEDIUM:
        return 'border-yellow-500 bg-yellow-500/10'
      case ALERT_SEVERITY.LOW:
        return 'border-blue-500 bg-blue-500/10'
      default:
        return 'border-gray-500 bg-gray-500/10'
    }
  }

  if (visibleAlerts.length === 0) {
    return null
  }

  return (
    <div className="mb-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg border border-slate-700 overflow-hidden">
        {/* Header */}
        <div 
          className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <div className="flex items-center gap-3">
            <FaExclamationTriangle className="text-yellow-400" />
            <h3 className="text-lg font-semibold text-white">
              Financial Alerts ({visibleAlerts.length})
            </h3>
          </div>
          {isCollapsed ? (
            <FaChevronDown className="text-slate-400" />
          ) : (
            <FaChevronUp className="text-slate-400" />
          )}
        </div>

        {/* Alerts List */}
        {!isCollapsed && (
          <div className="border-t border-slate-700">
            {visibleAlerts.map((alert, index) => (
              <div 
                key={alert.id} 
                className={`p-4 border-l-4 ${getSeverityColor(alert.severity)} ${
                  index < visibleAlerts.length - 1 ? 'border-b border-slate-700' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      {getSeverityIcon(alert.severity)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white mb-1">
                        {alert.title}
                      </h4>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {alert.message}
                      </p>
                      {alert.category && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                            {alert.category}
                          </span>
                          {alert.percentage && (
                            <span className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                              {alert.percentage}%
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="p-1 hover:bg-slate-700/50 rounded transition-colors ml-2"
                  >
                    <FaTimes className="text-slate-400 hover:text-white" size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertBanner
