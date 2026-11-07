// Simple line icons in an iOS-like style (drawn for this app)
const P = {
  home: <><path d="M3.5 10.5 12 3.5l8.5 7" /><path d="M5.5 9v11h4.5v-6h4v6h4.5V9" /></>,
  plan: <><rect x="3.5" y="5" width="17" height="15.5" rx="3" /><path d="M3.5 10h17M8 3v4M16 3v4" /><circle cx="8.5" cy="14.5" r=".9" fill="currentColor" /><circle cx="12" cy="14.5" r=".9" fill="currentColor" /><circle cx="15.5" cy="14.5" r=".9" fill="currentColor" /></>,
  travel: <path d="M10.2 20.5 11.8 14 6 13.2 4.2 15.5H2.8l1-4-1-4h1.4L6 9.8l5.8-.8-1.6-6.5h2l4.3 6.2 4.2-.4c1.3-.1 2.3.7 2.3 1.7s-1 1.8-2.3 1.7l-4.2-.4-4.3 6.2z" />,
  stay: <><path d="M3 19.5V6M3 15h18v4.5M21 15v-2.5a3 3 0 0 0-3-3h-7.5V15" /><circle cx="7" cy="11.5" r="2" /></>,
  money: <><rect x="2.5" y="6" width="19" height="13" rx="3" /><path d="M2.5 10.5h19" /><path d="M16 15h2.5" /></>,
  lists: <><path d="M9.5 6.5h11M9.5 12h11M9.5 17.5h11" /><path d="m3.5 6.5 1.3 1.3 2.2-2.6M3.5 12l1.3 1.3 2.2-2.6M3.5 17.5l1.3 1.3 2.2-2.6" /></>,
  gear: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1h-.2a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5v-.2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
  chevron: <path d="m9 5 7 7-7 7" />
}

export default function Icon({ name, size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{P[name]}</svg>
  )
}
