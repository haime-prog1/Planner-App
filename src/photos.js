// Menu photos the user takes, stored on this device in IndexedDB (localStorage is too small for images).
const DB = 'trip-photos', STORE = 'photos'

function db() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: 'id' }).createIndex('place', 'place')
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

const tx = async (mode, fn) => {
  const d = await db()
  return new Promise((resolve, reject) => {
    const t = d.transaction(STORE, mode)
    const out = fn(t.objectStore(STORE))
    t.oncomplete = () => resolve(out?.result ?? out)
    t.onerror = () => reject(t.error)
  })
}

export const listPhotos = (place) => tx('readonly', (s) => s.index('place').getAll(place))
export const deletePhoto = (id) => tx('readwrite', (s) => s.delete(id))

/** Shrink a photo to max 1280px JPEG so many fit on the phone */
function compress(file, max = 1280) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      URL.revokeObjectURL(img.src)
      c.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not read photo'))), 'image/jpeg', 0.75)
    }
    img.onerror = () => reject(new Error('Could not read photo'))
    img.src = URL.createObjectURL(file)
  })
}

export async function addPhotos(place, files) {
  for (const f of files) {
    const blob = await compress(f)
    await tx('readwrite', (s) => s.put({ id: `${place}:${Date.now()}:${Math.random().toString(36).slice(2, 6)}`, place, blob, added: Date.now() }))
  }
}
