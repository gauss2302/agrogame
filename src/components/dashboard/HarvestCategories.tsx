import React from 'react'
import { ChevronRight, Package, TrendingDown, TrendingUp } from 'lucide-react'

import type { HarvestCategoryStat } from '@/src/server/dashboard'

const weightFormatter = new Intl.NumberFormat('ru-RU')

const CategoryRow = ({ category }: { category: HarvestCategoryStat }) => {
  const isPositive = category.change >= 0
  const TrendIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
          <div className="font-bold text-gray-300 uppercase">
            {category.name.slice(0, 2)}
          </div>
        </div>
        <div>
          <p className="font-semibold text-gray-700">{category.name}</p>
          <p className="text-xs text-gray-400">{category.harvests} сборов</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-gray-600 font-medium">
        <Package size={16} className="text-gray-400" />
        {weightFormatter.format(category.weight)} кг
      </div>

      <div
        className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}
      >
        {isPositive && '+'}
        {category.change}%
        <TrendIcon size={12} />
      </div>
    </div>
  )
}

export const HarvestCategories = ({
  categories,
}: {
  categories: Array<HarvestCategoryStat>
}) => {
  const topCategories = categories.slice(0, 5)

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-gray-800">Топ посадки</h3>
        <button className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-gray-700">
          Все <ChevronRight size={14} />
        </button>
      </div>

      {topCategories.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-sm text-gray-500">
          Урожай пока не собран. Соберите культуры в игре, чтобы увидеть аналитику.
        </div>
      ) : (
        <div className="space-y-1">
          {topCategories.map((category) => (
            <CategoryRow key={category.type} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}
