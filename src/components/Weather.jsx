import { useEffect, useState } from 'react'
import { TRIP, fmtDate } from '../utils'

// Boracay (Station 2) — Open-Meteo is free and needs no API key
const URL = 'https://api.open-meteo.com/v1/forecast?latitude=11.9674&longitude=121.9248' +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max' +
  '&timezone=Asia%2FManila&forecast_days=16'
const CACHE = 'boracay-weather-v1'

const icon = (c) =>
  c === 0 ? ['☀️', 'Clear'] : c <= 2 ? ['🌤️', 'Partly cloudy'] : c === 3 ? ['☁️', 'Cloudy'] : c <= 48 ? ['🌫️', 'Fog']
    : c <= 57 ? ['🌦️', 'Drizzle'] : c <= 67 ? ['🌧️', 'Rain'] : c <= 82 ? ['🌦️', 'Showers'] : c >= 95 ? ['⛈️', 'Thunderstorm'] : ['🌧️', 'Rain']

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE)) } catch { return null }
}

export default function Weather() {
  const [w, setW] = useState(readCache)
  const [err, setErr] = useState(false)

  useEffect(() => {
    fetch(URL)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((j) => {
        const d = j.daily
        const days = d.time.map((date, i) => ({
          date, code: d.weather_code[i], max: d.temperature_2m_max[i], min: d.temperature_2m_min[i],
          rain: d.precipitation_probability_max[i], wind: d.wind_speed_10m_max[i]
        }))
        const v = { days, fetched: new Date().toISOString() }
        setW(v)
        try { localStorage.setItem(CACHE, JSON.stringify(v)) } catch { /* ignore */ }
      })
      .catch(() => setErr(true))
  }, [])

  if (!w) return (
    <section className="card"><h2>Boracay weather</h2>
      <p className="muted">{err ? 'Can’t load the forecast right now (offline?).' : 'Loading forecast…'}</p>
    </section>
  )

  // Prefer the trip dates; until they're in range, show the next 5 days
  const tripDays = w.days.filter((d) => d.date >= TRIP.start && d.date <= TRIP.end)
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Manila' })
  const shown = tripDays.length ? tripDays : w.days.filter((d) => d.date >= today).slice(0, 5)

  return (
    <section className="card">
      <div className="row-between">
        <h2>{tripDays.length ? 'Trip weather' : 'Boracay weather now'}</h2>
        <span className="muted small">{err ? 'offline · ' : ''}updated {fmtDate(w.fetched, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</span>
      </div>
      {tripDays.length > 0 && tripDays.length < TRIP.days && (
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
        <p className="settle small">⚠️ Rain or strong wind expected on some days — keep beach activities flexible. Island hopping and paraw trips can be cancelled in rough seas.</p>
      )}
    </section>
  )
}
