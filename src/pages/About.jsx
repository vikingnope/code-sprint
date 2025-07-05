import { useState, useEffect } from 'react'
import { FaSpinner, FaUsers, FaExclamationTriangle } from 'react-icons/fa'
import { apiService } from '@constants/api'

const About = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await apiService.getUsers()
        setUsers(response.data.slice(0, 5)) // Get first 5 users
        setError(null)
      } catch (err) {
        setError('Failed to fetch users')
        console.error('Error fetching users:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <div className="text-center p-8">
        <FaSpinner className="spinner mx-auto text-3xl mb-4" />
        <p>Loading users...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <FaExclamationTriangle className="text-3xl mb-4 mx-auto" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="flex items-center gap-2">
        <FaUsers />
        About Page
      </h1>
      <p>This page demonstrates axios API calls and react-icons usage.</p>
      
      <h2>Sample Users from API:</h2>
      <div className="grid gap-4 mt-4">
        {users.map(user => (
          <div key={user.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Website: {user.website}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default About
