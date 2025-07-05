import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaChartBar, FaWallet } from 'react-icons/fa'

const Navigation = () => {
  const location = useLocation()
  
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white">
              <FaWallet className="text-2xl text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Spendy
              </span>
            </Link>
            <div className="flex items-center space-x-2">
              <Link 
                to="/" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-slate-700 text-white shadow-lg ring-2 ring-blue-500/50' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FaHome />
                Home
              </Link>
              <Link 
                to="/dashboard" 
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive('/dashboard') 
                    ? 'bg-slate-700 text-white shadow-lg ring-2 ring-blue-500/50' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FaChartBar />
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-slate-600">
              <span className="text-slate-200 text-sm font-medium">
                Welcome back!
              </span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
