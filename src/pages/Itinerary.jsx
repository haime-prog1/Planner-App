import { useState } from 'react'
import { useStore } from '../store'
import Header from '../components/Header'
import FormModal, { useEditor } from '../components/Form'
import { TRIP, dayDate, fmtDate, fmtTime } from '../utils'

const STATUSES = ['planned', 'booked', 'done']
const fields = [
  { name: 'day', label: 'Day', type: 'select', options: Array.from({ length: TRIP.days }, (_, i) => [String(i + 1), `Day ${i + 1} · ${fmtDate(dayDate(i + 1))}`]) },
  { name: 'time', label: 'Time', type: 'time' },
  { name: 'activity', label: 'Activity', required: true },
  { name: 'location', label: 'Location' },
  { name: 'status', label: 'Status', type: 'select', options: STATUSES, default: 'planned' },
  { name: 'notes', label: 'Notes', type: 'textarea' }
]

export default function Itinerary() {
  const { data, add, update, remove, replaceList } = useStore()
  const [day, setDay] = useState(1)
  const ed = useEditor()
  const items = data.itinerary.filter((i) => Number(i.day) === day)

  // Move within a day by swapping positions in the full list
  const move = (item, dir) => {
    const idx = items.indexOf(item), other = items[idx + dir]
    if (!other) return
    const list = [...data.itinerary]
    const a = list.indexOf(item), b = list.indexOf(other)
    ;[list[a], list[b]] = [list[b], list[a]]
    replaceList('itinerary', list)
  }
  const sortByTime = () => {
    const others = data.itinerary.filter((i) => Number(i.day) !== day)
    replaceList('itinerary', [...others, ...[...items].sort((a, b) => (a.time || '').localeCompare(b.time || ''))])
  }
  const cycle = (i) => update('itinerary', i.id, { status: STATUSES[(STATUSES.indexOf(i.status) + 1) % 3] })

  const save = (v) => {
    const item = { ...v, day: Number(v.day) }
    ed.editing.__new ? add('itinerary', item) : update('itinerary', ed.editing.id, item)
  }

  return (
    <div className="page">
      <Header title="Itinerary" subtitle={fmtDate(dayDate(day), { weekday: 'long', month: 'long', day: 'numeric' })}
        action={<button className="btn primary" onClick={() => ed.openNew({ day: String(day), status: 'planned' })}>+ Add</button>} />
      <div className="seg">
        {Array.from({ length: TRIP.days }, (_, i) => i + 1).map((d) => (
          <button key={d} className={d === day ? 'active' : ''} onClick={() => setDay(d)}>
            Day {d}<small>{fmtDate(dayDate(d), { month: 'short', day: 'numeric' })}</small>
          </button>
        ))}
      </div>
      {items.length === 0 && <p className="empty">No plans for Day {day} yet.</p>}
      <ul className="list">
        {items.map((i, idx) => (
          <li key={i.id} className={'card row item-' + i.status}>
            <div className="row-main" onClick={() => ed.openEdit({ ...i, day: String(i.day) })}>
              <div className="row-time">{fmtTime(i.time) || '—'}</div>
              <div>
                <strong>{i.activity}</strong>
                {i.location && <div className="muted">📍 {i.location}</div>}
                {i.notes && <div className="muted small">{i.notes}</div>}
              </div>
            </div>
            <div className="row-side">
              <button className={'pill ' + i.status} onClick={() => cycle(i)}>{i.status}</button>
              <div className="reorder">
                <button className="icon-btn" disabled={idx === 0} onClick={() => move(i, -1)} aria-label="Move up">▲</button>
                <button className="icon-btn" disabled={idx === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">▼</button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {items.length > 1 && <button className="btn ghost full" onClick={sortByTime}>Sort Day {day} by time</button>}
      {ed.editing && (
        <FormModal title={ed.editing.__new ? 'Add activity' : 'Edit activity'} fields={fields} initial={ed.editing}
          onSave={save} onClose={ed.close} onDelete={!ed.editing.__new && (() => remove('itinerary', ed.editing.id))} />
      )}
    </div>
  )
}
