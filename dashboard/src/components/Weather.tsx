import React, { useState } from 'react';
import { fetchWeather } from './api';

const Weather: React.FC = () => {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const handleSearch = async () => {
    const data = await fetchWeather(city);
    setWeather(data);
  };

  return (
    <div>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city"
      />
      <button onClick={handleSearch}>Search</button>
      {weather && (
        <div>
          <h2>{weather.name}</h2>
          <p>{weather.main.temp} °C</p>
          <p>{weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
        </div>
      )}
    </div>
  );
};

export default Weather;
