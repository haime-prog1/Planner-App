import { useStore } from '../store'
import Header from '../components/Header'
import FormModal, { useEditor } from '../components/Form'
import { TRIP, peso, fmtDate } from '../utils'

export const CATEGORIES = ['flights', 'hotel', 'food', 'transport', 'activities', 'fees', 'shopping', 'other']
const ICON = { flights: '✈️', hotel: '🏨', food: '🍽️', transport: '🛺', activities: '🤿', fees: '🧾', shopping: '🛍️', other: '📦' }
const [A, B] = TRIP.travelers

export const expenseFields = [
  { name: 'date', label: 'Date', type: 'date', required: true },
  { name: 'description', label: 'Description', required: true },
  { name: 'category', label: 'Category', type: 'select', options: CATEGORIES.map((c) => [c, `${ICON[c]} ${c}`]), default: 'food' },
  { name: 'amount', label: 'Amount (₱)', type: 'number', required: true },
  { name: 'paidBy', label: 'Paid by', type: 'select', options: TRIP.travelers, default: A },
  { name: 'foreignAmount', label: 'Foreign amount (optional)', type: 'number' },
  { name: 'foreignCurrency', label: 'Foreign currency (optional)', placeholder: 'USD' },
  { name: 'notes', label: 'Notes', type: 'textarea' }
]

export const newExpense = () => ({ date: new Date().toLocaleDateString('en-CA'), category: 'food', paidBy: A })

export default function Expenses() {
  const { data, add, update, remove } = useStore()
  const ed = useEditor()
  const list = [...data.expenses].sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  const total = list.reduce((s, e) => s + (Number(e.amount) || 0), 0)

  const byCat = CATEGORIES.map((c) => [c, list.filter((e) => e.category === c).reduce((s, e) => s + (Number(e.amount) || 0), 0)])
    .filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1])
  const maxCat = Math.max(1, ...byCat.map(([, v]) => v))

  // Equal split: each should pay half
  const paid = Object.fromEntries(TRIP.travelers.map((p) => [p, list.filter((e) => e.paidBy === p).reduce((s, e) => s + (Number(e.amount) || 0), 0)]))
  const share = total / 2
  const diff = paid[A] - share // >0: B owes A
  const settle = Math.abs(diff) < 0.5 ? 'All square — nobody owes anything. 🤝'
    : diff > 0 ? `${B} owes ${A} ${peso(diff)}` : `${A} owes ${B} ${peso(-diff)}`

  return (
    <div className="page">
      <Header title="Expenses" subtitle={`${peso(total)} spent of ${peso(TRIP.budget)}`}
        action={<button className="btn primary" onClick={() => ed.openNew(newExpense())}>+ Add</button>} />

      <section className="card">
        <h2>By category</h2>
        {byCat.length === 0 && <p className="muted">No expenses yet.</p>}
        <div className="chart">
          {byCat.map(([c, v]) => (
            <div key={c} className="chart-row">
              <span className="chart-label">{ICON[c]} {c}</span>
              <div className="chart-track"><div className={'chart-bar cat-' + c} style={{ width: (v / maxCat) * 100 + '%' }} /></div>
              <span className="chart-val">{peso(v)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Split (50/50)</h2>
        <div className="stats">
          {TRIP.travelers.map((p) => <div key={p}><span className="muted">{p} paid</span><b>{peso(paid[p])}</b></div>)}
          <div><span className="muted">Each share</span><b>{peso(share)}</b></div>
        </div>
        <p className="settle">{settle}</p>
      </section>

      <ul className="list">
        {list.map((e) => (
          <li key={e.id} className="card tap row-between" onClick={() => ed.openEdit(e)}>
            <div>
              <strong>{ICON[e.category]} {e.description}</strong>
              <div className="muted small">{fmtDate(e.date)} · {e.paidBy}{e.notes && ' · ' + e.notes}</div>
            </div>
            <div className="right">
              <b>{peso(e.amount)}</b>
              {e.foreignAmount !== '' && e.foreignAmount != null && <div className="muted small">{e.foreignAmount} {e.foreignCurrency}</div>}
            </div>
          </li>
        ))}
      </ul>

      {ed.editing && (
        <FormModal title={ed.editing.__new ? 'Add expense' : 'Edit expense'} fields={expenseFields} initial={ed.editing}
          onSave={(v) => (ed.editing.__new ? add('expenses', v) : update('expenses', ed.editing.id, v))}
          onClose={ed.close} onDelete={!ed.editing.__new && (() => remove('expenses', ed.editing.id))} />
      )}
    </div>
  )
}
