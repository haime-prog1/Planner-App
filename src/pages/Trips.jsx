import { useNavigate } from 'react-router-dom'
import { useStore } from '../store'
import Header from '../components/Header'
import FormModal, { useEditor } from '../components/Form'
import { fmtRange, tripDays, tripStatus, spentOf, peso, dayDate } from '../utils'

export const TYPE = { work: ['💼', 'Work'], vacation: ['🌴', 'Vacation'] }

export const tripFields = [
  { name: 'name', label: 'Trip name', required: true, placeholder: 'e.g. Leyte monitoring' },
  { name: 'destination', label: 'Destination (city, province)', required: true, placeholder: 'e.g. Tacloban City, Leyte' },
  { name: 'type', label: 'Type', type: 'select', options: [['work', '💼 Work / official travel'], ['vacation', '🌴 Vacation']], default: 'work' },
  { name: 'start', label: 'Start date', type: 'date', required: true },
  { name: 'end', label: 'End date', type: 'date', required: true },
  { name: 'budget', label: 'Budget / allowance (₱)', type: 'number' },
  { name: 'travelers', label: 'Travelers (comma-separated)', placeholder: 'James' },
  { name: 'purpose', label: 'Purpose / notes', type: 'textarea', placeholder: 'e.g. Project monitoring, NSTW exhibit' }
]

/** Form values ↔ trip object (travelers is an array in the trip) */
export const toForm = (t) => ({ ...t, travelers: (t.travelers || []).join(', ') })
export const fromForm = (v) => {
  const travelers = String(v.travelers || '').split(',').map((s) => s.trim()).filter(Boolean)
  const out = { ...v, travelers: travelers.length ? travelers : ['James'], budget: Number(v.budget) || 0 }
  if (out.end < out.start) out.end = out.start
  out.lat = undefined; out.lon = undefined // re-locate weather if destination changed
  return out
}

function countdown(t, now) {
  const s = tripStatus(t, now)
  if (s === 'done') return 'Done'
  if (s === 'ongoing') {
    const day = Math.floor((now - new Date(t.start + 'T00:00:00')) / 864e5) + 1
    return `Day ${day} of ${tripDays(t)}`
  }
  const d = Math.ceil((new Date(t.start + 'T00:00:00') - now) / 864e5)
  return d <= 1 ? 'Tomorrow' : `In ${d} days`
}

/** Month grids for every month touched by a trip, days colored by trip type */
function Calendar({ trips, onOpen }) {
  const months = new Set()
  trips.forEach((t) => {
    for (let i = 1; i <= tripDays(t); i++) months.add(dayDate(t, i).slice(0, 7))
  })
  const today = new Date().toLocaleDateString('en-CA')
  return [...months].sort().map((ym) => {
    const [y, m] = ym.split('-').map(Number)
    const first = new Date(y, m - 1, 1).getDay()
    const count = new Date(y, m, 0).getDate()
    const cells = Array.from({ length: first }, () => null).concat(Array.from({ length: count }, (_, i) => i + 1))
    return (
      <section key={ym} className="card">
        <h2>{new Date(y, m - 1, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <div className="cal">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <span key={i} className="cal-h">{d}</span>)}
          {cells.map((d, i) => {
            if (!d) return <span key={i} />
            const iso = `${ym}-${String(d).padStart(2, '0')}`
            const t = trips.find((x) => iso >= x.start && iso <= x.end)
            return (
              <button key={i} className={'cal-d' + (t ? ' on ' + t.type : '') + (iso === today ? ' today' : '')}
                onClick={() => t && onOpen(t.id)} disabled={!t} title={t?.name}>{d}</button>
            )
          })}
        </div>
        <div className="cal-legend">
          {trips.filter((t) => t.start.slice(0, 7) <= ym && t.end.slice(0, 7) >= ym).map((t) => (
            <button key={t.id} className="legend-item" onClick={() => onOpen(t.id)}>
              <i className={'dot ' + t.type} />{t.name} <span className="muted">{fmtRange(t).replace(/, \d{4}$/, '')}</span>
            </button>
          ))}
        </div>
      </section>
    )
  })
}

export default function Trips() {
  const { root, setActive, addTrip, updateTrip, removeTrip } = useStore()
  const nav = useNavigate()
  const ed = useEditor()
  const now = new Date()
  const trips = [...root.trips].sort((a, b) => a.start.localeCompare(b.start))
  const open = (id) => { setActive(id); nav('/') }
  const groups = ['ongoing', 'upcoming', 'done'].map((s) => [s, trips.filter((t) => tripStatus(t, now) === s)])
  const work = trips.filter((t) => t.type === 'work').length

  return (
    <div className="page">
      <Header title="My trips" subtitle={`${trips.length} trips · ${work} work · ${trips.length - work} vacation`}
        action={<button className="btn primary" onClick={() => ed.openNew({ type: 'work', travelers: 'James' })}>+ New</button>} />

      {trips.length === 0 && <p className="empty">No trips yet. Tap + New to add one.</p>}

      <Calendar trips={trips} onOpen={open} />

      {groups.filter(([, l]) => l.length).map(([s, list]) => (
        <section key={s}>
          <div className="section-head"><h2>{{ ongoing: 'Happening now', upcoming: 'Upcoming', done: 'Past' }[s]}</h2></div>
          <ul className="list">
            {list.map((t) => {
              const spent = spentOf(t)
              return (
                <li key={t.id} className={'card tap trip-card ' + t.type + (t.id === root.activeId ? ' active' : '')} onClick={() => open(t.id)}>
                  <div className="row-between">
                    <span className={'type-badge ' + t.type}>{TYPE[t.type][0]} {TYPE[t.type][1]}</span>
                    <span className="tag">{countdown(t, now)}</span>
                  </div>
                  <strong className="big">{t.name}</strong>
                  <div className="muted">📍 {t.destination}</div>
                  <div className="muted small">{fmtRange(t)} · {tripDays(t)} day{tripDays(t) > 1 ? 's' : ''}</div>
                  {t.purpose && <div className="small">{t.purpose}</div>}
                  {t.budget > 0 && (
                    <>
                      <div className="bar"><div className={'bar-fill' + (spent > t.budget ? ' over' : '')} style={{ width: Math.min(100, (spent / t.budget) * 100) + '%' }} /></div>
                      <div className="muted small">{peso(spent)} of {peso(t.budget)}</div>
                    </>
                  )}
                  <div className="row-between mt">
                    <span className="muted small">{t.itinerary.length} plans · {t.todos.filter((x) => x.done).length}/{t.todos.length} to-dos</span>
                    <button className="btn sm" onClick={(e) => { e.stopPropagation(); ed.openEdit(toForm(t)) }}>Edit</button>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ))}

      {ed.editing && (
        <FormModal title={ed.editing.__new ? 'New trip' : 'Edit trip'} fields={tripFields} initial={ed.editing}
          onSave={(v) => (ed.editing.__new ? (addTrip(fromForm(v)), nav('/')) : updateTrip(ed.editing.id, fromForm(v)))}
          onClose={ed.close}
          onDelete={!ed.editing.__new && (() => removeTrip(ed.editing.id))} />
      )}
    </div>
  )
}
