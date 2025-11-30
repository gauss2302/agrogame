import React from 'react'

const FieldGrid = ({
  name,
  status,
}: {
  name: string
  status: ('ready' | 'planted' | 'empty')[]
}) => {
  const getColor = (s: 'ready' | 'planted' | 'empty') => {
    switch (s) {
      case 'ready':
        return 'bg-orange-400'
      case 'planted':
        return 'bg-orange-200'
      case 'empty':
        return 'bg-orange-100'
    }
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100">
      <div className="bg-gray-50 rounded-lg p-2 mb-2 text-center text-xs font-medium text-gray-600">
        {name}
      </div>
      <div className="grid grid-cols-4 gap-1.5">
        {status.map((s, i) => (
          <div key={i} className={`aspect-square rounded-md ${getColor(s)}`} />
        ))}
      </div>
    </div>
  )
}

export const FieldFarms = () => {
  // Mock data generation
  const generateStatus = (): ('ready' | 'planted' | 'empty')[] => {
    return Array(12)
      .fill(0)
      .map(() => {
        const r = Math.random()
        if (r > 0.6) return 'ready'
        if (r > 0.3) return 'planted'
        return 'empty'
      })
  }

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800">Все поля</h3>
        <div className="flex gap-4 text-xs font-medium text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-400 rounded-sm"></span> Готово
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-200 rounded-sm"></span> Посажено
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 bg-orange-100 rounded-sm"></span> Пусто
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <FieldGrid name="Поле X" status={generateStatus()} />
        <FieldGrid name="Поле M" status={generateStatus()} />
        <FieldGrid name="Поле E" status={generateStatus()} />
        <FieldGrid name="Поле Z" status={generateStatus()} />
        <FieldGrid name="Поле K" status={generateStatus()} />
        <FieldGrid name="Поле A" status={generateStatus()} />
      </div>
    </div>
  )
}
