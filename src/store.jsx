import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { sampleData, emptyData } from './sample'
import { uid } from './utils'

const KEY = 'boracay-trip-v1'
const Ctx = createContext(null)

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...emptyData(), ...JSON.parse(raw) }
  } catch { /* ignore */ }
  return sampleData()
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(data)) } catch { /* quota */ }
  }, [data])

  // Generic list helpers keyed by collection name
  const add = useCallback((col, item) =>
    setData((d) => ({ ...d, [col]: [...d[col], { ...item, id: uid() }] })), [])
  const update = useCallback((col, id, patch) =>
    setData((d) => ({ ...d, [col]: d[col].map((x) => (x.id === id ? { ...x, ...patch } : x)) })), [])
  const remove = useCallback((col, id) =>
    setData((d) => ({ ...d, [col]: d[col].filter((x) => x.id !== id) })), [])
  const replaceList = useCallback((col, list) => setData((d) => ({ ...d, [col]: list })), [])

  const clearSample = () => setData(emptyData())
  const loadSample = () => setData(sampleData())
  const importData = (obj) => {
    if (!obj || typeof obj !== 'object' || !Array.isArray(obj.itinerary)) throw new Error('This file is not trip data')
    setData({ ...emptyData(), ...obj })
  }

  return (
    <Ctx.Provider value={{ data, add, update, remove, replaceList, clearSample, loadSample, importData }}>
      {children}
    </Ctx.Provider>
  )
}

export const useStore = () => useContext(Ctx)
