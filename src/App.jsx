import { NavLink, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Itinerary from './pages/Itinerary'
import Travel from './pages/Travel'
import Stay from './pages/Stay'
import Expenses from './pages/Expenses'
import Lists from './pages/Lists'
import Settings from './pages/Settings'
import Emergency from './pages/Emergency'
import Guide from './pages/Guide'
import Trips from './pages/Trips'
import { useStore } from './store'
import Icon from './components/Icons'

const tabs = [
  ['/', 'home', 'Home'],
  ['/itinerary', 'plan', 'Plan'],
  ['/travel', 'travel', 'Travel'],
  ['/stay', 'stay', 'Stay'],
  ['/expenses', 'money', 'Money'],
  ['/lists', 'lists', 'Lists']
]

export default function App() {
  const { trip } = useStore()
  return (
    <div className="app">
      <main className="content">
        {!trip ? <Trips /> : (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/travel" element={<Travel />} />
          <Route path="/stay" element={<Stay />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/lists" element={<Lists />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        )}
      </main>
      <nav className="tabbar">
        {tabs.map(([to, icon, label]) => (
          <NavLink key={to} to={to} end={to === '/'} className="tab">
            <Icon name={icon} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
