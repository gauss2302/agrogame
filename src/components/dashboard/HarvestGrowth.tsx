import React from 'react'
import { ChevronDown } from 'lucide-react'

export const HarvestGrowth = () => {
  const data = [
    { month: 'Jan', value: 45 },
    { month: 'Feb', value: 40 },
    { month: 'Mar', value: 55 },
    { month: 'Apr', value: 60 },
    { month: 'May', value: 75 }, // Highlighted
    { month: 'Jun', value: 50 },
  ]

  const maxValue = Math.max(...data.map((d) => d.value))

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-bold text-gray-800">Harvest Growth</h3>
        <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100">
          Jan - Jun <ChevronDown size={14} />
        </button>
      </div>

      <div className="flex items-end justify-between h-48 gap-4">
        {data.map((item, index) => {
          const height = (item.value / maxValue) * 100
          const isMax = item.value === maxValue

          return (
            <div
              key={index}
              className="flex flex-col items-center gap-3 flex-1 group relative"
            >
              {isMax && (
                <div className="absolute -top-8 bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded mb-1">
                  8.5 K
                </div>
              )}
              <div
                className={`w-full rounded-t-lg transition-all duration-500 ${isMax ? 'bg-[#2B7F9E]' : 'bg-[#9AC5D3] group-hover:bg-[#7FB2C4]'}`}
                style={{ height: `${height}%` }}
              />
              <span className="text-xs font-medium text-gray-500">
                {item.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
