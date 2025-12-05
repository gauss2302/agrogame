import React from 'react'
import { ChevronDown } from 'lucide-react'

import type { HarvestGrowthPoint } from '@/src/server/dashboard'

export const HarvestGrowth = ({
  data,
}: {
  data: Array<HarvestGrowthPoint>
}) => {
  const maxValue =
    data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0
  const safeMax = maxValue === 0 ? 1 : maxValue
  const rangeLabel =
    data.length > 1
      ? `${data[0].label} - ${data[data.length - 1]?.label}`
      : data[0]?.label ?? 'Нет данных'

  if (data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-gray-800">Рост Урожая</h3>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600">
            Нет данных
          </button>
        </div>
        <div className="flex-1 border border-dashed border-gray-200 rounded-2xl text-sm text-gray-500 flex items-center justify-center text-center px-8">
          Мы пока не зарегистрировали сборы урожая. Соберите культуры, чтобы
          построить динамику.
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-gray-800">Рост Урожая</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100">
          {rangeLabel} <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-end justify-between h-48 gap-4">
        {data.map((item) => {
          const height = (item.value / safeMax) * 100
          const isMax = item.value === maxValue && item.value > 0

          return (
            <div
              key={item.label}
              className="flex flex-col items-center gap-3 flex-1 group relative"
            >
              {isMax && (
                <div className="absolute -top-8 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded mb-1">
                  {item.value} шт.
                </div>
              )}
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${isMax ? 'bg-[#2B7F9E]' : 'bg-[#9AC5D3] group-hover:bg-[#7FB2C4]'}`}
                style={{ height: `${height}%` }}
              />
              <span className="text-xs font-medium text-gray-500">
                {item.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
