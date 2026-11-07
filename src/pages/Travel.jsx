import { useStore } from '../store'
import Header from '../components/Header'
import FormModal, { useEditor } from '../components/Form'
import { fmtDateTime, peso } from '../utils'

const flightFields = [
  { name: 'direction', label: 'Direction', type: 'select', options: ['Outbound', 'Return', 'Other'], default: 'Outbound' },
  { name: 'airline', label: 'Airline', required: true },
  { name: 'flightNo', label: 'Flight no.' },
  { name: 'bookingRef', label: 'Booking ref' },
  { name: 'from', label: 'From airport', placeholder: 'MNL' },
  { name: 'to', label: 'To airport', placeholder: 'MPH (Caticlan)' },
  { name: 'depart', label: 'Departure', type: 'datetime-local' },
  { name: 'arrive', label: 'Arrival', type: 'datetime-local' },
  { name: 'baggage', label: 'Baggage' },
  { name: 'notes', label: 'Notes', type: 'textarea' }
]
const transferFields = [
  { name: 'leg', label: 'Leg', required: true, placeholder: 'Airport → Caticlan jetty' },
  { name: 'mode', label: 'Mode', type: 'select', options: ['Van', 'Tricycle', 'E-trike', 'Boat', 'E-trike + Boat', 'Bus', 'Car', 'Walk', 'Other'], default: 'Van' },
  { name: 'time', label: 'Time', type: 'datetime-local' },
  { name: 'provider', label: 'Provider' },
  { name: 'bookingRef', label: 'Booking ref' },
  { name: 'cost', label: 'Cost (₱)', type: 'number' },
  { name: 'notes', label: 'Notes', type: 'textarea' }
]

function Section({ title, col, fields, items, render }) {
  const { add, update, remove } = useStore()
  const ed = useEditor()
  return (
    <section>
      <div className="section-head">
        <h2>{title}</h2>
        <button className="btn primary sm" onClick={() => ed.openNew()}>+ Add</button>
      </div>
      {items.length === 0 && <p className="empty">Nothing added yet.</p>}
      <ul className="list">
        {items.map((x) => <li key={x.id} className="card tap" onClick={() => ed.openEdit(x)}>{render(x)}</li>)}
      </ul>
      {ed.editing && (
        <FormModal title={(ed.editing.__new ? 'Add ' : 'Edit ') + title.toLowerCase()} fields={fields} initial={ed.editing}
          onSave={(v) => (ed.editing.__new ? add(col, v) : update(col, ed.editing.id, v))}
          onClose={ed.close} onDelete={!ed.editing.__new && (() => remove(col, ed.editing.id))} />
      )}
    </section>
  )
}

export default function Travel() {
  const { data } = useStore()
  const transfers = [...data.transfers].sort((a, b) => (a.time || '').localeCompare(b.time || ''))
  return (
    <div className="page">
      <Header title="Flights & transfers" subtitle="Airport → Caticlan jetty → Cagban → hotel" />
      <Section title="Flights" col="flights" fields={flightFields} items={data.flights} render={(f) => (
        <>
          <div className="row-between"><span className="tag">{f.direction}</span><span className="muted">Ref {f.bookingRef || '—'}</span></div>
          <strong className="big">{f.from} → {f.to}</strong>
          <div>{f.airline} {f.flightNo}</div>
          <div className="muted">🛫 {fmtDateTime(f.depart)} · 🛬 {fmtDateTime(f.arrive)}</div>
          {f.baggage && <div className="muted small">🧳 {f.baggage}</div>}
          {f.notes && <div className="muted small">{f.notes}</div>}
        </>
      )} />
      <Section title="Transfers" col="transfers" fields={transferFields} items={transfers} render={(t) => (
        <>
          <div className="row-between"><strong>{t.leg}</strong><span className="tag">{t.mode}</span></div>
          <div className="muted">{fmtDateTime(t.time)}{t.provider && ' · ' + t.provider}{t.bookingRef && ' · Ref ' + t.bookingRef}</div>
          {t.cost !== '' && t.cost != null && <div>{peso(t.cost)}</div>}
          {t.notes && <div className="muted small">{t.notes}</div>}
        </>
      )} />
    </div>
  )
}
