import { Link } from 'react-router-dom'
import { useStore } from '../store'
import Header from '../components/Header'
import FormModal, { useEditor } from '../components/Form'

const fields = [
  { name: 'name', label: 'Name', required: true, placeholder: 'Boracay tourist police' },
  { name: 'phone', label: 'Phone', type: 'tel', placeholder: '+63…' },
  { name: 'kind', label: 'Type', type: 'select', options: ['Police', 'Medical', 'Hotel', 'Airline', 'Transport', 'Family', 'Other'], default: 'Other' },
  { name: 'notes', label: 'Notes', type: 'textarea' }
]
const tel = (p) => 'tel:' + String(p).replace(/[^+\d]/g, '')

function Row({ title, sub, phone, onEdit }) {
  return (
    <li className="card row-between">
      <div className={onEdit ? 'tap' : ''} onClick={onEdit} style={{ flex: 1, minWidth: 0 }}>
        <strong>{title}</strong>
        {phone && <div>{phone}</div>}
        {sub && <div className="muted small">{sub}</div>}
      </div>
      {phone && <a className="btn primary call" href={tel(phone)} aria-label={'Call ' + title}>📞</a>}
    </li>
  )
}

export default function Emergency() {
  const { data, add, update, remove } = useStore()
  const ed = useEditor()
  const contacts = data.contacts || []

  return (
    <div className="page">
      <Header title="Emergency" subtitle="Works offline" action={<Link to="/" className="btn">Done</Link>} />

      <a className="sos" href="tel:911">🚨 Call 911</a>
      <p className="muted small">911 is the Philippines’ national emergency hotline (police, fire, ambulance).</p>

      {(data.stays.length > 0 || data.flights.length > 0) && (
        <section>
          <div className="section-head"><h2>From your bookings</h2></div>
          <ul className="list">
            {data.stays.map((s) => (
              <Row key={s.id} title={'🏨 ' + s.name} phone={s.contact}
                sub={[s.address, s.bookingRef && 'Ref ' + s.bookingRef].filter(Boolean).join(' · ')} />
            ))}
            {data.flights.map((f) => (
              <Row key={f.id} title={`✈️ ${f.airline} ${f.flightNo}`}
                sub={[f.from + ' → ' + f.to, f.bookingRef && 'Ref ' + f.bookingRef].filter(Boolean).join(' · ')} />
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="section-head">
          <h2>My contacts</h2>
          <button className="btn primary sm" onClick={() => ed.openNew({ kind: 'Other' })}>+ Add</button>
        </div>
        {contacts.length === 0 && (
          <p className="empty">Add the local police, nearest clinic, your airline hotline, and family — check the numbers before you go.</p>
        )}
        <ul className="list">
          {contacts.map((c) => (
            <Row key={c.id} title={c.name} phone={c.phone} sub={[c.kind, c.notes].filter(Boolean).join(' · ')} onEdit={() => ed.openEdit(c)} />
          ))}
        </ul>
      </section>

      <section className="card">
        <h2>If something goes wrong</h2>
        <ul className="tips">
          <li>Lost ID or wallet: report to the nearest police station and get a police report.</li>
          <li>Medical: tell the hotel front desk — they know the nearest clinic.</li>
          <li>Flight changed or cancelled: contact the airline using your booking ref above.</li>
          <li>Rough seas: boats to and from Caticlan can be suspended — ask at the Cagban port.</li>
        </ul>
      </section>

      {ed.editing && (
        <FormModal title={ed.editing.__new ? 'Add contact' : 'Edit contact'} fields={fields} initial={ed.editing}
          onSave={(v) => (ed.editing.__new ? add('contacts', v) : update('contacts', ed.editing.id, v))}
          onClose={ed.close} onDelete={!ed.editing.__new && (() => remove('contacts', ed.editing.id))} />
      )}
    </div>
  )
}
