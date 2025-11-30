import React from 'react'
import { ChevronDown, TrendingUp } from 'lucide-react'

export const TotalHarvest = () => {
  // Simple SVG Donut Chart implementation
  // Segments: Rice (Orange), Veg (Blue), Fruit (Green), Flower (Red)
  // Values approximated from image
  const segments = [
    { color: '#F97316', value: 65, label: 'Rice' }, // Orange
    { color: '#2B7F9E', value: 20, label: 'Vegetables' }, // Blue
    { color: '#22C55E', value: 10, label: 'Fruit' }, // Green
    { color: '#EF4444', value: 5, label: 'Flower' }, // Red
  ]

  let cumulativePercent = 0

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent)
    const y = Math.sin(2 * Math.PI * percent)
    return [x, y]
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800">Общий урожай</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100">
          May <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-center gap-8">
        <div className="relative w-40 h-40">
          <svg viewBox="-1 -1 2 2" className="rotate-[-90deg]">
            {segments.map((segment, i) => {
              const start = cumulativePercent
              const value = segment.value / 100
              cumulativePercent += value
              const end = cumulativePercent

              const [startX, startY] = getCoordinatesForPercent(start)
              const [endX, endY] = getCoordinatesForPercent(end)
              const largeArcFlag = value > 0.5 ? 1 : 0

              return (
                <path
                  key={i}
                  d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="0.35"
                />
              )
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-800">1,456 Kg</span>
            <span className="text-xs text-gray-500 font-medium">
              Общий урожай
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {segments.map((segment, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: segment.color }}
              ></span>
              <span className="text-xs font-medium text-gray-600">
                {segment.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
        <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2 py-1 rounded-full font-bold">
          +25% <TrendingUp size={12} />
        </span>
        From Last Month
      </div>
    </div>
  )
}
