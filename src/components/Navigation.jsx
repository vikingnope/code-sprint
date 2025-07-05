import { Link } from 'react-router-dom'
import { FaHome, FaUser, FaEnvelope, FaChartBar } from 'react-icons/fa'

const Navigation = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Financial Dashboard
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                <FaHome />
                Home
              </Link>
              <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                <FaChartBar />
                Dashboard
              </Link>
              <Link to="/about" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                <FaUser />
                About
              </Link>
              <Link to="/contact" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors">
                <FaEnvelope />
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
