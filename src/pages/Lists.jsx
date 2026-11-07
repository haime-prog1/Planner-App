import { useState } from 'react'
import { useStore } from '../store'
import Header from '../components/Header'

function Checklist({ col, placeholder }) {
  const { data, add, update, remove } = useStore()
  const [text, setText] = useState('')
  const items = data[col]
  const done = items.filter((i) => i.done).length
  const submit = (e) => {
    e.preventDefault()
    if (text.trim()) { add(col, { text: text.trim(), done: false }); setText('') }
  }
  return (
    <>
      <p className="muted">{done} of {items.length} done</p>
      <div className="bar"><div className="bar-fill" style={{ width: (items.length ? (done / items.length) * 100 : 0) + '%' }} /></div>
      <form className="add-row" onSubmit={submit}>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} />
        <button className="btn primary">Add</button>
      </form>
      <ul className="list">
        {items.map((i) => (
          <li key={i.id} className={'card check' + (i.done ? ' is-done' : '')}>
            <label>
              <input type="checkbox" checked={i.done} onChange={() => update(col, i.id, { done: !i.done })} />
              <span>{i.text}</span>
            </label>
            <button className="icon-btn" aria-label="Delete" onClick={() => remove(col, i.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Lists() {
  const [tab, setTab] = useState('packing')
  return (
    <div className="page">
      <Header title="Checklists" />
      <div className="seg">
        <button className={tab === 'packing' ? 'active' : ''} onClick={() => setTab('packing')}>🧳 Packing</button>
        <button className={tab === 'todos' ? 'active' : ''} onClick={() => setTab('todos')}>📝 Pre-trip</button>
      </div>
      {tab === 'packing'
        ? <Checklist key="p" col="packing" placeholder="Add packing item…" />
        : <Checklist key="t" col="todos" placeholder="Add to-do…" />}
    </div>
  )
}
