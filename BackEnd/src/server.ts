import "dotenv/config";
import express from "express";
import cors from "cors";
import axios from "axios";
import satelliteRoutes from "./routes/satellite";

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

    const lat = Number(req.query.lat);
    const lng = Number(req.query.lng);
    const alt = 0;       // user altitude in meters
    const radius = 90;   // search radius in km
    const category = 0;  // all satellites

    if (isNaN(lat) || isNaN(lng)) {
      return res.status(400).json({ error: "Invalid lat/lng parameters" });
    }

    // Fetch satellites above user location
    const { data } = await axios.get(
      `https://api.n2yo.com/rest/v1/satellite/above/${lat}/${lng}/${alt}/${radius}/${category}`,
      { params: { apiKey: API_KEY } }
    );

    // Transform satellites to clean shape
    const satellites = (data.above ?? []).map((sat: any) => ({
      id: sat.satid,
      name: sat.satname,
      lat: sat.satlat,
      lng: sat.satlng,
      altitude: sat.satalt,
      azimuth: sat.satazim,
    }));

    // Stats for dashboard
    const stats = [
      { label: "Satellites Above", value: satellites.length },
      { label: "Search Radius", value: radius + " km" },
    ];

    // Cards: first 5 satellites
    const cards = satellites.slice(0, 5).map((sat) => ({
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