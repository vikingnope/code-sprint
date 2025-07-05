import { useState } from 'react'
import { FaPlus, FaTrash, FaEdit, FaBullseye, FaMinus } from 'react-icons/fa'
import { calculateGoalProgress } from '@/utils/savingsEngine'
import useSavingsStore from '@/stores/savingsStore'

const goalCategories = [
  { value: 'emergency', label: 'Emergency Fund', icon: '🚨' },
  { value: 'vacation', label: 'Vacation', icon: '✈️' },
  { value: 'house', label: 'House/Property', icon: '🏠' },
  { value: 'car', label: 'Car/Vehicle', icon: '🚗' },
  { value: 'education', label: 'Education', icon: '📚' },
  { value: 'retirement', label: 'Retirement', icon: '🏦' },
  { value: 'wedding', label: 'Wedding', icon: '💍' },
  { value: 'general', label: 'General', icon: '💰' }
]

const GoalCard = ({ goal, monthlyData, updateGoal, deleteGoal, setEditingGoal, openAddAmountModal, openRemoveAmountModal }) => {
  const progress = calculateGoalProgress(goal, monthlyData)
  const category = goalCategories.find(c => c.value === goal.category)

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all overflow-hidden">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center flex-1 min-w-0">
          <span className="text-2xl mr-3 flex-shrink-0">{category?.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-slate-200 truncate">{goal.name}</h3>
            <p className="text-sm text-slate-400">{category?.label}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 flex-shrink-0 ml-4">
          <button
            onClick={() => setEditingGoal(goal)}
            className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 p-2 rounded-md transition-colors"
          >
            <FaEdit className="text-sm" />
          </button>
          <button
            onClick={() => deleteGoal(goal.id)}
            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-md transition-colors"
          >
            <FaTrash className="text-sm" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Progress</span>
          <span className="text-sm font-medium text-slate-200">
            €{goal.currentAmount?.toFixed(2) || '0.00'} / €{goal.targetAmount.toFixed(2)}
          </span>
        </div>
        
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              progress.onTrack ? 'bg-green-400' : 'bg-yellow-400'
            }`}
            style={{ width: `${Math.min(100, progress.percentage)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">
            {progress.percentage.toFixed(1)}% complete
          </span>
          <span className={`font-medium ${progress.onTrack ? 'text-green-400' : 'text-yellow-400'}`}>
            {progress.monthsToGoal} months to go
          </span>
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-slate-600">
          <div className="text-sm">
            <div className="text-slate-400">Monthly: €{goal.monthlyAmount.toFixed(2)}</div>
            {goal.targetDate && (
              <div className="text-slate-400">Target: {new Date(goal.targetDate).toLocaleDateString()}</div>
            )}
          </div>
          <div className="flex items-center space-x-2">
                        <button
              onClick={() => openRemoveAmountModal(goal)}
              className="text-white py-1 rounded text-sm"
              disabled={!goal.currentAmount || goal.currentAmount <= 0}
            >
              Remove €
            </button>
            <button
              onClick={() => openAddAmountModal(goal)}
              className=" text-white py-1 rounded text-sm "
            >
              Add €
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const SavingsGoals = ({ monthlyData, savingsCapacity }) => {
  const { goals, addGoal: addGoalToStore, updateGoal, deleteGoal } = useSavingsStore()
  const [showAddGoal, setShowAddGoal] = useState(false)
  const [editingGoal, setEditingGoal] = useState(null)
  const [showAddAmountModal, setShowAddAmountModal] = useState(false)
  const [showRemoveAmountModal, setShowRemoveAmountModal] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [addAmountValue, setAddAmountValue] = useState('')
  const [removeAmountValue, setRemoveAmountValue] = useState('')
  const [newGoal, setNewGoal] = useState({
    name: '',
    targetAmount: '',
    monthlyAmount: '',
    targetDate: '',
    category: 'general',
    description: ''
  })

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount && newGoal.monthlyAmount) {
      addGoalToStore(newGoal)
      setNewGoal({
        name: '',
        targetAmount: '',
        monthlyAmount: '',
        targetDate: '',
        category: 'general',
        description: ''
      })
      setShowAddGoal(false)
    }
  }

  const handleAddAmount = () => {
    if (addAmountValue && !isNaN(parseFloat(addAmountValue)) && parseFloat(addAmountValue) > 0) {
      const { addAmountToGoal } = useSavingsStore.getState()
      addAmountToGoal(selectedGoal.id, parseFloat(addAmountValue))
      setShowAddAmountModal(false)
      setAddAmountValue('')
      setSelectedGoal(null)
    }
  }

  const openAddAmountModal = (goal) => {
    setSelectedGoal(goal)
    setShowAddAmountModal(true)
    setAddAmountValue('')
  }

  const handleRemoveAmount = () => {
    if (removeAmountValue && !isNaN(parseFloat(removeAmountValue)) && parseFloat(removeAmountValue) > 0) {
      const { removeAmountFromGoal } = useSavingsStore.getState()
      removeAmountFromGoal(selectedGoal.id, parseFloat(removeAmountValue))
      setShowRemoveAmountModal(false)
      setRemoveAmountValue('')
      setSelectedGoal(null)
    }
  }

  const openRemoveAmountModal = (goal) => {
    setSelectedGoal(goal)
    setShowRemoveAmountModal(true)
    setRemoveAmountValue('')
  }

  const addGoalForm = showAddGoal ? (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-slate-200 mb-4">Add New Savings Goal</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Goal Name</label>
          <input
            type="text"
            value={newGoal.name}
            onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            placeholder="e.g., Emergency Fund"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Amount</label>
            <input
              type="number"
              value={newGoal.targetAmount}
              onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
              placeholder="5000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Monthly Amount</label>
            <input
              type="number"
              value={newGoal.monthlyAmount}
              onChange={(e) => setNewGoal({...newGoal, monthlyAmount: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
              placeholder="500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Category</label>
            <select
              value={newGoal.category}
              onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            >
              {goalCategories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Target Date (Optional)</label>
            <input
              type="date"
              value={newGoal.targetDate}
              onChange={(e) => setNewGoal({...newGoal, targetDate: e.target.value})}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Description (Optional)</label>
          <textarea
            value={newGoal.description}
            onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-200"
            rows={2}
            placeholder="Add any additional details about your goal..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setShowAddGoal(false)}
            className="px-4 py-2 text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={addGoal}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Goal
          </button>
        </div>
      </div>
    </div>
  ) : null

  const addAmountModal = showAddAmountModal ? (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] min-h-screen w-full">
      <div className="bg-slate-800/95 backdrop-blur-md rounded-lg p-6 border border-slate-700 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          Add Money to {selectedGoal?.name}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Amount to Add
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400">€</span>
              <input
                type="number"
                value={addAmountValue}
                onChange={(e) => setAddAmountValue(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-200"
                placeholder="0.00"
                step="0.01"
                min="0"
                autoFocus
              />
            </div>
          </div>

          {selectedGoal && (
            <div className="bg-slate-700/50 rounded-md p-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Current progress:</span>
                <span>€{selectedGoal.currentAmount?.toFixed(2) || '0.00'} / €{selectedGoal.targetAmount.toFixed(2)}</span>
              </div>
              {addAmountValue && !isNaN(parseFloat(addAmountValue)) && (
                <div className="flex justify-between text-green-400 mt-1">
                  <span>After adding:</span>
                  <span>€{((selectedGoal.currentAmount || 0) + parseFloat(addAmountValue)).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddAmountModal(false)
                setAddAmountValue('')
                setSelectedGoal(null)
              }}
              className="px-4 py-2 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleAddAmount}
              disabled={!addAmountValue || isNaN(parseFloat(addAmountValue)) || parseFloat(addAmountValue) <= 0}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Amount
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null

  const removeAmountModal = showRemoveAmountModal ? (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-[9999] min-h-screen w-full">
      <div className="bg-slate-800/95 backdrop-blur-md rounded-lg p-6 border border-slate-700 max-w-md w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          Remove Money from {selectedGoal?.name}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Amount to Remove
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-slate-400">€</span>
              <input
                type="number"
                value={removeAmountValue}
                onChange={(e) => setRemoveAmountValue(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-slate-200"
                placeholder="0.00"
                step="0.01"
                min="0"
                max={selectedGoal?.currentAmount || 0}
                autoFocus
              />
            </div>
          </div>

          {selectedGoal && (
            <div className="bg-slate-700/50 rounded-md p-3 text-sm">
              <div className="flex justify-between text-slate-400">
                <span>Current progress:</span>
                <span>€{selectedGoal.currentAmount?.toFixed(2) || '0.00'} / €{selectedGoal.targetAmount.toFixed(2)}</span>
              </div>
              {removeAmountValue && !isNaN(parseFloat(removeAmountValue)) && parseFloat(removeAmountValue) > 0 && (
                <div className="flex justify-between text-red-400 mt-1">
                  <span>After removing:</span>
                  <span>€{Math.max(0, (selectedGoal.currentAmount || 0) - parseFloat(removeAmountValue)).toFixed(2)}</span>
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowRemoveAmountModal(false)
                setRemoveAmountValue('')
                setSelectedGoal(null)
              }}
              className="px-4 py-2 text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              onClick={handleRemoveAmount}
              disabled={!removeAmountValue || isNaN(parseFloat(removeAmountValue)) || parseFloat(removeAmountValue) <= 0 || parseFloat(removeAmountValue) > (selectedGoal?.currentAmount || 0)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Remove Amount
            </button>
          </div>
        </div>
      </div>
    </div>
  ) : null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-200">Savings Goals</h2>
        <button
          onClick={() => setShowAddGoal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add Goal</span>
        </button>
      </div>

      {addGoalForm}

      {addAmountModal}

      {removeAmountModal}

      {goals.length === 0 && !showAddGoal && (
        <div className="text-center py-12">
          <FaBullseye className="text-slate-400 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No savings goals yet</h3>
          <p className="text-slate-400 mb-4">Start by creating your first savings goal</p>
          <button
            onClick={() => setShowAddGoal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create Your First Goal
          </button>
        </div>
      )}

      <div className="space-y-8 w-full">
        {goals.map(goal => (
          <GoalCard 
            key={goal.id} 
            goal={goal} 
            monthlyData={monthlyData}
            updateGoal={updateGoal}
            deleteGoal={deleteGoal}
            setEditingGoal={setEditingGoal}
            openAddAmountModal={openAddAmountModal}
            openRemoveAmountModal={openRemoveAmountModal}
          />
        ))}
      </div>
    </div>
  )
}

export default SavingsGoals
