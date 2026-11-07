import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { sampleBoracay, emptyCollections, boracayMeta, BORACAY_ID, COLLECTIONS, starterLists } from './sample'
import { uid } from './utils'

const KEY = 'trips-v2'
const OLD_KEY = 'boracay-trip-v1'
const Ctx = createContext(null)

/** A single-trip object from v1 (no trip fields) → v2 trip */
const fromV1 = (obj) => ({ ...boracayMeta(), ...emptyCollections(), ...obj, id: obj.id || BORACAY_ID })

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw)
    const old = localStorage.getItem(OLD_KEY) // migrate the original Boracay-only data
    if (old) return { version: 2, activeId: BORACAY_ID, trips: [fromV1(JSON.parse(old))] }
  } catch { /* ignore */ }
  return { version: 2, activeId: BORACAY_ID, trips: [sampleBoracay()] }
}

export function StoreProvider({ children }) {
  const [root, setRoot] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(root)) } catch { /* quota */ }
  }, [root])

  const trip = root.trips.find((t) => t.id === root.activeId) || root.trips[0] || null

  // Update the active trip
  const patchActive = useCallback((fn) => setRoot((r) => {
    const id = r.trips.some((t) => t.id === r.activeId) ? r.activeId : r.trips[0]?.id
    return { ...r, trips: r.trips.map((t) => (t.id === id ? fn(t) : t)) }
  }), [])

  // Collection helpers (act on the active trip)
  const add = useCallback((col, item) => patchActive((t) => ({ ...t, [col]: [...(t[col] || []), { ...item, id: uid() }] })), [patchActive])
  const update = useCallback((col, id, patch) => patchActive((t) => ({ ...t, [col]: t[col].map((x) => (x.id === id ? { ...x, ...patch } : x)) })), [patchActive])
  const remove = useCallback((col, id) => patchActive((t) => ({ ...t, [col]: t[col].filter((x) => x.id !== id) })), [patchActive])
  const replaceList = useCallback((col, list) => patchActive((t) => ({ ...t, [col]: list })), [patchActive])

  const clearSample = () => patchActive((t) => ({ ...t, ...emptyCollections(), sample: false }))
  const loadSample = () => patchActive((t) => (t.id === BORACAY_ID ? sampleBoracay() : t))

  // Trips
  const setActive = (id) => setRoot((r) => ({ ...r, activeId: id }))
  const addTrip = (meta) => {
    const t = { ...emptyCollections(), ...starterLists(meta.type), ...meta, id: uid(), sample: false }
    setRoot((r) => ({ ...r, trips: [...r.trips, t], activeId: t.id }))
    return t.id
  }
  const updateTrip = (id, patch) => setRoot((r) => ({ ...r, trips: r.trips.map((t) => (t.id === id ? { ...t, ...patch } : t)) }))
  const removeTrip = (id) => setRoot((r) => {
    const trips = r.trips.filter((t) => t.id !== id)
    return { ...r, trips, activeId: r.activeId === id ? trips[0]?.id : r.activeId }
  })

  /**
   * Import:
   *  - full backup ({ trips: [...] }) → replaces everything
   *  - single trip (v2 with id, or old v1 file) → adds it, or replaces the trip with the same id
   * Returns a message.
   */
  const importData = (obj) => {
    if (!obj || typeof obj !== 'object') throw new Error('This file is not trip data')
    if (Array.isArray(obj.trips)) {
      setRoot({ version: 2, activeId: obj.activeId || obj.trips[0]?.id, trips: obj.trips })
      return `Restored ${obj.trips.length} trip(s)`
    }
    if (!Array.isArray(obj.itinerary)) throw new Error('This file is not trip data')
    const t = obj.start ? { ...emptyCollections(), ...obj, id: obj.id || uid() } : fromV1(obj)
    COLLECTIONS.forEach((c) => { if (!Array.isArray(t[c])) t[c] = [] })
    setRoot((r) => {
      const exists = r.trips.some((x) => x.id === t.id)
      return { ...r, activeId: t.id, trips: exists ? r.trips.map((x) => (x.id === t.id ? t : x)) : [...r.trips, t] }
    })
    return `Imported trip: ${t.name}`
  }

  return (
    <Ctx.Provider value={{
      root, trip, data: trip, add, update, remove, replaceList, clearSample, loadSample, importData,
      setActive, addTrip, updateTrip, removeTrip
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useStore = () => useContext(Ctx)
