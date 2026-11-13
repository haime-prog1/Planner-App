import { useEffect, useRef, useState } from 'react'
import { listPhotos, addPhotos, deletePhoto } from '../photos'

/** Thumbnails of the user's own menu photos for one place, with add / view / delete */
export default function MenuPhotos({ place }) {
  const [photos, setPhotos] = useState([])
  const [view, setView] = useState(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef()

  const load = () => listPhotos(place)
    .then((list) => setPhotos(list.map((p) => ({ ...p, url: URL.createObjectURL(p.blob) }))))
    .catch(() => setPhotos([]))
  useEffect(() => { load() }, [place]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => photos.forEach((p) => URL.revokeObjectURL(p.url)), [photos])

  const onPick = async (e) => {
    const files = [...e.target.files]; e.target.value = ''
    if (!files.length) return
    setBusy(true)
    try { await addPhotos(place, files); await load() } catch (err) { alert(err.message) }
    setBusy(false)
  }

  return (
    <>
      {photos.length > 0 && (
        <div className="thumbs">
          {photos.map((p) => <img key={p.id} src={p.url} alt="Menu" onClick={() => setView(p)} />)}
        </div>
      )}
      <button className="btn sm" onClick={() => fileRef.current.click()} disabled={busy}>
        {busy ? 'Saving…' : photos.length ? '📷 Add more' : '📷 My menu photo'}
      </button>
      <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={onPick} />
      {view && (
        <div className="viewer" onClick={() => setView(null)}>
          <img src={view.url} alt="Menu" />
          <div className="viewer-bar" onClick={(e) => e.stopPropagation()}>
            <button className="btn danger" onClick={async () => {
              if (confirm('Delete this photo?')) { await deletePhoto(view.id); setView(null); load() }
            }}>Delete</button>
            <button className="btn primary" onClick={() => setView(null)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}
