import React from "react";
import { getWeatherIcon, getWeatherDesc, formatDate } from "../utils/weather";

function CurrentWeather({ current, locationName }) {
  const now = new Date();

  return (
    <div className="current">
      <div className="current__top">
        <div>
          <div className="current__location">📍 {locationName}</div>
          <div className="current__date">{formatDate(now)}</div>
        </div>
        <div className="current__feels">
          <div className="current__feels-label">Feels like</div>
          <div className="current__feels-val">
            {Math.round(current.apparent_temperature)}°
          </div>
        </div>
      </div>

      <div className="current__temp-wrap">
        <div className="current__temp">
          {Math.round(current.temperature_2m)}
          <sup>°C</sup>
        </div>
        <div className="current__desc">
          {getWeatherIcon(current.weather_code)}{" "}
          {getWeatherDesc(current.weather_code)}
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;