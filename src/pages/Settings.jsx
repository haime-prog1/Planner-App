import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import Header from '../components/Header'
import { downloadJSON, shareJSON, readJSONFile } from '../utils'
import { BORACAY_ID } from '../sample'

export default function Settings() {
  const { root, trip, importData, clearSample, loadSample } = useStore()
  const fileRef = useRef()
  const [msg, setMsg] = useState('')

  const onImport = async (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    try {
      const obj = await readJSONFile(f)
      const ok = Array.isArray(obj.trips)
        ? confirm(`This is a full backup with ${obj.trips.length} trip(s). Replace ALL your trips with it?`)
        : confirm(`Import trip "${obj.name || 'Boracay'}"? If you already have this trip, it will be replaced.`)
      if (ok) setMsg('✅ ' + importData(obj))
    } catch (err) { setMsg('⚠️ ' + err.message) }
  }

  return (
    <div className="page">
      <Header title="Data" subtitle="Everything is stored on this device only"
        action={<Link to="/" className="btn">Done</Link>} />
      <section className="card stack">
        <h2>Share this trip</h2>
        <p className="muted small">Sends only <b>{trip.name}</b> — your other trips stay private.</p>
        <button className="btn primary full" onClick={async () => {
          const r = await shareJSON(trip, trip.name)
          setMsg(r === 'shared' ? '✅ Shared' : r === 'downloaded' ? '⬇️ Sharing not supported — file downloaded' : '')
        }}>📤 Share “{trip.name}”</button>
      </section>
      <section className="card stack">
        <h2>Backup</h2>
        <button className="btn full" onClick={() => downloadJSON(root, 'all-trips-backup')}>⬇️ Export all trips</button>
        <button className="btn full" onClick={() => fileRef.current.click()}>⬆️ Import file</button>
        <p className="muted small">A shared trip file adds or updates that one trip. A full backup replaces everything.</p>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
        {msg && <p className="muted">{msg}</p>}
      </section>
      <section className="card stack">
        <h2>Reset “{trip.name}”</h2>
        <button className="btn danger full" onClick={() => confirm(`Delete all plans, bookings and expenses in "${trip.name}"?`) && clearSample()}>
          {trip.sample ? 'Clear sample data' : 'Clear this trip’s data'}
        </button>
        {trip.id === BORACAY_ID && (
          <button className="btn ghost full" onClick={() => confirm('Replace this trip with sample data?') && loadSample()}>Load sample data</button>
        )}
      </section>
    </div>
  )
}
