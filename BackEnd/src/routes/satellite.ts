import { Router, Request, Response } from "express";
import axios from "axios";

const router = Router();
const N2YO_BASE = "https://api.n2yo.com/rest/v1/satellite";

function getApiKey(): string {
  const key = process.env.N2YO_API_KEY;
  if (!key || key.trim() === "") {
    throw new Error("N2YO_API_KEY is not set");
  }
  return key;
}

function parseNum(value: string, name: string, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) {
    throw new Error(`Invalid ${name}: must be a number`);
  }
  if (n < min || n > max) {
    throw new Error(`Invalid ${name}: must be between ${min} and ${max}`);
  }
  return n;
}

router.get("/above/:lat/:lng/:alt/:radius/:category", async (req: Request, res: Response) => {
  try {
    const { lat, lng, alt, radius, category } = req.params;
    const apiKey = getApiKey();

    if (!lat || !lng || !alt || !radius || !category) {
      return res.status(400).json({ error: "Missing required parameters" });
    }

    const observer_lat = parseNum(String(lat), "lat", -90, 90);
    const observer_lng = parseNum(String(lng), "lng", -180, 180);
    const observer_alt = parseNum(String(alt), "alt", 0, 100_000);
    const search_radius = parseNum(String(radius), "radius", 0, 90);
    const category_id = parseNum(String(category), "category", 0, 99);

    const url = `${N2YO_BASE}/above/${observer_lat}/${observer_lng}/${observer_alt}/${search_radius}/${category_id}`;
    const { data } = await axios.get(url, {
      params: { apiKey },
      timeout: 15_000,
      validateStatus: (status) => status < 500,
    });

    if (data.error) {
      const status = typeof data.error === "string" && data.error.toLowerCase().includes("limit") ? 429 : 502;
      return res.status(status).json({
        error: data.error,
        ...(data.info && { info: data.info }),
      });
    }

    res.json(data);
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "N2YO_API_KEY is not set") {
        return res.status(503).json({ error: "Satellite service unavailable: API key not configured." });
      }
      if (axios.isAxiosError(err)) {
        const status = err.response?.status ?? 502;
        return res.status(status).json({
          error: err.response?.data?.error ?? err.message ?? "Upstream request failed",
        });
      }
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
