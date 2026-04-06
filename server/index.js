require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const NodeCache = require("node-cache");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;
const cache = new NodeCache({ stdTTL: process.env.CACHE_TTL || 600 });

// ── Middleware ──────────────────────────────────────────────────────

app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests — please try again later." },
});
app.use("/api", limiter);

// ── Constants ───────────────────────────────────────────────────────

const OPEN_METEO_BASE = "https://api.open-meteo.com/v1/forecast";
const GEOCODING_BASE  = "https://geocoding-api.open-meteo.com/v1";
const REVERSE_GEO_BASE = "https://api.bigdatacloud.net/data/reverse-geocode-client";

// ── Routes ──────────────────────────────────────────────────────────

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Search city by name
app.get("/api/geocode", async (req, res) => {
  const { city } = req.query;
  if (!city || city.trim().length < 1) {
    return res.status(400).json({ error: "City name is required." });
  }

  const key = `geocode:${city.toLowerCase().trim()}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(`${GEOCODING_BASE}/search`, {
      params: { name: city.trim(), count: 5, language: "en", format: "json" },
      timeout: 8000,
    });

    if (!data.results || data.results.length === 0) {
      return res.status(404).json({ error: `No results found for "${city}".` });
    }

    const result = {
      results: data.results.map((r) => ({
        name: r.name,
        country: r.country,
        country_code: r.country_code,
        admin1: r.admin1,
        latitude: r.latitude,
        longitude: r.longitude,
      })),
    };

    cache.set(key, result, 3600);
    res.json(result);
  } catch (err) {
    console.error("Geocode error:", err.message);
    res.status(502).json({ error: "Failed to fetch location data. Please try again." });
  }
});

// Convert lat/lon to city name
app.get("/api/reverse-geocode", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "lat and lon are required." });

  const key = `revgeo:${parseFloat(lat).toFixed(2)},${parseFloat(lon).toFixed(2)}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  try {
    const { data } = await axios.get(REVERSE_GEO_BASE, {
      params: { latitude: lat, longitude: lon, localityLanguage: "en" },
      timeout: 8000,
    });

    const result = {
      city: data.city || data.locality || null,
      country: data.countryName || null,
      country_code: data.countryCode || null,
    };

    cache.set(key, result, 3600);
    res.json(result);
  } catch (err) {
    console.error("Reverse geocode error:", err.message);
    res.json({ city: null, country: null });
  }
});

// Fetch weather for lat/lon
app.get("/api/weather", async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ error: "lat and lon are required." });

  const latF = parseFloat(lat);
  const lonF = parseFloat(lon);
  if (isNaN(latF) || isNaN(lonF)) {
    return res.status(400).json({ error: "Invalid coordinates." });
  }

  const key = `weather:${latF.toFixed(2)},${lonF.toFixed(2)}`;
  const cached = cache.get(key);
  if (cached) return res.json(cached);

  try {
    const url =
      `${OPEN_METEO_BASE}?latitude=${latF}&longitude=${lonF}` +
      `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,precipitation,surface_pressure,visibility` +
      `&hourly=temperature_2m,weather_code,precipitation_probability,wind_speed_10m` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,sunrise,sunset` +
      `&timezone=auto&forecast_days=7&wind_speed_unit=kmh`;

    const { data } = await axios.get(url, { timeout: 10000 });
    cache.set(key, data);
    res.json(data);
  } catch (err) {
    console.error("Weather fetch error:", err.message);
    res.status(502).json({ error: "Failed to fetch weather data. Please try again." });
  }
});

// ── Start Server ─────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🌤  Skycast server running on http://localhost:${PORT}`);
  console.log(`   API health: http://localhost:${PORT}/api/health\n`);
});