import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { fetchWeatherData } from '../api-services/open-weather-service'
import { capitalizeFirstLetter } from '../utils/text-formatting'
import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Remix Weather' },
    {
      name: 'description',
      content: 'A demo web app using Remix and OpenWeather API.',
    },
  ]
}

const location = {
  city: 'Ottawa',
  postalCode: 'K2G 1V8', 
  lat: 45.3211,
  lon: -75.7391,
  countryCode: 'CA',
}
const units = 'metric'

export async function loader() {
  const data = await fetchWeatherData({
    lat: location.lat,
    lon: location.lon,
    units: units,
  })
  return json({ currentConditions: data })
}

export default function CurrentConditions() {
  const { currentConditions } = useLoaderData<typeof loader>()
  
  const weather = currentConditions?.weather?.[0]
  const description = weather?.description || "No description available";
  const iconCode = weather?.icon || "01d";
  const windSpeed = currentConditions?.wind?.speed || 0;
  const humidity = currentConditions?.main?.humidity || 0;

  return (
    <>
      <main
        style={{
          padding: '1.5rem',
          fontFamily: 'system-ui, sans-serif',
          lineHeight: '1.8',
        }}
      >
        <h1>Remix Weather</h1>
        <p>
          For Algonquin College, Woodroffe Campus <br />
          <span style={{ color: 'hsl(220, 23%, 60%)' }}>
            (LAT: {location.lat}, LON: {location.lon})
          </span>
        </p>

        <h2>Current Conditions</h2>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '2rem', alignItems: 'center' }}>
          <img src={`http://openweathermap.org/img/wn/${iconCode}@2x.png`} alt="" />
          <div style={{ fontSize: '2rem' }}>
            {currentConditions?.main?.temp?.toFixed(1) ?? "0"}°C
          </div>
        </div>

        <p style={{ fontSize: '1.2rem', fontWeight: '400', margin: '0' }}>
          {capitalizeFirstLetter(description)}. Feels like{' '}
          {currentConditions?.main?.['feels_like']?.toFixed(1) ?? "0"}°C.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '1rem', color: 'hsl(220, 23%, 40%)', marginTop: '0.5rem' }}>
          <span> Wind: {currentConditions?.wind?.speed ?? "0"} m/s</span>
          <span>Humidity: {currentConditions?.main?.humidity ?? "0"}%</span>
        </div>

        <div style={{ color: 'hsl(220, 23%, 60%)', fontSize: '0.85rem', marginTop: '0.5rem' }}>
          updated at{' '}
          {currentConditions?.dt 
            ? new Intl.DateTimeFormat('en-CA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              }).format(currentConditions.dt * 1000)
            : "N/A"}
        </div>
      </main>

      <section
        style={{
          backgroundColor: 'hsl(220, 54%, 96%)',
          padding: '0.5rem 1.5rem 1rem 1.5rem',
          borderRadius: '0.25rem',
        }}
      >
        <h2>Raw Data</h2>
        <pre>{JSON.stringify(currentConditions || {}, null, 2)}</pre>
      </section>

      <hr style={{ marginTop: '2rem' }} />
      <p>
        Learn how to customize this app. Read the{' '}
        <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
          Remix Docs
        </a>
      </p>
    </>
  )
}