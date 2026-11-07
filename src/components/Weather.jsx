import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { fmtDate, tripDays } from '../utils'

// Open-Meteo is free and needs no API key
const forecastUrl = (lat, lon) => `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
  '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max' +
  '&timezone=Asia%2FManila&forecast_days=16'
const geoUrl = (q) => `https://geocoding-api.open-meteo.com/v1/search?count=1&language=en&countryCode=PH&name=${encodeURIComponent(q)}`
const cacheKey = (id) => 'weather-' + id

// Built-in coordinates so common Philippine destinations work without a lookup
const PLACES = [
  [/tacloban|leyte/i, 11.2443, 125.0039],
  [/general santos|gensan|south cotabato/i, 6.1164, 125.1716],
  [/boracay|malay|caticlan/i, 11.9674, 121.9248],
  [/kalibo|aklan/i, 11.7064, 122.3645],
  [/ormoc/i, 11.0064, 124.6075],
  [/manila|makati|pasay|quezon city|taguig|metro manila|ncr/i, 14.5995, 120.9842],
  [/cebu|mactan|lapu/i, 10.3157, 123.8854],
  [/davao/i, 7.1907, 125.4553],
  [/iloilo/i, 10.7202, 122.5621],
  [/bacolod|negros occidental/i, 10.6765, 122.9509],
  [/baguio|benguet/i, 16.4023, 120.596],
  [/puerto princesa/i, 9.7392, 118.7353],
  [/el nido|coron|palawan/i, 11.1956, 119.4074],
  [/bohol|tagbilaran|panglao/i, 9.6417, 123.8547],
  [/siargao|general luna/i, 9.7878, 126.1626],
  [/cagayan de oro|misamis oriental/i, 8.4542, 124.6319],
  [/zamboanga/i, 6.9214, 122.079],
  [/clark|angeles|pampanga/i, 15.145, 120.5887],
  [/tagaytay|cavite/i, 14.1153, 120.9621],
  [/vigan|ilocos sur/i, 17.5747, 120.3869],
  [/laoag|ilocos norte/i, 18.1978, 120.5936],
  [/legazpi|albay/i, 13.1391, 123.7438],
  [/naga|camarines sur/i, 13.6218, 123.1948],
  [/dumaguete|negros oriental/i, 9.3068, 123.3054],
  [/butuan/i, 8.9475, 125.5406],
  [/surigao/i, 9.7838, 125.4888],
  [/cotabato/i, 7.2236, 124.2464],
  [/koronadal/i, 6.5008, 124.8469],
  [/samar|catbalogan/i, 11.7753, 124.8861],
  [/borongan/i, 11.6081, 125.4319]
]

/** Find coordinates: built-in list first, then an online lookup of the full text and each part */
async function locate(destination) {
  const hit = PLACES.find(([re]) => re.test(destination))
  if (hit) return { lat: hit[1], lon: hit[2] }
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
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let alive = true
    setW(readCache(trip.id)); setErr(false); setNotFound(false)
    ;(async () => {
      let { lat, lon } = trip
      if (lat == null) {
        const loc = await locate(trip.destination)
        if (!loc) { if (alive) setNotFound(true); throw new Error('not found') }
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
      <p className="muted">{notFound ? `Can’t find “${trip.destination}”. Edit the trip and use a city name, e.g. “Tacloban City, Leyte”.` : err ? 'Can’t load the forecast right now (offline?).' : 'Loading forecast…'}</p>
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
