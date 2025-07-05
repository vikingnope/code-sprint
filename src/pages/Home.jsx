import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaChartLine, FaWallet, FaPiggyBank, FaArrowRight, FaBullseye, FaRocket } from 'react-icons/fa'

const Home = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show the welcome screen for 2 seconds before redirecting
    const timer = setTimeout(() => {
      setIsLoading(false)
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    }, 2000)

    return () => clearTimeout(timer)
  }, [navigate])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                <FaWallet className="text-4xl text-blue-500" />
              </div>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
            Spendy
          </h1>
          <p className="text-xl text-slate-300 mb-8">Your personal finance companion</p>
          <div className="flex items-center justify-center gap-2 text-blue-400">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-slate-700 p-8 mb-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-6">
            Welcome Back!
          </h1>
          <p className="text-xl text-slate-300 mb-8">Ready to take control of your finances?</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6">
              <FaChartLine className="text-3xl text-blue-400 mb-4 mx-auto" />
              <h3 className="font-semibold text-slate-200 mb-2">Track Expenses</h3>
              <p className="text-slate-400 text-sm">Monitor your spending patterns</p>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6">
              <FaPiggyBank className="text-3xl text-purple-400 mb-4 mx-auto" />
              <h3 className="font-semibold text-slate-200 mb-2">Save Money</h3>
              <p className="text-slate-400 text-sm">Achieve your financial goals</p>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6">
              <FaWallet className="text-3xl text-green-400 mb-4 mx-auto" />
              <h3 className="font-semibold text-slate-200 mb-2">Manage Budget</h3>
              <p className="text-slate-400 text-sm">Stay on top of your finances</p>
            </div>
            <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-6">
              <FaBullseye className="text-3xl text-orange-400 mb-4 mx-auto" />
              <h3 className="font-semibold text-slate-200 mb-2">Set Goals</h3>
              <p className="text-slate-400 text-sm">Plan for your future</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <button 
              onClick={() => navigate('/dashboard')}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ring-2 ring-blue-500/30"
            >
              Go to Dashboard
              <FaArrowRight className="text-lg" />
            </button>
            
            <button 
              onClick={() => navigate('/savings')}
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ring-2 ring-green-500/30"
            >
              Start Saving
              <FaRocket className="text-lg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
