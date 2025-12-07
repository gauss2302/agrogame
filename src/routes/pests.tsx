import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import {
  Activity,
  AlertTriangle,
  Bug,
  CheckCircle2,
  Info,
  Shield,
  TrendingDown,
  TrendingUp,
  Zap,
} from 'lucide-react'

import type { GrowthStage } from '@/models/crop'
import type { PestSeverity, PestType } from '@/src/server/pests'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'
import { applyTreatment, getPestManagementData } from '@/src/server/pests'

export const Route = createFileRoute('/pests')({
  loader: () => getPestManagementData(),
  component: PestManagementPage,
})

const severityColors: Record<PestSeverity, string> = {
  none: 'bg-gray-100 text-gray-600',
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  critical: 'bg-red-50 text-red-700 border-red-200',
}

const severityLabels: Record<PestSeverity, string> = {
  none: 'Нет угрозы',
  low: 'Низкая',
  medium: 'Средняя',
  high: 'Высокая',
  critical: 'Критическая',
}

const stageColors: Record<GrowthStage, string> = {
  ready: 'bg-green-500',
  growing: 'bg-green-300',
  planted: 'bg-green-200',
  empty: 'bg-gray-100',
}

function PestManagementPage() {
  const data = Route.useLoaderData()
  const router = useRouter()
  const [selectedPest, setSelectedPest] = useState<PestType | null>(null)
  const [isTreating, setIsTreating] = useState(false)

  const handleTreatment = async (pestType: PestType) => {
    const affectedFieldIds = data.fields
      .filter((field) =>
        field.plots.some((plot) =>
          plot.pests.some((pest) => pest.type === pestType),
        ),
      )
      .map((field) => field.id)

    if (affectedFieldIds.length === 0) {
      alert('Нет полей, зараженных этим вредителем')
      return
    }

    setIsTreating(true)
    try {
      const result = await applyTreatment({
        data: { fieldIds: affectedFieldIds, pestType },
      })
      alert(result.message)
      router.invalidate()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Ошибка при обработке')
    } finally {
      setIsTreating(false)
    }
  }

  const TrendIcon =
    data.stats.threatTrend === 'increasing'
      ? TrendingUp
      : data.stats.threatTrend === 'decreasing'
        ? TrendingDown
        : Activity

  const trendColor =
    data.stats.threatTrend === 'increasing'
      ? 'text-red-500'
      : data.stats.threatTrend === 'decreasing'
        ? 'text-green-500'
        : 'text-amber-500'

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />

        <main className="p-8 bg-white min-h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                Мониторинг вредителей
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Система раннего обнаружения и контроля вредителей
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium text-gray-600">
                <TrendIcon size={16} className={trendColor} />
                <span>
                  {data.stats.threatTrend === 'increasing' && 'Угроза растет'}
                  {data.stats.threatTrend === 'stable' && 'Стабильно'}
                  {data.stats.threatTrend === 'decreasing' &&
                    'Угроза снижается'}
                </span>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Критических участков
                </span>
                <div className="p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="text-red-500" size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {data.stats.criticalPlots}
              </div>
              <div className="mt-2 text-xs text-red-600 font-medium bg-red-50 inline-block px-2 py-1 rounded-full">
                Требует внимания
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Обнаружено вредителей
                </span>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Bug className="text-amber-500" size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {data.stats.totalDetections}
              </div>
              <div className="mt-2 text-xs text-amber-600 font-medium bg-amber-50 inline-block px-2 py-1 rounded-full">
                Активность
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Частый вредитель
                </span>
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Zap className="text-purple-500" size={20} />
                </div>
              </div>
              <div className="flex items-center gap-2">
                {data.stats.mostCommonPest && (
                  <span className="text-2xl">
                    {data.pestGuide[data.stats.mostCommonPest].icon}
                  </span>
                )}
                <div className="text-lg font-bold text-gray-900 truncate">
                  {data.stats.mostCommonPest
                    ? data.pestGuide[data.stats.mostCommonPest].nameRu
                    : 'Нет данных'}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">
                  Здоровых участков
                </span>
                <div className="p-2 bg-green-50 rounded-lg">
                  <Shield className="text-green-500" size={20} />
                </div>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {data.fields.reduce((sum, f) => sum + f.totalPlots, 0) -
                  data.fields.reduce((sum, f) => sum + f.infectedPlots, 0)}
              </div>
              <div className="mt-2 text-xs text-green-600 font-medium bg-green-50 inline-block px-2 py-1 rounded-full">
                Под защитой
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Fields Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-6">
                  Карта заражения полей
                </h2>

                {data.fields.length === 0 ? (
                  <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-500 text-sm">
                    Нет активных полей для мониторинга.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.fields.map((field) => (
                      <div
                        key={field.id}
                        className="bg-white p-4 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-gray-900">
                                {field.name}
                              </h3>
                              <span
                                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${severityColors[field.threatLevel]}`}
                              >
                                {severityLabels[field.threatLevel]}
                              </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-1">
                              {field.infectedPlots} из {field.totalPlots}{' '}
                              заражено
                            </p>
                          </div>
                          <div className="flex -space-x-2">
                            {field.dominantPests.slice(0, 3).map((pest) => (
                              <div
                                key={pest.type}
                                className="w-8 h-8 rounded-full bg-gray-50 border-2 border-white flex items-center justify-center text-lg shadow-sm"
                                title={`${data.pestGuide[pest.type].nameRu}: ${pest.count}`}
                              >
                                {data.pestGuide[pest.type].icon}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5">
                          {field.plots.map((plot) => (
                            <button
                              key={plot.id}
                              onClick={() =>
                                plot.pests.length > 0 &&
                                setSelectedPest(plot.pests[0].type)
                              }
                              disabled={plot.stage === 'empty'}
                              className={`relative aspect-square rounded-md transition-all ${
                                stageColors[plot.stage]
                              } ${
                                plot.stage === 'empty'
                                  ? 'cursor-not-allowed opacity-50 border border-dashed border-gray-200'
                                  : 'cursor-pointer hover:opacity-80'
                              }`}
                            >
                              {plot.pests.length > 0 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      plot.overallThreat === 'critical' ||
                                      plot.overallThreat === 'high'
                                        ? 'bg-red-500 animate-pulse'
                                        : plot.overallThreat === 'medium'
                                          ? 'bg-amber-500'
                                          : 'bg-green-500'
                                    }`}
                                  />
                                </div>
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
              {/* Recommendations */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Рекомендации
                </h3>
                <div className="space-y-4">
                  {data.recommendations.length === 0 ? (
                    <div className="text-center py-8 text-gray-400 text-sm">
                      <CheckCircle2 className="mx-auto mb-2 text-green-500" />
                      Все чисто
                    </div>
                  ) : (
                    data.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="pb-4 border-b border-gray-50 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl shrink-0">
                            {data.pestGuide[rec.pest].icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-bold text-gray-900">
                                {data.pestGuide[rec.pest].nameRu}
                              </span>
                              {rec.priority === 'urgent' && (
                                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                  СРОЧНО
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 leading-relaxed mb-2">
                              {rec.action}
                            </p>
                            <button
                              onClick={() => handleTreatment(rec.pest)}
                              disabled={isTreating}
                              className="w-full text-xs font-semibold bg-gray-900 text-white py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                              Обработать
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Pest Guide */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm max-h-[500px] overflow-y-auto">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Info size={16} className="text-gray-400" />
                  Справочник
                </h3>
                <div className="space-y-2">
                  {(
                    Object.entries(data.pestGuide) as Array<
                      [PestType, (typeof data.pestGuide)[PestType]]
                    >
                  ).map(([type, info]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedPest(type)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        selectedPest === type
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-transparent hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">
                            {info.nameRu}
                          </div>
                          <div className="text-xs text-gray-500 truncate max-w-[150px]">
                            {info.treatment}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
