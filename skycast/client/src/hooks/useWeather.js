import { useState, useCallback } from "react";
import { searchCity, reverseGeocode, fetchWeather, getUserLocation } from "../utils/api";

const initialState = {
  weather: null,
  locationName: "",
  loading: false,
  error: null,
  searchResults: [],
  showResults: false,
};

export function useWeather() {
  const [state, setState] = useState(initialState);

  const setLoading = (msg) =>
    setState((s) => ({ ...s, loading: msg || true, error: null }));

  const setError = (error) =>
    setState((s) => ({ ...s, loading: false, error }));

  // Load weather for a known lat/lon + display name
  const loadWeather = useCallback(async (lat, lon, name) => {
    setLoading("Fetching weather data…");
    try {
      const weather = await fetchWeather(lat, lon);
      setState((s) => ({
        ...s,
        weather,
        locationName: name,
        loading: false,
        error: null,
        searchResults: [],
        showResults: false,
      }));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Detect GPS location, reverse geocode it, then load weather
  const detectLocation = useCallback(async () => {
    setLoading("Detecting your location…");
    try {
      const { lat, lon } = await getUserLocation();
      setState((s) => ({ ...s, loading: "Fetching weather data…" }));
      const [geo, weather] = await Promise.all([
        reverseGeocode(lat, lon),
        fetchWeather(lat, lon),
      ]);
      const name = geo.city
        ? `${geo.city}${geo.country ? `, ${geo.country}` : ""}`
        : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`;
      setState((s) => ({
        ...s,
        weather,
        locationName: name,
        loading: false,
        error: null,
        searchResults: [],
        showResults: false,
      }));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  // Search by city name
  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) return;
    setLoading("Searching…");
    try {
      const results = await searchCity(query);
      if (results.length === 1) {
        const r = results[0];
        await loadWeather(r.latitude, r.longitude, `${r.name}${r.country ? `, ${r.country}` : ""}`);
      } else {
        setState((s) => ({ ...s, loading: false, searchResults: results, showResults: true }));
      }
    } catch (err) {
      setError(err.message);
    }
  }, [loadWeather]);

  const selectResult = useCallback((result) => {
    loadWeather(
      result.latitude,
      result.longitude,
      `${result.name}${result.country ? `, ${result.country}` : ""}`
    );
  }, [loadWeather]);

  const dismissResults = () =>
    setState((s) => ({ ...s, showResults: false, searchResults: [] }));

  return { ...state, detectLocation, handleSearch, selectResult, dismissResults };
}