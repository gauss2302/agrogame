import React from 'react'
import { ChevronRight } from 'lucide-react'

const SeedRow = ({
  name,
  count,
  total,
  color,
}: {
  name: string
  count: number
  total: number
  color: string
}) => {
  const percentage = (count / total) * 100

  return (
    <div className="py-3">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700 w-20">{name}</span>
        <div className="flex-1 mx-4 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${color}`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-gray-800">{count}</div>
          <div className="text-[10px] text-gray-400 font-medium">Seeds</div>
        </div>
      </div>
    </div>
  )
}

export const SeedsStock = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800">План посадки семян</h3>
        <button className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-gray-700">
          Все <ChevronRight size={14} />
        </button>
      </div>

      <div className="space-y-2">
        <SeedRow name="Помидоры" count={5} total={50} color="bg-red-500" />
        <SeedRow name="Рис" count={20} total={50} color="bg-red-500" />
        <SeedRow name="Капуста" count={50} total={100} color="bg-green-600" />
        <SeedRow name="Морковь" count={120} total={200} color="bg-green-600" />
        <SeedRow name="Картошка" count={205} total={250} color="bg-green-600" />
      </div>
    </div>
  )
}
