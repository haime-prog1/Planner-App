// Curated suggestions per destination (researched Nov 2026 from travel guides and review sites).
// Prices are rough per-person estimates and change often — verify locally.
// level: 1 = budget (₱), 2 = mid (₱₱), 3 = splurge (₱₱₱)

const BORACAY_FOOD = [
  { name: 'Jonah’s Fruit Shake', area: 'Station 1', level: 1, price: '₱150–250', what: 'Famous fruit shakes (try mango or chocolate-banana) and simple snacks.' },
  { name: 'Real Coffee & Tea Café', area: 'Station 2', level: 1, price: '₱100–350', what: 'Known for its calamansi muffins — grab a box for the beach.' },
  { name: 'Smoke Resto', area: 'D’Mall, Station 2', level: 1, price: '₱150–350', what: 'Cheap, filling Filipino comfort food — sisig, adobo, bulalo.' },
  { name: 'Andok’s', area: 'Main Road', level: 1, price: '₱99–200', what: 'Lechon manok and liempo meals — one of the cheapest sit-down options.' },
  { name: 'Pares Hilton', area: 'Station 1', level: 1, price: '₱100–200', what: 'Beef pares (braised beef stew with rice) from breakfast to late night.' },
  { name: 'Jasper’s Tapsilog', area: 'Station 2', level: 1, price: '₱120–220', what: 'All-day silog meals — cheap, fast and filling.' },
  { name: 'Street food & carinderias', area: 'Main Road / D’Mall', level: 1, price: '₱50–200', what: 'Chori burger, isaw, halo-halo and turo-turo meals for the tightest budget.' },
  { name: 'D’Talipapa (paluto)', area: 'Station 2', level: 2, price: '₱500–1,000', what: 'Buy seafood at the wet market, have a nearby restaurant cook it. Agree on cooking fees first.' },
  { name: 'Sunny Side Café', area: 'Station 3', level: 2, price: '₱350–700', what: 'Popular all-day breakfast — try the champorado and pancakes.' },
  { name: 'Lemoni Café', area: 'D’Mall, Station 2', level: 2, price: '₱350–700', what: 'Cozy café for breakfast, sandwiches and lemon desserts.' },
  { name: 'Nonie’s', area: 'Station 2', level: 2, price: '₱400–800', what: 'Healthier, modern Filipino dishes made with local produce.' },
  { name: 'Cyma Greek Taverna', area: 'D’Mall, Station 2', level: 2, price: '₱500–900', what: 'Long-time favorite — the flaming saganaki cheese is the classic order.' },
  { name: 'Spider House', area: 'Diniwid Beach', level: 3, price: '₱800–1,500', what: 'Cliffside bar-restaurant built over the rocks — go for sunset drinks and a swim.' },
  { name: 'Dos Mestizos', area: 'Station 2', level: 3, price: '₱800–1,500', what: 'Spanish-Filipino — paella and tapas, good for a date night.' },
  { name: 'Beachfront resort dinner', area: 'Station 1 / Shangri-La area', level: 3, price: '₱1,500+', what: 'Pick a resort restaurant for one special sunset dinner. Book ahead.' }
]

