import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store'
import Header from '../components/Header'
import { downloadJSON, shareJSON, readJSONFile } from '../utils'

export default function Settings() {
  const { data, importData, clearSample, loadSample } = useStore()
  const fileRef = useRef()
  const [msg, setMsg] = useState('')

  const onImport = async (e) => {
    const f = e.target.files[0]
    e.target.value = ''
    if (!f) return
    try {
      const obj = await readJSONFile(f)
      if (confirm('Replace all current data with this file?')) { importData(obj); setMsg('✅ Data imported') }
    } catch (err) { setMsg('⚠️ ' + err.message) }
  }

  return (
    <div className="page">
      <Header title="Data" subtitle="Everything is stored on this device only"
        action={<Link to="/" className="btn">Done</Link>} />
      <section className="card stack">
        <h2>Share & backup</h2>
        <button className="btn primary full" onClick={async () => {
          const r = await shareJSON(data)
          setMsg(r === 'shared' ? '✅ Shared' : r === 'downloaded' ? '⬇️ Sharing not supported — file downloaded' : '')
        }}>📤 Share trip data</button>
        <button className="btn full" onClick={() => downloadJSON(data)}>⬇️ Export JSON</button>
        <button className="btn full" onClick={() => fileRef.current.click()}>⬆️ Import JSON</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={onImport} />
        {msg && <p className="muted">{msg}</p>}
      </section>
      <section className="card stack">
        <h2>Reset</h2>
        <button className="btn danger full" onClick={() => confirm('Delete ALL data and start empty?') && clearSample()}>
          {data.sample ? 'Clear sample data' : 'Clear all data'}
        </button>
        <button className="btn ghost full" onClick={() => confirm('Replace everything with sample data?') && loadSample()}>Load sample data</button>
      </section>
    </div>
  )
}
