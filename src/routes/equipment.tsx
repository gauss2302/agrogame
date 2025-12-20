import { createFileRoute } from '@tanstack/react-router'
import {
  Activity,
  AlertTriangle,
  Battery,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Fuel,
  Settings,
  TrendingUp,
  Wrench,
} from 'lucide-react'

import type { EquipmentStatus } from '@/src/server/equipment'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'
import { getEquipmentData } from '@/src/server/equipment'

export const Route = createFileRoute('/equipment')({
  loader: () => getEquipmentData(),
  component: EquipmentPage,
})

const statusColors: Record<EquipmentStatus, string> = {
  operational: 'bg-green-50 text-green-700 border-green-200',
  maintenance: 'bg-amber-50 text-amber-700 border-amber-200',
  repair: 'bg-red-50 text-red-700 border-red-200',
  idle: 'bg-gray-50 text-gray-600 border-gray-200',
}

const statusLabels: Record<EquipmentStatus, string> = {
  operational: 'В работе',
  maintenance: 'ТО',
  repair: 'Ремонт',
  idle: 'Простой',
}

const statusIcons: Record<EquipmentStatus, React.ReactNode> = {
  operational: <CheckCircle2 size={16} className="text-green-500" />,
  maintenance: <Wrench size={16} className="text-amber-500" />,
  repair: <AlertTriangle size={16} className="text-red-500" />,
  idle: <Clock size={16} className="text-gray-400" />,
}

const priorityColors = {
  low: 'bg-blue-50 text-blue-700 border-blue-200',
  medium: 'bg-amber-50 text-amber-700 border-amber-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
}

const priorityLabels = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочно',
}

function EquipmentPage() {
  const data = Route.useLoaderData()

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar />
      <div className="flex-1 ml-64">
        <TopBar />

        <main className="p-8 bg-white min-h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <Settings className="text-orange-500" size={28} />
                Управление оборудованием
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Мониторинг техники и планирование обслуживания
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <Filter size={16} />
                Фильтр
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-[#2E5C46] text-white rounded-lg text-sm font-medium hover:bg-[#254a38] transition-colors shadow-sm">
                <Calendar size={16} />
                Запланировать ТО
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <Settings className="text-blue-500" size={28} />
                <TrendingUp className="text-blue-400" size={20} />
              </div>
              <div className="text-3xl font-black text-blue-900">
                {data.stats.totalEquipment}
              </div>
              <p className="text-sm font-semibold text-blue-700 mt-1">
                Единиц техники
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="flex items-center justify-between mb-3">
                <CheckCircle2 className="text-green-500" size={28} />
                <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  Активно
                </span>
              </div>
              <div className="text-3xl font-black text-green-900">
                {data.stats.operational}
              </div>
              <p className="text-sm font-semibold text-green-700 mt-1">
                В эксплуатации
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 border-2 border-amber-200">
              <div className="flex items-center justify-between mb-3">
                <Wrench className="text-amber-500" size={28} />
                <AlertTriangle className="text-amber-400" size={20} />
              </div>
              <div className="text-3xl font-black text-amber-900">
                {data.stats.needsMaintenance}
              </div>
              <p className="text-sm font-semibold text-amber-700 mt-1">
                На обслуживании
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="flex items-center justify-between mb-3">
                <Activity className="text-purple-500" size={28} />
                <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                  Средняя
                </span>
              </div>
              <div className="text-3xl font-black text-purple-900">
                {data.stats.avgEfficiency}%
              </div>
              <p className="text-sm font-semibold text-purple-700 mt-1">
                Эффективность
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Equipment List */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Парк техники
                  </h2>
                  <div className="text-sm text-gray-500">
                    Всего: {data.stats.totalHours.toLocaleString()} часов
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.equipment.map((equipment) => (
                    <div
                      key={equipment.id}
                      className="bg-white p-5 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="text-4xl">{equipment.icon}</div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-sm leading-tight">
                              {equipment.name}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {equipment.model}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-semibold border flex items-center gap-1 ${statusColors[equipment.status]}`}
                        >
                          {statusIcons[equipment.status]}
                          {statusLabels[equipment.status]}
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Clock size={14} className="text-gray-400" />
                            Наработка
                          </span>
                          <span className="font-bold text-gray-900">
                            {equipment.hoursUsed.toLocaleString()} ч
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Activity size={14} className="text-gray-400" />
                            Эффективность
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  equipment.efficiency >= 90
                                    ? 'bg-green-500'
                                    : equipment.efficiency >= 75
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                }`}
                                style={{ width: `${equipment.efficiency}%` }}
                              />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">
                              {equipment.efficiency}%
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 flex items-center gap-1.5">
                            <Fuel size={14} className="text-gray-400" />
                            Топливо
                          </span>
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  equipment.fuelLevel >= 70
                                    ? 'bg-green-500'
                                    : equipment.fuelLevel >= 30
                                      ? 'bg-amber-500'
                                      : 'bg-red-500'
                                }`}
                                style={{ width: `${equipment.fuelLevel}%` }}
                              />
                            </div>
                            <span className="font-bold text-gray-900 text-sm">
                              {equipment.fuelLevel}%
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-500">Локация:</span>
                            <span className="font-semibold text-gray-700">
                              {equipment.location}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs mt-1">
                            <span className="text-gray-500">Следующее ТО:</span>
                            <span className="font-semibold text-gray-700">
                              {equipment.nextMaintenance}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Utilization Chart */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Использование по типам
                </h3>
                <div className="space-y-3">
                  {data.utilizationByType.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-700">
                          {item.type}
                        </span>
                        <span className="text-sm font-bold text-gray-900">
                          {item.hours.toLocaleString()} ч ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Maintenance Schedule */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="text-orange-500" size={20} />
                  График обслуживания
                </h3>
                <div className="space-y-3">
                  {data.maintenanceSchedule.map((item, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-xl border-2 ${priorityColors[item.priority]}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase">
                          {priorityLabels[item.priority]}
                        </span>
                        <span className="text-xs font-semibold">
                          {item.dueDate}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">
                        {item.equipmentName}
                      </h4>
                      <p className="text-xs text-gray-600 mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <Wrench size={12} className="text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {item.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Battery className="text-green-500" size={20} />
                  Рекомендации
                </h3>
                <div className="space-y-3">
                  {data.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100"
                    >
                      <AlertTriangle
                        className="text-blue-500 shrink-0 mt-0.5"
                        size={16}
                      />
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Legend */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-lg">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Статусы оборудования
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">
                      В работе — активно используется
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wrench size={16} className="text-amber-500" />
                    <span className="text-sm text-gray-700">
                      ТО — плановое обслуживание
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <AlertTriangle size={16} className="text-red-500" />
                    <span className="text-sm text-gray-700">
                      Ремонт — требует починки
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-gray-400" />
                    <span className="text-sm text-gray-700">
                      Простой — не используется
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
