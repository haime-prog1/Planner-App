import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fmtDate, tripDays } from '../utils'

// Open-Meteo is free and needs no API key
const forecastUrl = (lat, lon) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max' +
  '&timezone=Asia%2FManila&forecast_days=16'
const geoUrl = (q) => `https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&country=PH&name=${encodeURIComponent(q)}`
const cacheKey = (id) => 'weather-' + id

/** Find coordinates for a destination like "Tacloban City, Leyte": try the full text, then each part */
async function locate(destination) {
  const parts = destination.split(',').map((s) => s.trim().replace(/ City$/i, '')).filter(Boolean)
  for (const q of [destination, ...parts]) {
    const r = await fetch(geoUrl(q)).then((x) => x.json()).catch(() => null)
    if (r?.results?.[0]) return { lat: r.results[0].latitude, lon: r.results[0].longitude }
  }
  return null
}

const icon = (c) =>
  c === 0 ? ['☀️', 'Clear'] : c <= 2 ? ['🌤️', 'Partly cloudy'] : c === 3 ? ['☁️', 'Cloudy'] : c <= 48 ? ['🌫️', 'Fog']
    : c <= 57 ? ['🌦️', 'Drizzle'] : c <= 67 ? ['🌧️', 'Rain'] : c <= 82 ? ['🌦️', 'Showers'] : c >= 95 ? ['⛈️', 'Thunderstorm'] : ['🌧️', 'Rain']

function readCache(id) {
  try { return JSON.parse(localStorage.getItem(cacheKey(id))) } catch { return null }
}

export default function Weather({ trip }) {
  const { updateTrip } = useStore()
  const [w, setW] = useState(() => readCache(trip.id))
  const [err, setErr] = useState(false)

  useEffect(() => {
    let alive = true
    setW(readCache(trip.id)); setErr(false)
    ;(async () => {
      let { lat, lon } = trip
      if (lat == null) {
        const loc = await locate(trip.destination)
        if (!loc) throw new Error('not found')
        ;({ lat, lon } = loc)
        updateTrip(trip.id, loc)
      }
      return fetch(forecastUrl(lat, lon))
    })()
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        const d = j.daily
        const days = d.time.map((date, i) => ({
          date, code: d.weather_code[i], max: d.temperature_2m_max[i], min: d.temperature_2m_min[i],
          rain: d.precipitation_probability_max[i], wind: d.wind_speed_10m_max[i]
        }))
        const v = { days, fetched: new Date().toISOString() }
        if (!alive) return
        setW(v)
        try { localStorage.setItem(cacheKey(trip.id), JSON.stringify(v)) } catch { /* ignore */ }
      })
      .catch(() => alive && setErr(true))
    return () => { alive = false }
  }, [trip.id, trip.lat, trip.destination]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!w) return (
    <section className="card"><h2>Weather</h2>
      <p className="muted">{err ? 'Can’t load the forecast right now (offline?).' : 'Loading forecast…'}</p>
    </section>
  )

  // Prefer the trip dates; until they're in range, show the next 5 days
  const inTrip = w.days.filter((d) => d.date >= trip.start && d.date <= trip.end)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
  const shown = inTrip.length ? inTrip : w.days.filter((d) => d.date >= today).slice(0, 5)

  return (
    <section className="card">
      <div className="row-between">
        <h2>{inTrip.length ? 'Trip weather' : `Weather now · ${trip.destination.split(',')[0]}`}</h2>
        <span className="muted small">{err ? 'offline · ' : ''}updated {fmtDate(w.fetched, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
      </div>
      {inTrip.length > 0 && inTrip.length < tripDays(trip) && (
        <p className="muted small">More trip days appear as the forecast reaches them.</p>
      )}
      <div className="weather">
        {shown.map((d) => {
          const [ic, label] = icon(d.code)
          return (
            <div key={d.date} className="wx-day" title={label}>
              <span className="muted small">{fmtDate(d.date, { weekday: 'short' })}<br />{fmtDate(d.date, { month: 'short', day: 'numeric' })}</span>
              <span className="wx-icon" aria-label={label}>{ic}</span>
              <b>{Math.round(d.max)}°</b>
              <span className="muted small">{Math.round(d.min)}°</span>
              <span className={'small' + (d.rain >= 60 ? ' neg' : '')}>💧{d.rain ?? 0}%</span>
              <span className="muted small">💨{Math.round(d.wind)}</span>
            </div>
          )
        })}
      </div>
      {shown.some((d) => d.rain >= 60 || d.wind >= 35) && (
        <p className="settle small">⚠️ Rain or strong wind expected on some days — bring an umbrella and keep plans flexible. Boat trips can be cancelled in rough seas.</p>
      )}
    </section>
  )
}
