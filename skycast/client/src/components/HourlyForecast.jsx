import React, { useMemo } from "react";
import { getWeatherIcon, formatHour } from "../utils/weather";

function HourlyForecast({ hourly }) {
  const now = new Date();

  const hours = useMemo(() => {
    const items = [];
    for (let i = 0; i < hourly.time.length; i++) {
      const t = new Date(hourly.time[i]);
      if (t >= now) items.push(i);
      if (items.length >= 24) break;
    }
    return items;
  }, [hourly]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!hours.length) return null;

  return (
    <section className="hourly">
      <p className="section-label">Hourly — Next 24 Hours</p>
      <div className="hourly__scroll">
        {hours.map((i, idx) => {
          const t = new Date(hourly.time[i]);
          return (
            <div key={i} className={`hourly__card${idx === 0 ? " hourly__card--now" : ""}`}>
              <div className="hourly__time">{idx === 0 ? "Now" : formatHour(t)}</div>
              <div className="hourly__icon">{getWeatherIcon(hourly.weather_code[i])}</div>
              <div className="hourly__temp">{Math.round(hourly.temperature_2m[i])}°</div>
              <div className="hourly__rain">{hourly.precipitation_probability[i]}%</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default HourlyForecast;