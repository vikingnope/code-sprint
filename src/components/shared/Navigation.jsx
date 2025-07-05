import { Link, useLocation } from 'react-router-dom'
import { FaHome, FaChartBar, FaWallet, FaPiggyBank, FaBars, FaTimes } from 'react-icons/fa'
import { useState } from 'react'

const Navigation = () => {
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <nav className="bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white" onClick={closeMenu}>
              <FaWallet className="text-2xl text-blue-400" />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Spendy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
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
            <Link 
              to="/savings" 
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive('/savings') 
                  ? 'bg-slate-700 text-white shadow-lg ring-2 ring-blue-500/50' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FaPiggyBank />
              Savings
            </Link>
          </div>

          {/* Desktop Welcome Message */}
          <div className="hidden md:flex items-center">
            <div className="bg-slate-700/50 backdrop-blur-sm rounded-lg px-3 py-1 border border-slate-600">
              <span className="text-slate-200 text-sm font-medium">
                Welcome back!
              </span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-slate-300 hover:text-white p-2 rounded-lg hover:bg-slate-700/50 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>

      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-700 bg-gradient-to-r from-slate-800 to-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <div className="py-3 space-y-1">
              <Link 
                to="/" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive('/') 
                    ? 'bg-slate-700 text-white shadow-lg ring-2 ring-blue-500/50' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FaHome className="text-lg" />
                Home
              </Link>
              <Link 
                to="/dashboard" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive('/dashboard') 
                    ? 'bg-slate-700 text-white shadow-lg ring-2 ring-blue-500/50' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FaChartBar className="text-lg" />
                Dashboard
              </Link>
              <Link 
                to="/savings" 
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-base font-medium transition-all duration-200 ${
                  isActive('/savings') 
                    ? 'bg-slate-700 text-white shadow-lg ring-2 ring-blue-500/50' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <FaPiggyBank className="text-lg" />
                Savings
              </Link>
              <div className="pt-3 mt-3 border-t border-slate-700">
                <div className="bg-slate-700/50 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-600">
                  <span className="text-slate-200 text-sm font-medium">
                    Welcome back!
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
