import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Itinerary from './pages/Itinerary'
import Travel from './pages/Travel'
import Stay from './pages/Stay'
import Expenses from './pages/Expenses'
import Lists from './pages/Lists'
import Settings from './pages/Settings'

const tabs = [
  ['/', '🏝️', 'Home'],
  ['/itinerary', '🗓️', 'Plan'],
  ['/travel', '✈️', 'Travel'],
  ['/stay', '🏨', 'Stay'],
  ['/expenses', '💸', 'Money'],
  ['/lists', '✅', 'Lists']
]

export default function App() {
  return (
    <div className="app">
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/stay" element={<Stay />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <nav className="tabbar">
        {tabs.map(([to, icon, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className="tab">
            <span className="tab-icon" aria-hidden>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
