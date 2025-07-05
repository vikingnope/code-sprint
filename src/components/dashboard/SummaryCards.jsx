import { FaArrowUp, FaArrowDown, FaWallet } from 'react-icons/fa'

const SummaryCards = ({ monthlyData }) => {
  const totalIncome = Object.values(monthlyData).reduce((sum, data) => sum + data.income, 0)
  const totalExpenses = Object.values(monthlyData).reduce((sum, data) => sum + data.expenses, 0)
  const netBalance = totalIncome - totalExpenses

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Total Income</p>
            <p className="text-3xl font-bold text-green-400">€{totalIncome.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <FaArrowUp className="text-green-400 text-sm" />
              <span className="text-sm text-green-400 font-medium">+12.5%</span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-xl border border-green-500/30">
            <FaArrowUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Total Expenses</p>
            <p className="text-3xl font-bold text-red-400">€{totalExpenses.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2">
              <FaArrowDown className="text-red-400 text-sm" />
              <span className="text-sm text-red-400 font-medium">-8.2%</span>
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-red-500/20 to-red-400/20 rounded-xl border border-red-500/30">
            <FaArrowDown className="w-8 h-8 text-red-400" />
          </div>
        </div>
      </div>

      <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-400 mb-1">Net Balance</p>
            <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              €{netBalance.toLocaleString()}
            </p>
            <div className="flex items-center gap-1 mt-2">
              <FaWallet className={`text-sm ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              <span className={`text-sm font-medium ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {netBalance >= 0 ? 'Positive' : 'Negative'} Balance
              </span>
            </div>
          </div>
          <div className={`p-4 rounded-xl border ${netBalance >= 0 ? 'bg-gradient-to-br from-green-500/20 to-green-400/20 border-green-500/30' : 'bg-gradient-to-br from-red-500/20 to-red-400/20 border-red-500/30'}`}>
            <FaWallet className={`w-8 h-8 ${netBalance >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryCards
