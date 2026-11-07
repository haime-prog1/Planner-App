import { useStore } from '../store'
import Header from '../components/Header'
import FormModal, { useEditor } from '../components/Form'
import { fmtDateTime, peso } from '../utils'

const fields = [
  { name: 'name', label: 'Name', required: true },
  { name: 'address', label: 'Address', type: 'textarea' },
  { name: 'checkIn', label: 'Check-in', type: 'datetime-local' },
  { name: 'checkOut', label: 'Check-out', type: 'datetime-local' },
  { name: 'bookingRef', label: 'Booking ref' },
  { name: 'contact', label: 'Contact', placeholder: 'Phone / email' },
  { name: 'roomType', label: 'Room type' },
  { name: 'total', label: 'Total cost (₱)', type: 'number' },
  { name: 'paid', label: 'Amount paid (₱)', type: 'number' },
  { name: 'notes', label: 'Notes', type: 'textarea' }
]

export default function Stay() {
  const { data, add, update, remove } = useStore()
  const ed = useEditor()
  return (
    <div className="page">
      <Header title="Accommodation" action={<button className="btn primary" onClick={() => ed.openNew()}>+ Add</button>} />
      {data.stays.length === 0 && <p className="empty">No accommodation yet.</p>}
      <ul className="list">
        {data.stays.map((s) => {
          const balance = (Number(s.total) || 0) - (Number(s.paid) || 0)
          return (
            <li key={s.id} className="card tap" onClick={() => ed.openEdit(s)}>
              <strong className="big">{s.name}</strong>
              {s.roomType && <div>{s.roomType}</div>}
              {s.address && (
                <a className="link" href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`} target="_blank" rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}>📍 {s.address}</a>
              )}
              <div className="muted">In: {fmtDateTime(s.checkIn)} · Out: {fmtDateTime(s.checkOut)}</div>
              <div className="muted">Ref {s.bookingRef || '—'}</div>
              {s.contact && (
                <a className="link" href={`tel:${s.contact.replace(/[^+\d]/g, '')}`} onClick={(e) => e.stopPropagation()}>📞 {s.contact}</a>
              )}
              <div className="stats mt">
                <div><span className="muted">Total</span><b>{peso(s.total)}</b></div>
                <div><span className="muted">Paid</span><b className="pos">{peso(s.paid)}</b></div>
                <div><span className="muted">Balance due</span><b className={balance > 0 ? 'neg' : 'pos'}>{peso(balance)}</b></div>
              </div>
              {s.notes && <div className="muted small">{s.notes}</div>}
            </li>
          )
        })}
      </ul>
      {ed.editing && (
        <FormModal title={ed.editing.__new ? 'Add stay' : 'Edit stay'} fields={fields} initial={ed.editing}
          onSave={(v) => (ed.editing.__new ? add('stays', v) : update('stays', ed.editing.id, v))}
          onClose={ed.close} onDelete={!ed.editing.__new && (() => remove('stays', ed.editing.id))} />
      )}
    </div>
  )
}
