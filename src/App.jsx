import React, { useState } from 'react'
import axios from 'axios'
import { Oval } from 'react-loader-spinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown } from '@fortawesome/free-solid-svg-icons'

import './App.css'
import api from './api'

function App() {
  const [input, setInput] = useState('')

  const [weather, setWeather] = useState({
    loading: false,
    data: null,
    error: false,
  })

  const getCurrentDate = () => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]

    const weekDays = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ]

    const currentDate = new Date()

    return `${weekDays[currentDate.getDay()]} ${currentDate.getDate()} ${
      months[currentDate.getMonth()]
    }`
  }

  const searchWeather = async (event) => {
    if (event.key !== 'Enter') return

    event.preventDefault()

    const city = input.trim()

    if (!city) {
      console.log('[Weather] Empty search')
      return
    }

    const apiKey = import.meta.env.VITE_WEATHER_API_KEY

    if (!apiKey) {
      console.error(
        '[Weather] VITE_WEATHER_API_KEY is missing from .env'
      )

      setWeather({
        loading: false,
        data: null,
        error: true,
      })

      return
    }

    console.log('[Weather] Searching:', city)

    setWeather({
      loading: true,
      data: null,
      error: false,
    })

    try {
      const response = await api.get('/weather', {
        params: {
          q: city,
          units: 'metric',
          appid: apiKey,
        },
      })
      console.log('[Weather] API response:', response.data)

      setWeather({
        loading: false,
        data: response.data,
        error: false,
      })

      setInput('')
    } catch (error) {
      console.error('[Weather] API error:', error)

      setWeather({
        loading: false,
        data: null,
        error: true,
      })

      setInput('')
    }
  }

  const weatherData = weather.data

  return (
    <main className="App">
      <h1 className="app-name">
        Weather App
      </h1>

      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Enter city name..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={searchWeather}
        />
      </div>

      {weather.loading && (
        <div className="loading">
          <Oval
            height={70}
            width={70}
            color="black"
            secondaryColor="gray"
            strokeWidth={4}
          />
        </div>
      )}

      {weather.error && !weather.loading && (
        <div className="error-message">
          <FontAwesomeIcon icon={faFrown} />

          <span>
            City not found. Please try another city.
          </span>
        </div>
      )}

      {weatherData && !weather.loading && !weather.error && (
        <section className="weather-container">
          <div className="city-name">
            <h2>
              {weatherData.name},{' '}
              <span>
                {weatherData.sys.country}
              </span>
            </h2>
          </div>

          <div className="date">
            <span>
              {getCurrentDate()}
            </span>
          </div>

          <div className="icon-temp">
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt={weatherData.weather[0].description}
            />

            <span className="temperature">
              {Math.round(weatherData.main.temp)}
            </span>

            <sup className="deg">
              °C
            </sup>
          </div>

          <div className="weather-description">
            {weatherData.weather[0].description}
          </div>

          <div className="weather-details">
            <div className="weather-detail">
              <span className="label">
                Feels like
              </span>

              <span className="value">
                {Math.round(weatherData.main.feels_like)}°C
              </span>
            </div>

            <div className="weather-detail">
              <span className="label">
                Humidity
              </span>

              <span className="value">
                {weatherData.main.humidity}%
              </span>
            </div>

            <div className="weather-detail">
              <span className="label">
                Wind
              </span>

              <span className="value">
                {weatherData.wind.speed} m/s
              </span>
            </div>

            <div className="weather-detail">
              <span className="label">
                Pressure
              </span>

              <span className="value">
                {weatherData.main.pressure} hPa
              </span>
            </div>
          </div>
        </section>
      )}
    </main>
  )
}

export default App
