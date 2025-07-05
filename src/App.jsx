import { Routes, Route } from 'react-router-dom'
import Navigation from '@components/shared/Navigation'
import Dashboard from '@pages/Dashboard'
import Savings from '@pages/Savings'
import WhatsApp from '@pages/WhatsApp'

function App() {
  return (
    <div className="App min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/savings" element={<Savings />} />
          <Route path="/whatsapp" element={<WhatsApp />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
