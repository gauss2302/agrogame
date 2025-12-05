import React from 'react'
import { ChevronDown, TrendingDown, TrendingUp } from 'lucide-react'

import type { TotalHarvestSummary } from '@/src/server/dashboard'

const weightFormatter = new Intl.NumberFormat('ru-RU')

const getCoordinatesForPercent = (percent: number) => {
  const x = Math.cos(2 * Math.PI * percent)
  const y = Math.sin(2 * Math.PI * percent)
  return [x, y]
}

export const TotalHarvest = ({ data }: { data: TotalHarvestSummary }) => {
  const hasData = data.totalWeight > 0 && data.segments.length > 0
  const comparisonPositive = data.comparisonPercent >= 0
  const TrendIcon = comparisonPositive ? TrendingUp : TrendingDown
  const comparisonValue = Math.abs(data.comparisonPercent)

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800">Общий урожай</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100">
          Последние месяцы <ChevronDown size={14} />
        </button>
      </div>

      {hasData ? (
        <div className="flex items-center gap-8">
          <div className="relative w-40 h-40">
            <svg viewBox="-1 -1 2 2" className="rotate-[-90deg]">
              {(() => {
                let cumulativePercent = 0
                return data.segments.map((segment) => {
                  const value = segment.value / data.totalWeight
                  if (value <= 0) {
                    return null
                  }
                  const start = cumulativePercent
                  cumulativePercent += value
                  const end = cumulativePercent

                  const [startX, startY] = getCoordinatesForPercent(start)
                  const [endX, endY] = getCoordinatesForPercent(end)
                  const largeArcFlag = value > 0.5 ? 1 : 0

                  return (
                    <path
                      key={segment.type}
                      d={`M ${startX} ${startY} A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`}
                      fill="none"
                      stroke={segment.color}
                      strokeWidth="0.35"
                    />
                  )
                })
              })()}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-gray-800">
                {weightFormatter.format(data.totalWeight)} кг
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Общий урожай
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {data.segments.map((segment) => (
              <div key={segment.type} className="flex items-center gap-2">
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
      ) : (
        <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-sm text-gray-500 text-center">
          Еще не собрано достаточно урожая для построения диаграммы. Продолжайте
          выращивание в игре!
        </div>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-xs font-medium text-gray-500">
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full font-bold ${comparisonPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
        >
          {comparisonPositive ? '+' : '-'}
          {comparisonValue}% <TrendIcon size={12} />
        </span>
        По сравнению с прошлым месяцем
      </div>
    </div>
  )
}
