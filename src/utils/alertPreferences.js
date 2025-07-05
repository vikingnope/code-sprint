// Alert preferences and settings utility
// Manages user preferences for alert thresholds and notification settings using Zustand

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const ALERT_PREFERENCES_KEY = 'financial_alert_preferences'

export const DEFAULT_ALERT_PREFERENCES = {
  budgetThresholds: {
    'Food & Dining': 300,
    'Entertainment': 150,
    'Shopping': 200,
    'Groceries & Cafe': 250,
    'Transport': 100,
    'Housing': 800,
    'Services': 100,
    'Other': 150
  },
  alertSettings: {
    budgetWarningThreshold: 80, // percentage
    budgetExceededEnabled: true,
    categorySpikesEnabled: true,
    unusualSpendingEnabled: true,
    savingsOpportunitiesEnabled: true,
    incomeChangesEnabled: true,
    minimumSpendingForAlerts: 50 // minimum amount to trigger alerts
  },
  dismissedAlerts: []
}

export const useAlertPreferences = create(
  persist(
    (set, get) => ({
      ...DEFAULT_ALERT_PREFERENCES,
      
      // Budget threshold methods
      getBudgetThreshold: (category) => {
        const state = get()
        return state.budgetThresholds[category] || DEFAULT_ALERT_PREFERENCES.budgetThresholds['Other']
      },
      
      setBudgetThreshold: (category, amount) => {
        set((state) => ({
          budgetThresholds: {
            ...state.budgetThresholds,
            [category]: amount
          }
        }))
      },
      
      // Alert setting methods
      getAlertSetting: (setting) => {
        const state = get()
        return state.alertSettings[setting] ?? DEFAULT_ALERT_PREFERENCES.alertSettings[setting]
      },
      
      setAlertSetting: (setting, value) => {
        set((state) => ({
          alertSettings: {
            ...state.alertSettings,
            [setting]: value
          }
        }))
      },
      
      // Dismissed alerts methods
      isAlertDismissed: (alertId) => {
        const state = get()
        return state.dismissedAlerts.includes(alertId)
      },
      
      dismissAlert: (alertId) => {
        set((state) => ({
          dismissedAlerts: state.dismissedAlerts.includes(alertId) 
            ? state.dismissedAlerts 
            : [...state.dismissedAlerts, alertId]
        }))
      },
      
      clearDismissedAlerts: () => {
        set({ dismissedAlerts: [] })
      },
      
      // Reset to defaults
      resetToDefaults: () => {
        set(DEFAULT_ALERT_PREFERENCES)
      }
    }),
    {
      name: ALERT_PREFERENCES_KEY,
      version: 1,
      onRehydrateStorage: () => (state) => {
        console.log('Alert preferences rehydrated')
      }
    }
  )
)
