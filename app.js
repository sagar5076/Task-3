import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const API_KEY = 'YOUR_API_KEY_HERE';  // Replace with your OpenWeatherMap API key

  useEffect(() => {
    // Automatically detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        error => setLocationError(error.message)
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
    }
  }, []);

  const fetchWeatherByCity = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(response.data);
    } catch (error) {
      console.error("Error fetching weather data: ", error);
    }
  };

  const handleSearch = () => {
    if (city) {
      fetchWeatherByCity(city);
    }
  };

  return (
    <div className="App">
      <h1>Weather Forecast</h1>
      <div className="search">
        <input 
          type="text" 
          placeholder="Enter city" 
          value={city} 
          onChange={(e) => setCity(e.target.value)} 
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {locationError && <p>{locationError}</p>}
      {weatherData && (
        <div className="weather-container">
          <h2>{weatherData.city.name}, {weatherData.city.country}</h2>
          <div className="forecast">
            {weatherData.list.slice(0, 5).map((weather, index) => (
              <div key={index} className="forecast-item">
                <p>{new Date(weather.dt_txt).toLocaleDateString()}</p>
                <p>{weather.weather[0].description}</p>
                <p>{weather.main.temp} °C</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
