import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useSavingsStore = create(
  persist(
    (set, get) => ({
      goals: [],
      
      // Add a new goal
      addGoal: (goalData) => {
        const goal = {
          ...goalData,
          id: Date.now(),
          targetAmount: parseFloat(goalData.targetAmount),
          monthlyAmount: parseFloat(goalData.monthlyAmount),
          currentAmount: 0,
          createdAt: new Date().toISOString()
        }
        set((state) => ({
          goals: [...state.goals, goal]
        }))
      },
      
      // Update an existing goal
      updateGoal: (goalId, updates) => {
        set((state) => ({
          goals: state.goals.map(goal => 
            goal.id === goalId ? { ...goal, ...updates } : goal
          )
        }))
      },
      
      // Delete a goal
      deleteGoal: (goalId) => {
        set((state) => ({
          goals: state.goals.filter(goal => goal.id !== goalId)
        }))
      },
      
      // Add amount to a goal
      addAmountToGoal: (goalId, amount) => {
        set((state) => ({
          goals: state.goals.map(goal => 
            goal.id === goalId 
              ? { ...goal, currentAmount: (goal.currentAmount || 0) + amount }
              : goal
          )
        }))
      },
      
      // Get a specific goal
      getGoal: (goalId) => {
        return get().goals.find(goal => goal.id === goalId)
      },
      
      // Clear all goals (useful for testing)
      clearGoals: () => {
        set({ goals: [] })
      }
    }),
    {
      name: 'savings-goals-storage', // unique name for localStorage key
      version: 1, // version for migration support
    }
  )
)

export default useSavingsStore
