import { useState } from 'react'

const OTHER = '__other__'

/** Dropdown of presets plus "Other…", which reveals a text box for anything not in the list */
function Combo({ value, options, onChange, required, placeholder }) {
  const known = options.includes(value)
  const [custom, setCustom] = useState(!!value && !known)
  return (
    <>
      <select value={custom ? OTHER : value} required={required && !custom}
        onChange={(e) => {
          if (e.target.value === OTHER) { setCustom(true); onChange('') } else { setCustom(false); onChange(e.target.value) }
        }}>
        <option value="">Choose…</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
        <option value={OTHER}>Other…</option>
      </select>
      {custom && (
        <input autoFocus value={value} required={required} placeholder={placeholder || 'Type here'} onChange={(e) => onChange(e.target.value)} />
      )}
    </>
  )
}

/**
 * Field-driven modal form.
 * fields: [{ name, label, type: text|number|date|time|datetime-local|select|textarea, options, required, placeholder }]
 */
export default function FormModal({ title, fields, initial = {}, onSave, onClose, onDelete }) {
  const [v, setV] = useState(() => Object.fromEntries(fields.map((f) => [f.name, initial[f.name] ?? f.default ?? ''])))
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const out = { ...v }
    fields.forEach((f) => { if (f.type === 'number' && out[f.name] !== '') out[f.name] = Number(out[f.name]) })
    onSave(out)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <div className="grabber" />
        <div className="modal-head">
          <button type="button" className="link-btn" onClick={onClose}>Cancel</button>
          <h2>{title}</h2>
          <button type="submit" className="link-btn bold">Save</button>
        </div>
        <div className="modal-body">
          {fields.map((f) => (
            <label key={f.name} className="field">
              <span>{f.label}{f.required && ' *'}</span>
              {f.type === 'combo' ? (
                <Combo value={v[f.name]} options={f.options} required={f.required} placeholder={f.placeholder}
                  onChange={(val) => setV((cur) => ({ ...cur, [f.name]: val }))} />
              ) : f.type === 'select' ? (
                <select value={v[f.name]} onChange={set(f.name)} required={f.required}>
                  {f.options.map((o) => {
                    const [val, lab] = Array.isArray(o) ? o : [o, o]
                    return <option key={val} value={val}>{lab}</option>
                  })}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea rows={3} value={v[f.name]} onChange={set(f.name)} placeholder={f.placeholder} />
              ) : (
                <input
                  type={f.type || 'text'} value={v[f.name]} onChange={set(f.name)}
                  required={f.required} placeholder={f.placeholder}
                  inputMode={f.type === 'number' ? 'decimal' : undefined}
                  step={f.type === 'number' ? 'any' : undefined}
                />
              )}
            </label>
          ))}
          {onDelete && (
            <button type="button" className="btn danger full delete-row"
              onClick={() => { if (confirm('Delete this item?')) { onDelete(); onClose() } }}>Delete</button>
          )}
        </div>
      </form>
    </div>
  )
}

/** Hook for managing which item is being edited: null = closed, {} = new, item = edit */
export function useEditor() {
  const [editing, setEditing] = useState(null)
  return { editing, openNew: (defaults = {}) => setEditing({ __new: true, ...defaults }), openEdit: setEditing, close: () => setEditing(null) }
}