const BORACAY_ACTIVITIES = [
  { name: 'Sunset at White Beach', area: 'Station 1–2', level: 1, price: 'Free', what: 'Watch the paraw boats sail at sunset. Willy’s Rock is a classic photo stop.' },
  { name: 'Puka Shell Beach', area: 'Yapak (north)', level: 1, price: 'Free + ride', what: 'Quieter, wilder beach. Go in the morning; e-trike there.' },
  { name: 'Diniwid Beach walk', area: 'North of Station 1', level: 1, price: 'Free', what: 'Small, calm cove reached by a cliffside path. Ends at Spider House.' },
  { name: 'Mt. Luho viewpoint', area: 'Mt. Luho', level: 1, price: '~₱150 entrance', what: 'Highest point on the island, 360° views.' },
  { name: 'Fire dancers', area: 'Station 2 beachfront', level: 1, price: 'Free (buy a drink)', what: 'Nightly fire shows in front of the beach bars.' },
  { name: 'Paraw sailing', area: 'White Beach', level: 2, price: '~₱1,500–2,500/boat', what: 'Traditional outrigger sail at sunset. Agree on price and duration before boarding.' },
  { name: 'Island hopping + snorkeling', area: 'Crystal Cove, Magic Island', level: 2, price: '~₱800–2,000/pax', what: 'Half- or full-day boat tour. Shared tours are cheaper; private is more flexible.' },
  { name: 'Massage / spa', area: 'Station 2', level: 2, price: '₱500–2,500', what: 'Beach massage is cheapest; a proper spa costs more.' },
  { name: 'Helmet diving', area: 'Off White Beach', level: 2, price: '~₱1,000–1,500/pax', what: 'Walk on the seabed wearing an air helmet — no swimming skills needed.' },
  { name: 'Parasailing', area: 'Off White Beach', level: 2, price: '~₱1,500–2,500/pax', what: 'Tandem flight over the water. Depends on wind and sea conditions.' },
  { name: 'Kitesurfing lesson', area: 'Bulabog Beach', level: 3, price: '₱3,000+', what: 'November is the start of kite season on the windy east side.' },
  { name: 'Ariel’s Point cliff diving', area: 'Off Buruanga (boat trip)', level: 3, price: '~₱3,000+/pax', what: 'Day trip with cliff jumps, kayaking, food and drinks included.' }
]

const BORACAY_SPOTS = [
  { name: 'Ilig-Iligan Beach', area: 'Southeast coast', level: 1, price: 'Free + trike', what: 'Where locals go to escape the crowds. Reach it by tricycle or via the mangrove boardwalk from Bulabog.' },
  { name: 'Lugutan Mangrove Eco Park', area: 'Manoc-Manoc', level: 1, price: '~₱30–50', what: 'Wooden boardwalks through the mangroves — quiet, shady and very local.' },
  { name: 'Keyhole rock, Lapus Lapus Beach', area: 'East side', level: 1, price: 'Free', what: 'Rock formation with a “keyhole” view of the sea. Check the tide — you may need to wade.' },
  { name: 'Slanted coconut tree', area: 'Bulabog Beach', level: 1, price: 'Free', what: 'Local photo spot on the windy kite-surfing side of the island.' },
  { name: 'Bantayan Cliff', area: 'Near Mt. Luho Road', level: 1, price: 'Free', what: 'Inland viewpoint locals use for sunrise and yoga. Not always on maps — ask your trike driver.' },
  { name: 'Tulubhan Beach', area: 'East side', level: 1, price: 'Free', what: 'Fishing boats and village life — the “real” Boracay away from resorts.' },
  { name: 'Tambisaan Beach', area: 'South, Manoc-Manoc', level: 1, price: 'Free', what: 'Calm, shallow water popular with local families.' },
  { name: 'Diniwid Beach', area: 'North of Station 1', level: 1, price: 'Free', what: 'Small cove reached by a cliffside path. Sunset spots: Spider House and Nigi Nigi Nu Noos.' }
]

const GENSAN_FOOD = [
  { name: 'Tiongson Arcade', area: 'City center', level: 1, price: '₱50–200', what: 'Street-side food stalls — the cheapest way to try local dishes.' },
  { name: 'Sinoy’s Balbacua', area: 'General Santos', level: 1, price: '₱100–250', what: 'Balbacua (slow-cooked beef stew) — a local budget favorite.' },
  { name: 'Hinimay', area: 'General Santos', level: 1, price: '₱100–250', what: 'Affordable local meals recommended by travelers.' },
  { name: 'Lumpay’s', area: 'General Santos', level: 1, price: '₱100–250', what: 'Affordable local meals recommended by travelers.' },
  { name: 'Rachel’s Tuna Grill', area: 'Near KCC Mall', level: 2, price: '₱250–600', what: 'The most-recommended tuna spot: grilled tuna belly, tuna kinilaw. Fixed servings, good for solo diners.' },
  { name: 'Kiko’s Family Restaurant', area: 'General Santos', level: 2, price: '₱250–600', what: 'Tuna belly plus local dishes like laing and imbao soup.' },
  { name: 'Sud-an', area: 'General Santos', level: 2, price: '₱300–700', what: 'Tuna and seafood; known for crispy tuna tail.' },
  { name: 'Nikolai Seafoods and Grill', area: 'General Santos', level: 2, price: '₱300–700', what: 'Highly rated for grilled tuna and kinilaw.' },
  { name: 'Abi’s Resto Grill', area: 'General Santos', level: 2, price: '₱300–700', what: 'Seafood grill praised for its tuna.' },
  { name: 'Jam’s Restaurant', area: 'General Santos', level: 3, price: '₱500–1,000', what: 'Trendy spot built around tuna dishes — good for a group dinner after NSTW.' }
]

