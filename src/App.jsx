import { Routes, Route } from 'react-router-dom'
import Navigation from '@components/Navigation'
import Home from '@pages/Home'
import Dashboard from '@pages/Dashboard'
import About from '@pages/About'
import Contact from '@pages/Contact'

function App() {
  return (
    <div className="App">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
