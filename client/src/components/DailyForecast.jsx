import React from "react";
import { getWeatherIcon, formatShortDay } from "../utils/weather";

function DailyForecast({ daily }) {
  return (
    <section className="daily">
      <p className="section-label">7-Day Forecast</p>
      <div className="daily__list">
        {daily.time.map((dateStr, i) => {
          const date = new Date(dateStr);
          const hi = Math.round(daily.temperature_2m_max[i]);
          const lo = Math.round(daily.temperature_2m_min[i]);
          return (
            <div key={dateStr} className="daily__row">
              <div className="daily__day">{formatShortDay(date, i === 0)}</div>
              <div className="daily__icon">{getWeatherIcon(daily.weather_code[i])}</div>
              <div className="daily__bar-wrap">
                <span className="daily__lo">{lo}°</span>
                <div className="daily__bar" />
                <span className="daily__hi">{hi}°</span>
              </div>
              <div className="daily__temps">
                <span className="daily__hi-val">{hi}°</span>
                <span className="daily__lo-val">{lo}°</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default DailyForecast;