import { Routes, Route } from 'react-router-dom'
import Navigation from '@components/Navigation'
import Home from '@pages/Home'
import Dashboard from '@pages/Dashboard'

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
