# Trip Planner 🌴

Mobile-first PWA for planning work and vacation trips — itinerary, flights, stays, expenses and checklists.
Vite + React, localStorage only, works offline and installs to your home screen.

## Structure
```
src/
  main.jsx, App.jsx        HashRouter + bottom tab bar
  store.jsx                state + localStorage persistence
  sample.js                sample Boracay data / empty data
  utils.js                 trip constants, ₱ formatting, dates, export/share/import
  components/Form.jsx      generic modal form used for all add/edit/delete
  pages/                   Dashboard, Itinerary, Travel, Stay, Expenses, Lists, Settings (data)
.github/workflows/deploy.yml  builds and deploys to GitHub Pages on push to main
```

## Develop
```
npm install
npm run dev
npm run build && npm run preview
```

Data tools (export / import / share JSON, clear or reload sample data) are behind the ⚙️ on the Home screen.
If the repo is renamed, update `base` in `vite.config.js`.
