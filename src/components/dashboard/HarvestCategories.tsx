import React from 'react'
import { Package, TrendingUp, TrendingDown, ChevronRight } from 'lucide-react'

const CategoryRow = ({
  name,
  weight,
  change,
}: {
  name: string
  weight: number
  change: number
}) => {
  const isPositive = change > 0
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          {/* Placeholder for category icon, using first letter for now or generic icon */}
          <div className="font-bold text-gray-300">{name[0]}</div>
        </div>
        <span className="font-medium text-gray-700">{name}</span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 font-medium">
        <Package size={16} className="text-gray-400" />
        {weight} Kg
      </div>

      <div
        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
      >
        {isPositive ? '+' : ''}
        {change}%
        {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      </div>
    </div>
  )
}

export const HarvestCategories = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-800">Top Harvest Categories</h3>
        <button className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-gray-700">
          See All <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-1">
        <CategoryRow name="Rice" weight={560} change={-4} />
        <CategoryRow name="Potato" weight={425} change={8} />
        <CategoryRow name="Chilli" weight={330} change={10} />
        <CategoryRow name="Cabbage" weight={288} change={-3} />
        <CategoryRow name="Tomato" weight={258} change={12} />
      </div>
    </div>
  )
}
