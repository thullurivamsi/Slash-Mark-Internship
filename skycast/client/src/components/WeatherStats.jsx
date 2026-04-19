import React from "react";
import { getWindDirection, formatTime } from "../utils/weather";

function StatCard({ icon, value, label }) {
  return (
    <div className="stat-card">
      <div className="stat-card__icon">{icon}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__label">{label}</div>
    </div>
  );
}

function WeatherStats({ current, daily }) {
  const sunrise = daily?.sunrise?.[0] ? formatTime(daily.sunrise[0]) : "—";
  const sunset  = daily?.sunset?.[0]  ? formatTime(daily.sunset[0])  : "—";
  const windDir = current.wind_direction_10m != null
    ? getWindDirection(current.wind_direction_10m)
    : "";

  return (
    <div className="stats">
      <StatCard icon="💧" value={`${current.relative_humidity_2m}%`}              label="Humidity"  />
      <StatCard icon="💨" value={`${Math.round(current.wind_speed_10m)} km/h ${windDir}`} label="Wind" />
      <StatCard icon="🌧️" value={`${current.precipitation} mm`}                  label="Precip."   />
      <StatCard icon="🌅" value={sunrise}                                          label="Sunrise"   />
      <StatCard icon="🌇" value={sunset}                                           label="Sunset"    />
      <StatCard icon="🔵" value={current.surface_pressure != null ? `${Math.round(current.surface_pressure)} hPa` : "—"} label="Pressure" />
    </div>
  );
}

export default WeatherStats;