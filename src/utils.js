export const TRIP = {
  travelers: ['James', 'Sheerah'],
  start: '2026-11-13',
  end: '2026-11-17',
  budget: 20000,
  days: 5
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36)

export const peso = (n) =>
  '₱' + (Number(n) || 0).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 2 })

/** Day number (1–5) → ISO date string */
export const dayDate = (day) => {
  const d = new Date(TRIP.start + 'T00:00:00')
  d.setDate(d.getDate() + day - 1)
  const pad = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

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
const fileName = () => `boracay-trip-${new Date().toISOString().slice(0, 10)}.json`

export function downloadJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName()
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export async function shareJSON(data) {
  const json = JSON.stringify(data, null, 2)
  const file = new File([json], fileName(), { type: 'application/json' })
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({ files: [file], title: 'Boracay trip data', text: 'Our Boracay trip plan' })
      return 'shared'
    } catch (e) {
      if (e.name === 'AbortError') return 'cancelled'
    }
  }
  downloadJSON(data)
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
