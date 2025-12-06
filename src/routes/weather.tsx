import { createFileRoute } from '@tanstack/react-router'
import {
  CloudSun,
  Compass,
  Droplets,
  MapPin,
  Sun,
  SunDim,
  ThermometerSun,
  Wind,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'
import { getWeatherData } from '@/src/server/weather'

const DEFAULT_COORDS = {
  lat: Number(process.env.DEFAULT_FARM_LAT ?? 55.7558),
  lon: Number(process.env.DEFAULT_FARM_LON ?? 37.6173),
}

const formatTime = (iso: string) => {
  if (!iso) return '—'
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export const Route = createFileRoute('/weather')({
  validateSearch: (search) => {
    const parsedLat =
      typeof search.lat === 'string'
        ? parseFloat(search.lat)
        : typeof search.lat === 'number'
          ? search.lat
          : undefined
    const parsedLon =
      typeof search.lon === 'string'
        ? parseFloat(search.lon)
        : typeof search.lon === 'number'
          ? search.lon
          : undefined

    return {
      lat: Number.isFinite(parsedLat) ? Number(parsedLat) : DEFAULT_COORDS.lat,
      lon: Number.isFinite(parsedLon) ? Number(parsedLon) : DEFAULT_COORDS.lon,
    }
  },
  loader: ({ search }) => getWeatherData(search),
  component: WeatherPage,
})

function WeatherPage() {
  const weather = Route.useLoaderData()
  const search = Route.useSearch()
  const navigate = Route.useNavigate()

  const [latInput, setLatInput] = useState(search.lat.toString())
  const [lonInput, setLonInput] = useState(search.lon.toString())

  useEffect(() => {
    setLatInput(search.lat.toString())
    setLonInput(search.lon.toString())
  }, [search.lat, search.lon])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const lat = parseFloat(latInput)
    const lon = parseFloat(lonInput)

    if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
      return
    }

    navigate({
      search: (prev) => ({
        ...prev,
        lat,
        lon,
      }),
    })
  }

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />
        <main className="p-8 bg-white min-h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <CloudSun className="text-amber-500" />
                Прогноз погоды
              </h1>
              <p className="text-gray-500 text-sm">
                Обновлено: {new Date(weather.updatedAt).toLocaleString('ru-RU')}
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="flex items-end gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm"
            >
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Широта
                </label>
                <input
                  value={latInput}
                  onChange={(event) => setLatInput(event.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Долгота
                </label>
                <input
                  value={lonInput}
                  onChange={(event) => setLonInput(event.target.value)}
                  className="px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm focus:ring-2 focus:ring-green-200 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Обновить
              </button>
            </form>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-gradient-to-br from-[#e5f7ff] via-white to-[#fff6e5] rounded-3xl p-8 border border-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-1">
                    Текущее состояние
                  </p>
                  <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    {weather.locationName}
                    <MapPin className="text-rose-500" size={18} />
                  </h2>
                  <p className="text-gray-600 mt-1 flex items-center gap-1">
                    <Compass size={16} />
                    {weather.coordinates.lat.toFixed(3)}°,{' '}
                    {weather.coordinates.lon.toFixed(3)}°
                  </p>
                  <div className="mt-8 flex items-end gap-8">
                    <div>
                      <div className="text-6xl font-black text-gray-900">
                        {Math.round(weather.temperature)}°
                      </div>
                      <p className="text-gray-500 font-medium">
                        Ощущается как {Math.round(weather.feelsLike)}°
                      </p>
                      <p className="text-gray-600 text-lg mt-2">
                        {weather.description}
                      </p>
                    </div>
                    {weather.icon && (
                      <img
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
                        alt="Погодная иконка"
                        className="w-28 h-28 object-contain drop-shadow-lg"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                <WeatherMetric
                  label="Влажность"
                  value={`${weather.humidity}%`}
                  icon={<Droplets className="text-sky-500" />}
                />
                <WeatherMetric
                  label="Ветер"
                  value={`${weather.windSpeed.toFixed(1)} м/с`}
                  icon={<Wind className="text-emerald-500" />}
                />
                <WeatherMetric
                  label="Давление"
                  value={`${weather.pressure} гПа`}
                  icon={<ThermometerSun className="text-amber-500" />}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Солнечный график
                </h3>
                <div className="space-y-4">
                  <WeatherTimelineItem
                    icon={<Sun className="text-amber-500" />}
                    label="Восход"
                    value={formatTime(weather.sunrise)}
                  />
                  <WeatherTimelineItem
                    icon={<SunDim className="text-orange-500" />}
                    label="Закат"
                    value={formatTime(weather.sunset)}
                  />
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Рекомендации
                </h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li>
                    • Влажность {weather.humidity}% —{' '}
                    {weather.humidity > 80
                      ? 'высокая, следите за грибковыми болезнями.'
                      : 'оптимальная для большинства культур.'}
                  </li>
                  <li>
                    • Скорость ветра {weather.windSpeed.toFixed(1)} м/с —{' '}
                    {weather.windSpeed > 8
                      ? 'планируйте укрытие для нежных культур.'
                      : 'условия безопасны для опрыскивания.'}
                  </li>
                  <li>
                    • Температура ощущается как {Math.round(weather.feelsLike)}°,
                    учитывайте это при графике полива.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

const WeatherMetric = ({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon: ReactNode
}) => (
  <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border border-white shadow">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm font-medium text-gray-500 uppercase">
        {label}
      </span>
      {icon}
    </div>
    <div className="text-2xl font-bold text-gray-900">{value}</div>
  </div>
)

const WeatherTimelineItem = ({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100">
    <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500">
      {icon}
    </div>
    <div>
      <p className="text-xs uppercase text-gray-500 font-semibold">{label}</p>
      <p className="text-lg font-semibold text-gray-800">{value}</p>
    </div>
  </div>
)
