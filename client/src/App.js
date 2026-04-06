import React, { useEffect } from "react";
import "./App.css";
import { useWeather } from "./hooks/useWeather";
import SearchBar from "./components/SearchBar";
import CurrentWeather from "./components/CurrentWeather";
import HourlyForecast from "./components/HourlyForecast";
import DailyForecast from "./components/DailyForecast";
import WeatherStats from "./components/WeatherStats";
import LoadingSpinner from "./components/LoadingSpinner";
import ErrorMessage from "./components/ErrorMessage";

function App() {
  const {
    weather,
    locationName,
    loading,
    error,
    searchResults,
    showResults,
    detectLocation,
    handleSearch,
    selectResult,
    dismissResults,
  } = useWeather();

  // Auto-detect location on first load
  useEffect(() => {
    detectLocation();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="app">
      <div className="app__container">

        <header className="app__header">
          <h1 className="app__title">Sky<span>cast</span></h1>
          <p className="app__subtitle">Real-time weather forecast</p>
        </header>

        <SearchBar
          onSearch={handleSearch}
          onDetect={detectLocation}
          searchResults={searchResults}
          showResults={showResults}
          onSelectResult={selectResult}
          onDismiss={dismissResults}
          loading={!!loading}
        />

        {loading && <LoadingSpinner message={loading} />}
        {error && <ErrorMessage message={error} onRetry={detectLocation} />}

        {weather && !loading && (
          <main className="app__main">
            <CurrentWeather
              current={weather.current}
              locationName={locationName}
              daily={weather.daily}
            />
            <WeatherStats current={weather.current} daily={weather.daily} />
            <HourlyForecast hourly={weather.hourly} />
            <DailyForecast daily={weather.daily} />
          </main>
        )}

        {!weather && !loading && !error && (
          <div className="app__empty">
            <span className="app__empty-icon">🌍</span>
            <p>Search for a city or allow location access to see the forecast.</p>
          </div>
        )}

        <footer className="app__footer">
          Weather data from{" "}
          <a href="https://open-meteo.com" target="_blank" rel="noreferrer">
            Open-Meteo
          </a>{" "}
          · Free &amp; open-source
        </footer>
      </div>
    </div>
  );
}

export default App;