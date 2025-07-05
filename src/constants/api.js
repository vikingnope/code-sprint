import axios from 'axios'

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com', // Example API
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// API methods
export const apiService = {
  // Get all posts
  getPosts: () => api.get('/posts'),
  
  // Get single post
  getPost: (id) => api.get(`/posts/${id}`),
  
  // Create post
  createPost: (data) => api.post('/posts', data),
  
  // Update post
  updatePost: (id, data) => api.put(`/posts/${id}`, data),
  
  // Delete post
  deletePost: (id) => api.delete(`/posts/${id}`),
  
  // Get users
  getUsers: () => api.get('/users'),
}

export default api
