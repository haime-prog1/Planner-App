import { uid } from './utils'

const it = (day, time, activity, location, notes = '', status = 'planned') =>
  ({ id: uid(), day, time, activity, location, notes, status })

export const emptyData = () => ({
  version: 1,
  sample: false,
  itinerary: [], flights: [], transfers: [], stays: [], expenses: [], packing: [], todos: []
})

export const sampleData = () => ({
  version: 1,
  sample: true,
  itinerary: [
    it(1, '05:30', 'Flight MNL → MPH', 'NAIA Terminal 3', 'Be at airport by 4:00 AM', 'booked'),
    it(1, '08:00', 'Van + boat to Station 2', 'Caticlan jetty → Cagban', 'Bring environmental fee receipt'),
    it(1, '14:00', 'Hotel check-in', 'Station 2'),
    it(1, '17:30', 'Sunset at White Beach', 'Station 1', 'Willy’s Rock photos'),
    it(2, '09:00', 'Island hopping tour', 'Bulabog / Crystal Cove', 'Includes lunch & snorkel gear', 'booked'),
    it(2, '19:00', 'Dinner at D’Talipapa', 'D’Mall area', 'Pick seafood at the wet market, paluto'),
    it(3, '07:00', 'Puka Shell Beach morning', 'Yapak', 'Quieter in the morning'),
    it(3, '15:00', 'Paraw sailing at sunset', 'Station 2', 'Haggle ~₱1,500–2,000'),
    it(4, '10:00', 'Mt. Luho viewpoint', 'Mt. Luho', 'Take a tricycle/e-trike'),
    it(4, '13:00', 'Spa massage', 'Station 2'),
    it(4, '18:00', 'Fire dancers + dinner', 'Station 2 beachfront'),
    it(5, '08:00', 'Breakfast + pack', 'Hotel'),
    it(5, '11:00', 'Check-out, boat to Caticlan', 'Cagban port'),
    it(5, '15:00', 'Flight MPH → MNL', 'Caticlan Airport', '', 'booked')
  ],
  flights: [
    { id: uid(), direction: 'Outbound', airline: 'Cebu Pacific', flightNo: '5J 895', bookingRef: 'ABC123', from: 'MNL', to: 'MPH (Caticlan)', depart: '2026-11-13T05:30', arrive: '2026-11-13T06:40', baggage: '20kg checked (shared)', notes: 'Web check-in 48h before' },
    { id: uid(), direction: 'Return', airline: 'Cebu Pacific', flightNo: '5J 900', bookingRef: 'ABC123', from: 'MPH (Caticlan)', to: 'MNL', depart: '2026-11-17T15:00', arrive: '2026-11-17T16:10', baggage: '20kg checked (shared)', notes: '' }
  ],
  transfers: [
    { id: uid(), leg: 'Airport → Caticlan jetty', mode: 'Tricycle', time: '2026-11-13T07:00', provider: '', bookingRef: '', cost: 150, notes: '~5 min ride' },
    { id: uid(), leg: 'Caticlan jetty → Cagban', mode: 'Boat', time: '2026-11-13T07:30', provider: 'Jetty port', bookingRef: '', cost: 600, notes: 'Terminal + environmental fee + boat (for 2)' },
    { id: uid(), leg: 'Cagban → Hotel', mode: 'E-trike', time: '2026-11-13T08:00', provider: '', bookingRef: '', cost: 200, notes: '' },
    { id: uid(), leg: 'Hotel → Cagban → Caticlan', mode: 'E-trike + Boat', time: '2026-11-17T11:00', provider: '', bookingRef: '', cost: 500, notes: 'Return leg' }
  ],
  stays: [
    { id: uid(), name: 'Sample Beach Resort', address: 'Station 2, Balabag, Boracay, Malay, Aklan', checkIn: '2026-11-13T14:00', checkOut: '2026-11-17T11:00', bookingRef: 'HTL-7788', contact: '+63 900 000 0000', roomType: 'Deluxe Double', total: 9000, paid: 4500, notes: 'Pay balance at front desk' }
  ],
  expenses: [
    { id: uid(), date: '2026-09-01', category: 'flights', description: 'Round-trip flights x2', amount: 6200, paidBy: 'James', foreignAmount: '', foreignCurrency: '', notes: '' },
    { id: uid(), date: '2026-09-05', category: 'hotel', description: 'Hotel deposit', amount: 4500, paidBy: 'Sheerah', foreignAmount: '', foreignCurrency: '', notes: '50% downpayment' },
    { id: uid(), date: '2026-10-10', category: 'activities', description: 'Island hopping tour', amount: 1800, paidBy: 'Sheerah', foreignAmount: '', foreignCurrency: '', notes: '' }
  ],
  packing: ['Swimwear', 'Sunscreen (reef-safe)', 'Sunglasses & hat', 'Dry bag', 'Phone waterproof pouch', 'Slippers', 'Power bank', 'IDs', 'Medicines', 'Light clothes']
    .map((text) => ({ id: uid(), text, done: false })),
  todos: ['Web check-in for flights', 'Print/save booking confirmations', 'Withdraw cash (ATMs can be busy)', 'Register for Boracay QR / requirements', 'Book island hopping', 'Tell bank about travel']
    .map((text) => ({ id: uid(), text, done: false }))
})
