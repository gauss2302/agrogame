import React from 'react'

import type { DashboardField } from '@/src/server/dashboard'
import type { GrowthStage } from '@/models/crop'

const stageLabels: Record<GrowthStage, string> = {
  ready: 'Готово',
  growing: 'Растёт',
  planted: 'Посажено',
  empty: 'Пусто',
}

const stageClasses: Record<GrowthStage, string> = {
  ready: 'bg-orange-500',
  growing: 'bg-orange-300',
  planted: 'bg-orange-200',
  empty: 'bg-orange-50 border border-dashed border-orange-200',
}

const legendClasses: Record<GrowthStage, string> = {
  ready: 'bg-orange-500',
  growing: 'bg-orange-300',
  planted: 'bg-orange-200',
  empty: 'bg-orange-100',
}

const stageOrder: Array<GrowthStage> = ['ready', 'growing', 'planted', 'empty']

const FieldGrid = ({ field }: { field: DashboardField }) => (
  <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
    <div className="flex items-center justify-between mb-3 text-sm font-semibold text-gray-700">
      <div>{field.name}</div>
      <div className="text-xs font-medium text-gray-400">
        {field.plots.length} участков
      </div>
    </div>
    {field.plots.length > 0 ? (
      <div className="grid grid-cols-5 gap-1.5">
        {field.plots.map((plot) => (
          <div
            key={plot.id}
            className={`aspect-square rounded-md transition-colors ${stageClasses[plot.stage]}`}
            title={
              plot.crop
                ? `${plot.crop} - ${stageLabels[plot.stage]}`
                : stageLabels[plot.stage]
            }
          />
        ))}
      </div>
    ) : (
      <div className="text-center text-sm text-gray-400 py-6 border border-dashed border-gray-200 rounded-lg">
        Нет участков
      </div>
    )}
    <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-medium text-gray-500">
      {stageOrder.map((stage) => (
        <div key={stage} className="flex items-center gap-1">
          <span
            className={`w-2.5 h-2.5 rounded-sm ${legendClasses[stage]}`}
          ></span>
          {stageLabels[stage]}: {field.stageCounts[stage]}
        </div>
      ))}
    </div>
  </div>
)

export const FieldFarms = ({ fields }: { fields: Array<DashboardField> }) => {
  const totals = fields.reduce<Record<GrowthStage, number>>(
    (acc, field) => {
      stageOrder.forEach((stage) => {
        acc[stage] += field.stageCounts[stage]
      })
      return acc
    },
    { ready: 0, growing: 0, planted: 0, empty: 0 },
  )

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 col-span-2">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-gray-800">Все поля</h3>
        <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500">
          {stageOrder.map((stage) => (
            <div key={stage} className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-sm ${legendClasses[stage]}`}
              ></span>
              {stageLabels[stage]}: {totals[stage]}
            </div>
          ))}
        </div>
      </div>

      {fields.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-gray-500 text-sm">
          Поля еще не созданы. Зайдите в мини-игру, чтобы запустить ферму.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {fields.map((field) => (
            <FieldGrid key={field.id} field={field} />
          ))}
        </div>
      )}
    </div>
  )
}
