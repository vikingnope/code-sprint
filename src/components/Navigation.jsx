import { Link } from 'react-router-dom'
import { FaHome, FaUser, FaEnvelope } from 'react-icons/fa'

const Navigation = () => {
  return (
    <nav className="p-4 border-b border-gray-300 flex items-center">
      <Link to="/" className="mx-4 flex items-center gap-2 no-underline hover:text-blue-600 transition-colors">
        <FaHome />
        Home
      </Link>
      <Link to="/about" className="mx-4 flex items-center gap-2 no-underline hover:text-blue-600 transition-colors">
        <FaUser />
        About
      </Link>
      <Link to="/contact" className="mx-4 flex items-center gap-2 no-underline hover:text-blue-600 transition-colors">
        <FaEnvelope />
        Contact
      </Link>
    </nav>
  )
}

export default Navigation
