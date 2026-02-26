/**
 * Astraeus Sky backend - Express server.
 * Aggregates N2YO (satellites), OpenWeatherMap, astronomy data.
 */
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

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

/**
 * Dashboard route - provides stats and cards for frontend.
 * You can customize this to fetch real weather, astronomy, etc.
 */
app.get("/api/dashboard", async (req, res) => {
  try {
    const API_KEY = process.env.N2YO_API_KEY;
    if (!API_KEY) throw new Error("N2YO_API_KEY not set");

    const lat = Number(req.query.lat) || 33.93; // default Temara
    const lng = Number(req.query.lng) || -6.90;
    const alt = 0;
    const radius = 90;
    const category = 0;

    const { data } = await axios.get(
      `https://api.n2yo.com/rest/v1/satellite/above/${lat}/${lng}/${alt}/${radius}/${category}`,
      { params: { apiKey: API_KEY } }
    );

    const stats = [
      { label: "Satellites Above", value: data.above?.length ?? 0 },
      { label: "Search Radius", value: radius + "°" },
    ];

    const cards = (data.above ?? []).slice(0, 5).map((sat: any) => ({
      title: sat.satname,
      description: `Altitude: ${sat.satalt} km | Azimuth: ${sat.satazim}°`,
    }));

    res.json({ stats, cards });
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