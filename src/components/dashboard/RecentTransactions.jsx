import { useState } from 'react'
import { createPortal } from 'react-dom'
import { FaArrowUp, FaArrowDown, FaEye, FaTimes } from 'react-icons/fa'
import { categorizeTransaction } from '@/utils/csvParser'

const RecentTransactions = ({ transactions }) => {
  const [showAllTransactions, setShowAllTransactions] = useState(false)
  
  const recentTransactions = transactions
    .sort((a, b) => b.date - a.date)
    .slice(0, 10)
  
  const allTransactions = transactions.sort((a, b) => b.date - a.date)

  const mainContent = (
    <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-700 p-6 hover:shadow-2xl transition-all duration-300">
      <h2 className="text-2xl font-bold text-slate-200 mb-6">Recent Transactions</h2>
      <div className="space-y-4">
        {recentTransactions.map((transaction, index) => (
          <div key={index} className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-600/50 transition-colors min-w-0">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <div className={`p-2 sm:p-3 rounded-full border flex-shrink-0 ${transaction.type === 'credit' ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                {transaction.type === 'credit' ? (
                  <FaArrowUp className={`w-3 h-3 sm:w-4 sm:h-4 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                ) : (
                  <FaArrowDown className={`w-3 h-3 sm:w-4 sm:h-4 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-200 truncate text-sm sm:text-base">
                  {transaction.description}
                </p>
                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  {transaction.date.toLocaleDateString()} • {categorizeTransaction(transaction.description)}
                </p>
              </div>
            </div>
            <div className="text-right flex-shrink-0 ml-2">
              <p className={`font-bold text-sm sm:text-base ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.type === 'credit' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-center">
        <button 
          onClick={() => setShowAllTransactions(true)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors duration-200 flex items-center gap-2"
        >
          <FaEye />
          View All Transactions
        </button>
      </div>
    </div>
  )

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm sm:flex sm:items-center sm:justify-center sm:p-4" style={{ zIndex: 10000 }}>
      {/* Mobile: Full screen modal */}
      <div className="sm:hidden fixed inset-0 bg-slate-800 overflow-y-auto">
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 px-4 py-3 flex items-center justify-between z-10">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FaEye className="text-blue-400" />
            All Transactions
          </h2>
          <button
            onClick={() => setShowAllTransactions(false)}
            className="text-slate-400 hover:text-white transition-colors text-xl p-2 -m-2"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="px-4 py-4 space-y-3 pb-32">
          {allTransactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-slate-700/50 border border-slate-600 rounded-xl min-w-0">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`p-2 rounded-full border flex-shrink-0 ${transaction.type === 'credit' ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                  {transaction.type === 'credit' ? (
                    <FaArrowUp className={`w-3 h-3 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                  ) : (
                    <FaArrowDown className={`w-3 h-3 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-slate-200 truncate text-sm">
                    {transaction.description}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {transaction.date.toLocaleDateString()} • {categorizeTransaction(transaction.description)}
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-2">
                <p className={`font-bold text-sm ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {transaction.type === 'credit' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Modal dialog */}
      <div className="hidden sm:block w-full max-w-4xl max-h-[80vh] bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FaEye className="text-blue-400" />
            All Transactions
          </h2>
          <button
            onClick={() => setShowAllTransactions(false)}
            className="text-slate-400 hover:text-white transition-colors text-xl p-2 -m-2"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
          <div className="space-y-3">
            {allTransactions.map((transaction, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-700/50 border border-slate-600 rounded-xl hover:bg-slate-600/50 transition-colors min-w-0">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className={`p-3 rounded-full border flex-shrink-0 ${transaction.type === 'credit' ? 'bg-green-500/20 border-green-500/30' : 'bg-red-500/20 border-red-500/30'}`}>
                    {transaction.type === 'credit' ? (
                      <FaArrowUp className={`w-4 h-4 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                    ) : (
                      <FaArrowDown className={`w-4 h-4 ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-200 truncate">
                      {transaction.description}
                    </p>
                    <p className="text-sm text-slate-400 truncate">
                      {transaction.date.toLocaleDateString()} • {categorizeTransaction(transaction.description)}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <p className={`font-bold ${transaction.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}€{Math.abs(transaction.amount).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {mainContent}
      {showAllTransactions && createPortal(modalContent, document.body)}
    </>
  )
}

export default RecentTransactions
