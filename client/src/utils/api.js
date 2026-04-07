async function apiFetch(path) {
  const res = await fetch(`/api${path}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

// Search city by name → returns array of location results
export async function searchCity(city) {
  const data = await apiFetch(`/geocode?city=${encodeURIComponent(city)}`);
  return data.results;
}

// Reverse geocode lat/lon → { city, country }
export async function reverseGeocode(lat, lon) {
  return apiFetch(`/reverse-geocode?lat=${lat}&lon=${lon}`);
}

// Fetch full weather data for lat/lon
export async function fetchWeather(lat, lon) {
  return apiFetch(`/weather?lat=${lat}&lon=${lon}`);
}

// Get user's GPS coordinates from the browser
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            reject(new Error("Location access denied. Please search manually."));
            break;
          case err.POSITION_UNAVAILABLE:
            reject(new Error("Location unavailable. Please search manually."));
            break;
          default:
            reject(new Error("Could not retrieve location. Please search manually."));
        }
      },
      { timeout: 10000 }
    );
  });
}