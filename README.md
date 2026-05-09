# Astraeus Sky 🛰️

A real-time satellite tracking web app built with React and Express, powered by the [N2YO API](https://www.n2yo.com/api/). See what's orbiting above you, live.

![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## Live Demo:
 **[astraeus-sky.vercel.app](https://astraeus-sky.vercel.app/)**

---

## Features

- **Live satellite map** — visualizes satellites currently above your location using an interactive Leaflet map with smooth drift animations
- **Geolocation-aware** — automatically detects your position to fetch relevant overhead satellites
- **Searchable satellite list** — filter and paginate through all detected satellites by name
- **Auto-refresh** — satellite positions update every 30 seconds
- **Responsive UI** — works across desktop and mobile

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Leaflet + react-leaflet-drift-marker
- React Router DOM

**Backend**
- Node.js + Express 5
- TypeScript
- Axios
- Redis (for caching, optional)

**APIs**
- [N2YO](https://www.n2yo.com/api/) — satellite positions and passes

---

## Project Structure

```
.
├── frontend/          # React + Vite app
│   └── src/
│       ├── components/    # Hero, Navbar, Dashboard, SatelliteMap, etc.
│       ├── hooks/         # useMapBounds, useVisibleSatellites
│       └── assets/        # Icons, logo
├── backend/           # Express API server
│   └── src/
│       ├── routes/        # satellite.ts — proxies N2YO requests
│       ├── services/      # Business logic
│       └── cache/         # Redis integration
├── Makefile           # Dev commands
└── vercel.json        # Deployment config
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- An [N2YO API key](https://www.n2yo.com/api/) (free registration)

### Installation

```bash
# Clone the repo
git clone https://github.com/samurai0lava/Astraeus-Sky.git
cd Astraeus-Sky

cd frontend/ && npm install 
cd backend/ && npm install 

### Configuration

Create a `.env` file in the `backend/` directory:

```env
N2YO_API_KEY=your_api_key_here
N2YO_BASE_URL=https://api.n2yo.com/rest/v1/satellite
PORT=3001
```

Then run the both services
in `frontend/` folder run ``` npm run dev```
 and also in `backend/` folder run ``` npm run dev ```


## API Overview

The backend exposes two main endpoints:

| Endpoint | Description |
|---|---|
| `GET /api/dashboard?lat=&lng=` | Returns satellites above the given coordinates, along with stats and card data |
| `GET /satellite/above/:lat/:lng/:alt/:radius/:category` | Direct N2YO proxy with input validation |

---

## Deployment

The project is configured for [Vercel](https://vercel.com) via `vercel.json`, with the frontend served at `/` and the backend at `/_/backend`.

```bash
vercel deploy
```

Make sure to set `N2YO_API_KEY` in your Vercel environment variables.

---

## License

MIT — see [LICENSE](./LICENSE) for details.

---

Built by [Ilyass Ouhsseine](https://www.linkedin.com/in/ilyassouhsseine/)