const GENSAN_SPOTS = [
  { name: 'GenSan Fish Port Complex', area: 'Tambler', level: 1, price: 'Free', what: 'Go at dawn to see giant tuna being landed and auctioned — the city’s signature sight.' },
  { name: 'Plaza Heneral Santos', area: 'City center', level: 1, price: 'Free', what: 'Main plaza, nice for an evening walk.' },
  { name: 'Gumasa Beach', area: 'Glan, Sarangani (~2 hrs)', level: 2, price: 'Transport + fees', what: 'White-sand beach, a popular day trip if you have a free day.' }
]

const TACLOBAN_FOOD = [
  { name: 'Jose Karlo’s Cafe', area: 'Across Sto. Niño Church', level: 1, price: '₱100–300', what: 'Go-to for coffee and pastries.' },
  { name: 'Generation Bread', area: 'Tacloban', level: 1, price: '₱100–300', what: 'Bakery-café on Tripadvisor’s top lists.' },
  { name: 'Raj Burger', area: 'Tacloban', level: 1, price: '₱150–300', what: 'Small spot one reviewer calls the best burger in town (few reviews).' },
  { name: 'The Little Green Kitchen’s Village Chefs', area: 'Tacloban', level: 2, price: '₱250–500', what: 'Hard to find, worth the effort, per reviewers.' },
  { name: 'Sunzibar Cafe', area: 'Tacloban', level: 2, price: '₱250–600', what: 'Mexican-inspired food; reviewers like the grilled pork chop.' },
  { name: 'Chew Love', area: 'Tacloban', level: 2, price: '₱300–700', what: 'One of Tacloban’s best-known restaurants.' },
  { name: 'Dream Cafe', area: 'Tacloban', level: 2, price: '₱300–700', what: 'Café on Tripadvisor’s top-10.' },
  { name: 'Ocho Seafood and Grill', area: 'Tacloban', level: 3, price: '₱500–1,000', what: 'Popular seafood chain — choose your seafood and how it’s cooked.' },
  { name: 'La Maison Punjab', area: 'Tacloban', level: 3, price: '₱500–1,000', what: 'Indian-French fusion, highly rated (few reviews).' }
]

const TACLOBAN_SPOTS = [
  { name: 'San Juanico Bridge', area: 'Tacloban–Samar', level: 1, price: 'Free', what: 'The country’s longest bridge — go at sunset for the view.' },
  { name: 'Sto. Niño Shrine & Heritage Museum', area: 'Tacloban', level: 1, price: 'Small fee', what: 'Former Marcos residence with themed rooms.' },
  { name: 'MacArthur Landing Memorial', area: 'Palo (~20 min)', level: 1, price: 'Free', what: 'WWII landing site with larger-than-life statues by the sea.' }
]

export const GUIDES = [
  { id: 'boracay', city: 'Boracay', match: /boracay|malay|caticlan/i, food: BORACAY_FOOD, spots: BORACAY_SPOTS, activities: BORACAY_ACTIVITIES },
  { id: 'gensan', city: 'General Santos City', match: /general santos|gensan/i, food: GENSAN_FOOD, spots: GENSAN_SPOTS, activities: [] },
  { id: 'tacloban', city: 'Tacloban City', match: /tacloban|leyte/i, food: TACLOBAN_FOOD, spots: TACLOBAN_SPOTS, activities: [] }
]

export const guideFor = (trip) => GUIDES.find((g) => g.match.test(`${trip.destination} ${trip.name}`)) || null

export const mapsUrl = (q) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`
