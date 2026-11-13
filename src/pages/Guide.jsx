import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import Header from '../components/Header'
import FormModal, { useEditor } from '../components/Form'
import { itineraryFields } from './Itinerary'
import { guideFor, mapsUrl } from '../guide'

/** Lowest number in a price label like "~₱1,500–2,500" (Free = 0) */
const minPrice = (p) => { const m = String(p).replace(/,/g, '').match(/\d+/); return m ? Number(m[0]) : /free/i.test(p) ? 0 : 1e9 }

const LEVELS = { 1: ['₱', 'Budget'], 2: ['₱₱', 'Mid-range'], 3: ['₱₱₱', 'Splurge'] }
const TABS = [['food', '🍽️ Food'], ['spots', '🤫 Hidden spots'], ['activities', '🤿 Activities']]

export default function Guide() {
  const { add, trip } = useStore()
  const guide = guideFor(trip)
  const city = guide?.city || trip.destination.split(',')[0]
  const tabs = TABS.filter(([k]) => !guide || guide[k].length)
  const [tab, setTab] = useState('food')
  const [level, setLevel] = useState(0)
  const [q, setQ] = useState('')
  const ed = useEditor()

  const items = (guide?.[tab] || [])
    .filter((x) => !level || x.level === level)
    .filter((x) => !q || `${x.name} ${x.area} ${x.what}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => a.level - b.level || minPrice(a.price) - minPrice(b.price)) // cheapest first

  const nearMe = { food: 'restaurants', spots: 'tourist attractions', activities: 'things to do' }[tab]

  return (
    <div className="page">
      <Header title="Finder" subtitle={`${city} · cheapest first`} action={<Link to="/" className="btn">Done</Link>} />

      <input className="search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search food, places…" />

      {guide && (
        <div className="seg">
          {tabs.map(([k, label]) => <button key={k} className={tab === k ? 'active' : ''} onClick={() => setTab(k)}>{label}</button>)}
        </div>
      )}
      {guide && tab !== 'spots' && (
        <div className="chips">
          {[0, 1, 2, 3].map((l) => (
            <button key={l} className={'chip' + (level === l ? ' active' : '')} onClick={() => setLevel(l)}>
              {l ? `${LEVELS[l][0]} ${LEVELS[l][1]}` : 'All'}
            </button>
          ))}
        </div>
      )}

      {!guide && <p className="empty">No curated list for {city} yet — use the map search below.</p>}
      {guide && items.length === 0 && <p className="empty">No matches.</p>}

      {[1, 2, 3].filter((l) => items.some((x) => x.level === l)).map((l) => (
        <section key={l}>
          {tab !== 'spots' && <div className="section-head"><h2>{LEVELS[l][0]} {LEVELS[l][1]}</h2></div>}
          <ul className="list">
            {items.filter((x) => x.level === l).map((x) => (
              <li key={x.name} className="card">
                <div className="row-between"><strong>{x.name}</strong><span className="tag">{x.price}</span></div>
                <div className="muted small">📍 {x.area}</div>
                <p className="small">{x.what}</p>
                <div className="actions">
                  <a className="btn sm" href={mapsUrl(`${x.name}, ${city}`)} target="_blank" rel="noreferrer">📍 Maps</a>
                  <button className="btn sm" onClick={() => ed.openNew({
                    day: '1', status: 'planned', activity: x.name, location: x.area,
                    time: tab === 'food' ? '12:00' : '09:00', notes: `${x.price} · ${x.what}`
                  })}>＋ Add to plan</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="card stack">
        <h2>Find more</h2>
        <a className="btn primary full" href={mapsUrl(`${q || nearMe} near me`)} target="_blank" rel="noreferrer">🧭 {q ? `“${q}”` : nearMe} near me</a>
        <a className="btn full" href={mapsUrl(`${q || nearMe} in ${city}`)} target="_blank" rel="noreferrer">🗺️ {q ? `“${q}”` : nearMe} in {city}</a>
      </section>
      <p className="muted small">Researched from travel guides and review sites (Nov 2026). Prices are estimates and places can close — check Maps before going.</p>

      {ed.editing && (
        <FormModal title="Add to plan" fields={itineraryFields(trip)} initial={ed.editing}
          onSave={(v) => add('itinerary', { ...v, day: Number(v.day) })} onClose={ed.close} />
      )}
    </div>
  )
}
