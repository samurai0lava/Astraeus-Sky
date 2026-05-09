import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";
import satelliteRoutes from "./routes/satellite";

type DashboardSatellite = {
  id: number;
  name: string;
  lat: number;
  lng: number;
  altitude: number;
  azimuth: number;
};

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());
app.use("/satellite", satelliteRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Dashboard API
app.get("/api/dashboard", async (req, res) => {
  try {
    const API_KEY = process.env.N2YO_API_KEY;
    if (!API_KEY) throw new Error("N2YO_API_KEY not set");

    const rawLat = req.query.lat;
    const rawLng = req.query.lng;
    // If geolocation is blocked/denied in the browser, the frontend calls this
    // endpoint without coords. Default to (0,0) so the dashboard still loads.
    const lat = rawLat == null ? 0 : Number(rawLat);
    const lng = rawLng == null ? 0 : Number(rawLng);
    const alt = 0;       // user altitude in meters
    const radius = 90;   // search radius in km
    const category = 0;  // all satellites

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid lat/lng parameters" });
    }

    // Fetch satellites above user location (10s timeout, up to 2 retries)
    let data: any;
    const N2YO_TIMEOUT = 10_000;
    const MAX_RETRIES = 2;
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await axios.get(
          `https://api.n2yo.com/rest/v1/satellite/above/${lat}/${lng}/${alt}/${radius}/${category}`,
          { params: { apiKey: API_KEY }, timeout: N2YO_TIMEOUT }
        );
        data = response.data;
        break;
      } catch (e: any) {
        const retryable = e.code === 'ECONNRESET' || e.code === 'ECONNABORTED' || e.message?.includes('socket hang up');
        if (!retryable || attempt === MAX_RETRIES) throw e;
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }

    // Transform satellites to clean shape
    const above: any[] = Array.isArray((data as any)?.above) ? (data as any).above : [];
    const satellites: DashboardSatellite[] = above.map((sat) => ({
      id: Number(sat.satid),
      name: String(sat.satname),
      lat: Number(sat.satlat),
      lng: Number(sat.satlng),
      altitude: Number(sat.satalt),
      azimuth: Number(sat.satazim),
    }));

    // Stats for dashboard
    const stats = [
      { label: "Satellites Above", value: satellites.length },
      { label: "Search Radius", value: radius + " km" },
    ];

    // Cards: first 5 satellites
    const cards = satellites.map((sat) => ({
      title: sat.name,
      description: `Altitude: ${sat.altitude} km | Azimuth: ${sat.azimuth}°`,
    }));

    // Send final structured response
    res.json({
      user: { lat, lng },
      satellites,
      stats,
      cards,
    });

  } catch (err: any) {
    console.error("Dashboard error:", err.message || err);
    res.status(500).json({
      error: "Failed to fetch dashboard data",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});