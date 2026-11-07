import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import Icon from '../components/Icons'
import Weather from '../components/Weather'
import FormModal, { useEditor } from '../components/Form'
import { expenseFields, newExpense } from './Expenses'
import { peso, fmtDateTime, dayDate, fmtTime, fmtRange, tripDays } from '../utils'
import { TYPE } from './Trips'

function useNow(ms = 30000) {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), ms); return () => clearInterval(t) }, [ms])
  return now
}

export default function Dashboard() {
  const { data, trip, clearSample, add } = useStore()
  const ed = useEditor()
  const now = useNow()
  const start = new Date(trip.start + 'T00:00:00')
  const end = new Date(trip.end + 'T23:59:59')
  const diff = start - now
  const days = Math.floor(diff / 864e5), hours = Math.floor((diff % 864e5) / 36e5)

  const spent = data.expenses.reduce((s, e) => s + (Number(e.amount) || 0), 0)
  const budget = Number(trip.budget) || 0
  const remaining = budget - spent
  const pct = budget ? Math.min(100, (spent / budget) * 100) : 0

  // Next upcoming: itinerary items + flights, by datetime
  const upcoming = [
    ...data.itinerary.filter((i) => i.status !== 'done').map((i) => ({
      when: new Date(`${dayDate(trip, i.day)}T${i.time || '00:00'}`),
      label: i.activity, sub: `Day ${i.day} · ${fmtTime(i.time)}${i.location ? ' · ' + i.location : ''}`, to: '/itinerary'
    })),
    ...data.flights.filter((f) => f.depart).map((f) => ({
      when: new Date(f.depart), label: `✈️ ${f.airline} ${f.flightNo}`, sub: `${f.from} → ${f.to} · ${fmtDateTime(f.depart)}`, to: '/travel'
    }))
  ].filter((x) => x.when >= now).sort((a, b) => a.when - b.when)
  const next = upcoming[0]

  return (
    <div className="page">
      <header className={'hero hero-pad ' + trip.type}>
        <Link to="/trips" className="hero-trips">‹ All trips</Link>
        <Link to="/settings" className="icon-btn hero-gear" aria-label="Settings & data"><Icon name="gear" size={22} /></Link>
        <p className="hero-kicker">{TYPE[trip.type][0]} {TYPE[trip.type][1]} · {trip.travelers.join(' & ')}</p>
        <h1>{trip.name}</h1>
        <p className="small">📍 {trip.destination}</p>
        <p>{fmtRange(trip)} · {tripDays(trip)} day{tripDays(trip) > 1 ? 's' : ''}</p>
        <div className="countdown">
          {now > end ? <strong>Trip complete ✅</strong>
            : diff <= 0 ? <strong>You're on this trip now! ✈️</strong>
            : <><strong>{days}</strong> {days === 1 ? "day" : "days"} <strong>{hours}</strong> {hours === 1 ? "hr" : "hrs"} to go</>}
        </div>
      </header>

      {trip.sample && (
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

      <Weather trip={trip} />

      <section className="card">
        <h2>Budget</h2>
        <div className="stats">
          <div><span className="muted">Total</span><b>{peso(budget)}</b></div>
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

      {/boracay/i.test(trip.destination + trip.name) && <Link to="/guide" className="btn full guide-btn">🍽️ Food &amp; activities guide</Link>}

      <Link to="/emergency" className="btn danger full">🆘 Emergency info</Link>

      <button className="btn primary fab" onClick={() => ed.openNew(newExpense(trip))}>＋ ₱ Expense</button>
      {ed.editing && (
        <FormModal title="Add expense" fields={expenseFields(trip)} initial={ed.editing}
          onSave={(v) => add('expenses', v)} onClose={ed.close} />
      )}
    </div>
  )
}
