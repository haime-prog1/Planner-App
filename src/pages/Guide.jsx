import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import Header from '../components/Header'
import FormModal, { useEditor } from '../components/Form'
import { itineraryFields } from './Itinerary'
import { FOOD, ACTIVITIES } from '../guide'

const LEVELS = { 1: ['₱', 'Budget'], 2: ['₱₱', 'Mid-range'], 3: ['₱₱₱', 'Splurge'] }

export default function Guide() {
  const { add } = useStore()
  const [tab, setTab] = useState('food')
  const [level, setLevel] = useState(0)
  const ed = useEditor()
  const items = (tab === 'food' ? FOOD : ACTIVITIES).filter((x) => !level || x.level === level)

  return (
    <div className="page">
      <Header title="Guide" subtitle="Cheapest first · prices are estimates" action={<Link to="/" className="btn">Done</Link>} />
      <div className="seg">
        <button className={tab === 'food' ? 'active' : ''} onClick={() => setTab('food')}>🍽️ Food</button>
        <button className={tab === 'act' ? 'active' : ''} onClick={() => setTab('act')}>🤿 Activities</button>
      </div>
      <div className="chips">
        {[0, 1, 2, 3].map((l) => (
          <button key={l} className={'chip' + (level === l ? ' active' : '')} onClick={() => setLevel(l)}>
            {l ? `${LEVELS[l][0]} ${LEVELS[l][1]}` : 'All'}
          </button>
        ))}
      </div>
      {[1, 2, 3].filter((l) => items.some((x) => x.level === l)).map((l) => (
        <section key={l}>
          <div className="section-head"><h2>{LEVELS[l][0]} {LEVELS[l][1]}</h2></div>
          <ul className="list">
            {items.filter((x) => x.level === l).map((x) => (
              <li key={x.name} className="card">
                <div className="row-between"><strong>{x.name}</strong><span className="tag">{x.price}</span></div>
                <div className="muted small">📍 {x.area}</div>
                <p className="small">{x.what}</p>
                <button className="btn sm" onClick={() => ed.openNew({
                  day: '1', status: 'planned', activity: x.name, location: x.area,
                  time: tab === 'food' ? '12:00' : '09:00', notes: `${x.price} · ${x.what}`
                })}>＋ Add to plan</button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      <p className="muted small">Prices and opening hours change — check reviews or ask your hotel before going.</p>
      {ed.editing && (
        <FormModal title="Add to plan" fields={itineraryFields} initial={ed.editing}
          onSave={(v) => add('itinerary', { ...v, day: Number(v.day) })} onClose={ed.close} />
      )}
    </div>
  )
}
