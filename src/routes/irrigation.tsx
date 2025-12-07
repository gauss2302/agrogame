import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Droplets,
  Sparkles,
  TrendingUp,
  Waves,
} from 'lucide-react'

import type { GrowthStage } from '@/models/crop'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'

import { getIrrigationData, waterPlots } from '@/src/server/irrigation'

export const Route = createFileRoute('/irrigation')({
  loader: () => getIrrigationData(),
  component: IrrigationPage,
})

const moistureColor = (level: number) => {
  if (level >= 70) return 'bg-blue-500'
  if (level >= 50) return 'bg-cyan-500'
  if (level >= 30) return 'bg-amber-500'
  return 'bg-red-500'
}

const moistureTextColor = (level: number) => {
  if (level >= 70) return 'text-blue-600'
  if (level >= 50) return 'text-cyan-600'
  if (level >= 30) return 'text-amber-600'
  return 'text-red-600'
}

const stageColors: Record<GrowthStage, string> = {
  ready: 'border-green-400 bg-green-50',
  growing: 'border-amber-400 bg-amber-50',
  planted: 'border-orange-400 bg-orange-50',
  empty: 'border-gray-300 bg-gray-50',
}

function IrrigationPage() {
  const data = Route.useLoaderData()
  const router = useRouter()
  const [selectedPlots, setSelectedPlots] = useState<Set<number>>(new Set())
  const [isWatering, setIsWatering] = useState(false)

  const togglePlot = (plotId: number) => {
    const newSet = new Set(selectedPlots)
    if (newSet.has(plotId)) {
      newSet.delete(plotId)
    } else {
      newSet.add(plotId)
    }
    setSelectedPlots(newSet)
  }

  const selectAllNeedy = () => {
    const needyPlots = new Set<number>()
    data.fields.forEach((field) => {
      field.plots.forEach((plot) => {
        if (plot.needsWatering) {
          needyPlots.add(plot.id)
        }
      })
    })
    setSelectedPlots(needyPlots)
  }

  const handleWater = async () => {
    if (selectedPlots.size === 0) return

    setIsWatering(true)
    try {
      const result = await waterPlots({
        data: { plotIds: Array.from(selectedPlots) },
      })
      alert(result.message)
      setSelectedPlots(new Set())
      router.invalidate()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при поливе')
    } finally {
      setIsWatering(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />

        <main className="p-8 bg-white min-h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Droplets className="text-blue-500" />
                Система орошения
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Управление поливом и мониторинг влажности почвы
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={selectAllNeedy}
                className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-lg text-sm font-medium hover:bg-amber-100 transition-colors border border-amber-200"
              >
                <AlertCircle size={16} />
                Выбрать все ({data.stats.plotsNeedingWater})
              </button>

              <button
                onClick={handleWater}
                disabled={selectedPlots.size === 0 || isWatering}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Waves size={16} />
                {isWatering ? 'Поливаем...' : `Полить (${selectedPlots.size})`}
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <Droplets className="text-blue-500" size={28} />
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <div className="text-3xl font-black text-blue-900">
                {data.stats.averageMoisture}%
              </div>
              <p className="text-sm font-semibold text-blue-700 mt-1">
                Средняя влажность
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <AlertCircle className="text-amber-500" size={28} />
                <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
                  Требуют внимания
                </span>
              </div>
              <div className="text-3xl font-black text-amber-900">
                {data.stats.plotsNeedingWater}
              </div>
              <p className="text-sm font-semibold text-amber-700 mt-1">
                Участков нужен полив
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle2 className="text-green-500" size={28} />
                <Sparkles className="text-green-400" size={20} />
              </div>
              <div className="text-3xl font-black text-green-900">
                {data.stats.waterEfficiency}%
              </div>
              <p className="text-sm font-semibold text-green-700 mt-1">
                Эффективность
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <Waves className="text-purple-500" size={28} />
                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  Сегодня
                </span>
              </div>
              <div className="text-3xl font-black text-purple-900">
                {data.stats.totalWaterUsed}л
              </div>
              <p className="text-sm font-semibold text-purple-700 mt-1">
                Использовано воды
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fields Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Карта влажности полей
                </h2>

                {data.fields.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-500">
                    Нет активных полей. Посадите культуры, чтобы начать
                    мониторинг.
                  </div>
                ) : (
                  <div className="space-y-8">
                    {data.fields.map((field) => (
                      <div key={field.id} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                              {field.name}
                              {field.needsWatering > 0 && (
                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-semibold">
                                  {field.needsWatering} требуют полива
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-500">
                              Средняя влажность:{' '}
                              <span
                                className={`font-bold ${moistureTextColor(field.averageMoisture)}`}
                              >
                                {field.averageMoisture}%
                              </span>
                            </p>
                          </div>
                          <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${moistureColor(field.averageMoisture)} transition-all`}
                              style={{ width: `${field.averageMoisture}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                          {field.plots.map((plot) => (
                            <button
                              key={plot.id}
                              onClick={() =>
                                plot.stage !== 'empty' && togglePlot(plot.id)
                              }
                              disabled={plot.stage === 'empty'}
                              className={`relative aspect-square rounded-lg border-2 transition-all ${
                                stageColors[plot.stage]
                              } ${
                                selectedPlots.has(plot.id)
                                  ? 'ring-4 ring-blue-400 ring-offset-2'
                                  : ''
                              } ${
                                plot.stage === 'empty'
                                  ? 'cursor-not-allowed opacity-50'
                                  : 'cursor-pointer hover:scale-105'
                              }`}
                            >
                              {plot.stage !== 'empty' && (
                                <>
                                  <div className="absolute inset-0 flex flex-col items-center justify-center p-1">
                                    <Droplets
                                      size={16}
                                      className={moistureTextColor(
                                        plot.moistureLevel,
                                      )}
                                    />
                                    <span
                                      className={`text-xs font-bold ${moistureTextColor(plot.moistureLevel)}`}
                                    >
                                      {plot.moistureLevel}%
                                    </span>
                                  </div>
                                  {plot.needsWatering && (
                                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                                  )}
                                </>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Schedule */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock className="text-blue-500" size={20} />
                  График полива
                </h3>
                <div className="space-y-3">
                  {data.schedule.map((entry, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{entry.time}</p>
                        <p className="text-xs text-gray-600">
                          {entry.plotsToWater} участков
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-blue-700">
                          {entry.estimatedWater}л
                        </p>
                        <p className="text-xs text-gray-500">
                          {entry.fieldsToWater} полей
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Sparkles className="text-amber-500" size={20} />
                  Рекомендации
                </h3>
                <div className="space-y-3">
                  {data.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100"
                    >
                      <AlertCircle
                        className="text-amber-500 shrink-0 mt-0.5"
                        size={18}
                      />
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Уровни влажности
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-sm text-gray-700">
                      70-100% — Оптимально
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                    <span className="text-sm text-gray-700">
                      50-69% — Нормально
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-amber-500 rounded"></div>
                    <span className="text-sm text-gray-700">
                      30-49% — Внимание
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm text-gray-700">
                      0-29% — Критично
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
