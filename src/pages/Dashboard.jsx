import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import { TRIP, peso, fmtDate, fmtDateTime, dayDate, fmtTime } from '../utils'

function useNow(ms = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), ms); return () => clearInterval(t) }, [ms])
  return now
}

export default function Dashboard() {
  const { data, clearSample } = useStore()
  const now = useNow()
  const start = new Date(TRIP.start + 'T00:00:00')
  const end = new Date(TRIP.end + 'T23:59:59')
  const diff = start - now
  const days = Math.floor(diff / 864e5), hours = Math.floor((diff % 864e5) / 36e5)

  const spent = data.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const remaining = TRIP.budget - spent
  const pct = Math.min(100, (spent / TRIP.budget) * 100)

  // Next upcoming: itinerary items + flights, by datetime
  const upcoming = [
    ...data.itinerary.filter((i) => i.status !== 'done').map((i) => ({
      when: new Date(`${dayDate(i.day)}T${i.time || '00:00'}`),
      label: i.activity, sub: `Day ${i.day} · ${fmtTime(i.time)}${i.location ? ' · ' + i.location : ''}`, to: '/itinerary'
    })),
    ...data.flights.filter((f) => f.depart).map((f) => ({
      when: new Date(f.depart), label: `✈️ ${f.airline} ${f.flightNo}`, sub: `${f.from} → ${f.to} · ${fmtDateTime(f.depart)}`, to: '/travel'
    }))
  ].filter((x) => x.when >= now).sort((a, b) => a.when - b.when)
  const next = upcoming[0]

  return (
    <div className="page">
      <header className="hero">
        <Link to="/settings" className="icon-btn hero-gear" aria-label="Settings & data">⚙️</Link>
        <p className="hero-kicker">{TRIP.travelers.join(' & ')}</p>
        <h1>Boracay 🌴</h1>
        <p>{fmtDate(TRIP.start, { month: 'short', day: 'numeric' })} – {fmtDate(TRIP.end, { month: 'short', day: 'numeric', year: 'numeric' })} · {TRIP.days} days</p>
        <div className="countdown">
          {now > end ? <strong>Trip complete — welcome home! 🏠</strong>
            : diff <= 0 ? <strong>You're in Boracay! 🏖️</strong>
            : <><strong>{days}</strong> days <strong>{hours}</strong> hrs to go</>}
        </div>
      </header>

      {data.sample && (
        <div className="card notice">
          <p>You're viewing <b>sample data</b>. Edit it freely, or start fresh.</p>
          <button className="btn" onClick={() => confirm('Clear all sample data? This removes everything.') && clearSample()}>Clear sample data</button>
        </div>
      )}

      <section className="card">
        <h2>Up next</h2>
        {next ? (
          <Link to={next.to} className="next-item">
            <strong>{next.label}</strong>
            <span className="muted">{next.sub}</span>
          </Link>
        ) : <p className="muted">Nothing upcoming. Add items in Plan.</p>}
      </section>

      <section className="card">
        <h2>Budget</h2>
        <div className="stats">
          <div><span className="muted">Total</span><b>{peso(TRIP.budget)}</b></div>
          <div><span className="muted">Spent</span><b>{peso(spent)}</b></div>
          <div><span className="muted">Remaining</span><b className={remaining < 0 ? 'neg' : 'pos'}>{peso(remaining)}</b></div>
        </div>
        <div className="bar"><div className={'bar-fill' + (remaining < 0 ? ' over' : '')} style={{ width: pct + '%' }} /></div>
        <p className="muted small">{pct.toFixed(0)}% of budget used</p>
      </section>

      <section className="card quick">
        <Link to="/itinerary" className="btn">🗓️ {data.itinerary.length} plans</Link>
        <Link to="/lists" className="btn">🧳 {data.packing.filter((p) => p.done).length}/{data.packing.length} packed</Link>
      </section>
    </div>
  )
}
