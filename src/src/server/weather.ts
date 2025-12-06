import { createServerFn } from '@tanstack/react-start'

interface WeatherRequest {
  lat?: number
  lon?: number
}

interface WeatherResponse {
  locationName: string
  coordinates: {
    lat: number
    lon: number
  }
  description: string
  icon: string | null
  temperature: number
  feelsLike: number
  humidity: number
  windSpeed: number
  pressure: number
  sunrise: string
  sunset: string
  updatedAt: string
}

const DEFAULT_COORDS = {
  lat: Number(process.env.DEFAULT_FARM_LAT ?? 55.7558),
  lon: Number(process.env.DEFAULT_FARM_LON ?? 37.6173),
}

const OPENWEATHER_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather'

interface OpenWeatherPayload {
  name?: string
  weather?: Array<{
    description?: string
    icon?: string
  }>
  main?: {
    temp?: number
    feels_like?: number
    humidity?: number
    pressure?: number
  }
  wind?: {
    speed?: number
  }
  sys?: {
    sunrise?: number
    sunset?: number
  }
}

const normalizeCoords = (coords?: WeatherRequest) => {
  const lat = Number(
    Number.isFinite(coords?.lat) ? coords?.lat : DEFAULT_COORDS.lat,
  )
  const lon = Number(
    Number.isFinite(coords?.lon) ? coords?.lon : DEFAULT_COORDS.lon,
  )
  return { lat, lon }
}

export const getWeatherData = createServerFn()
  .inputValidator((data: WeatherRequest | undefined) => data ?? {})
  .handler(async ({ data }) => {
    const apiKey = process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      throw new Error(
        'Отсутствует API ключ OpenWeather. Добавьте OPENWEATHER_API_KEY в .env.local',
      )
    }

    const { lat, lon } = normalizeCoords(data)
    const url = new URL(OPENWEATHER_ENDPOINT)
    url.searchParams.set('lat', lat.toString())
    url.searchParams.set('lon', lon.toString())
    url.searchParams.set('appid', apiKey)
    url.searchParams.set('units', 'metric')
    url.searchParams.set('lang', 'ru')

    const response = await fetch(url.toString())
    if (!response.ok) {
      const msg = await response.text()
      throw new Error(
        `OpenWeather API error (${response.status}): ${msg || 'unknown error'}`,
      )
    }

    const payload = (await response.json()) as OpenWeatherPayload
    const weatherEntry = Array.isArray(payload.weather)
      ? payload.weather[0]
      : null
    const sunrise = payload.sys?.sunrise
      ? new Date(payload.sys.sunrise * 1000).toISOString()
      : null
    const sunset = payload.sys?.sunset
      ? new Date(payload.sys.sunset * 1000).toISOString()
      : null

    const result: WeatherResponse = {
      locationName: payload.name || 'Неизвестное расположение',
      coordinates: { lat, lon },
      description: weatherEntry?.description
        ? `${weatherEntry.description[0].toUpperCase()}${weatherEntry.description.slice(
            1,
          )}`
        : 'Нет описания',
      icon: weatherEntry?.icon ?? null,
      temperature: typeof payload.main?.temp === 'number' ? payload.main.temp : 0,
      feelsLike:
        typeof payload.main?.feels_like === 'number'
          ? payload.main.feels_like
          : 0,
      humidity: typeof payload.main?.humidity === 'number' ? payload.main.humidity : 0,
      windSpeed:
        typeof payload.wind?.speed === 'number' ? payload.wind.speed : 0,
      pressure:
        typeof payload.main?.pressure === 'number' ? payload.main.pressure : 0,
      sunrise: sunrise ?? '',
      sunset: sunset ?? '',
      updatedAt: new Date().toISOString(),
    }

    return result
  })
