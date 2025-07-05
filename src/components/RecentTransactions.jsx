import { FaArrowUp, FaArrowDown } from 'react-icons/fa'
import { categorizeTransaction } from '@/utils/csvParser'

const RecentTransactions = ({ transactions }) => {
  const recentTransactions = transactions
    .sort((a, b) => b.date - a.date)
    .slice(0, 10)

  return (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">Recent Transactions</h2>
      <div className="space-y-4">
        {recentTransactions.map((transaction, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-600/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full border ${transaction.type === 'credit' ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                {transaction.type === 'credit' ? (
                  <FaArrowUp className={`w-4 h-4 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                ) : (
                  <FaArrowDown className={`w-4 h-4 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-200 truncate">
                  {transaction.description}
                </p>
                <p className="text-sm text-slate-400">
                  {transaction.date.toLocaleDateString()} • {categorizeTransaction(transaction.description)}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.type === 'credit' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentTransactions
