export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

export const peso = (n) =>
  '₱' + (Number(n) || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

/** Day number (1–5) → ISO date string */
const pad = (n) => String(n).padStart(2, '0')
const isoLocal = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

/** Number of days in a trip (inclusive) */
export const tripDays = (trip) =>
  Math.max(1, Math.round((new Date(trip.end + 'T00:00:00') - new Date(trip.start + 'T00:00:00')) / 864e5) + 1)

/** Day number (1..n) of a trip → ISO date string */
export const dayDate = (trip, day) => {
  const d = new Date(trip.start + 'T00:00:00')
  d.setDate(d.getDate() + day - 1)
  return isoLocal(d)
}

/** 'upcoming' | 'ongoing' | 'done' */
export const tripStatus = (trip, now = new Date()) =>
  now < new Date(trip.start + 'T00:00:00') ? 'upcoming' : now > new Date(trip.end + 'T23:59:59') ? 'done' : 'ongoing'

export const fmtRange = (trip) =>
  `${fmtDate(trip.start, { month: 'short', day: 'numeric' })} – ${fmtDate(trip.end, { month: 'short', day: 'numeric', year: 'numeric' })}`

export const spentOf = (trip) => (trip.expenses || []).reduce((s, e) => s + (Number(e.amount) || 0), 0)

export const fmtDate = (iso, opts = { weekday: 'short', month: 'short', day: 'numeric' }) =>
  iso ? new Date(iso.length <= 10 ? iso + 'T00:00:00' : iso).toLocaleDateString('en-US', opts) : ''

export const fmtDateTime = (iso) =>
  iso ? new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : ''

export const fmtTime = (t) => {
  if (!t) return ''
  const [h, m] = t.split(':').map(Number)
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`
}

// ---------- data export / import / share ----------
const fileName = (name = 'trips') => `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${new Date().toISOString().slice(0, 10)}.json`

export function downloadJSON(data, name) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName(name)
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function shareJSON(data, name) {
  const json = JSON.stringify(data, null, 2)
  const file = new File([json], fileName(name), { type: 'application/json' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: name || 'Trip data', text: 'Trip plan' })
      return 'shared'
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled'
    }
  }
  downloadJSON(data, name)
  return 'downloaded'
}

export function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => {
      try { resolve(JSON.parse(r.result)) } catch (e) { reject(new Error('Not a valid JSON file')) }
    }
    r.onerror = () => reject(r.error)
    r.readAsText(file)
  })
}
