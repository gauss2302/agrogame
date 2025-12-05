import React from 'react'
import { ChevronRight } from 'lucide-react'

import type { SeedStockEntry } from '@/src/server/dashboard'

const SeedRow = ({ entry }: { entry: SeedStockEntry }) => {
  const percentage =
    entry.capacity === 0 ? 0 : Math.min(100, (entry.planted / entry.capacity) * 100)

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 w-20">{entry.name}</span>
        <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${entry.color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-800">{entry.planted}</div>
          <div className="text-[10px] text-gray-400 font-medium">Участков</div>
        </div>
      </div>
    </div>
  )
}

export const SeedsStock = ({
  entries,
}: {
  entries: Array<SeedStockEntry>
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800">План посадки семян</h3>
        <button className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-gray-700">
          Все <ChevronRight size={14} />
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="border border-dashed border-gray-200 rounded-2xl p-6 text-sm text-gray-500">
          Нет активных посадок. Посадите культуры на поле, чтобы увидеть
          распределение.
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <SeedRow key={entry.type} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}
