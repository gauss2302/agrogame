import { createFileRoute } from '@tanstack/react-router'

import { Sidebar } from '@/components/dashboard/Sidebar'
import { TopBar } from '@/components/dashboard/TopBar'
import { FieldFarms } from '@/components/dashboard/FieldFarms'
import { getDashboardData } from '@/src/server/dashboard'

export const Route = createFileRoute('/fields')({
  loader: () => getDashboardData(),
  component: FieldsPage,
})

function FieldsPage() {
  const data = Route.useLoaderData()

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar />

      <div className="flex-1 ml-64">
        <TopBar />

        <main className="p-8 bg-white min-h-[calc(100vh-80px)] space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wider">
                Управление полями
              </p>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">
                Все поля и участки
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Подробная информация о статусах каждого участка.
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Всего участков</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.fields.reduce((sum, field) => sum + field.plots.length, 0)}
              </p>
            </div>
          </div>

          <FieldFarms fields={data.fields} />

          <section className="bg-white p-6 rounded-2xl border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Детали по каждому полю
                </h2>
                <p className="text-sm text-gray-500">
                  Следите за балансом готовых, растущих и пустых участков.
                </p>
              </div>
            </div>

            {data.fields.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-500 text-sm">
                Пока нет доступных полей. Посадите культуры в мини-игре, чтобы
                начать отслеживание.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 uppercase text-xs tracking-wide">
                      <th className="py-3 pr-6 font-semibold">Поле</th>
                      <th className="py-3 pr-6 font-semibold">Всего участков</th>
                      <th className="py-3 pr-6 font-semibold">Готово</th>
                      <th className="py-3 pr-6 font-semibold">Растёт</th>
                      <th className="py-3 pr-6 font-semibold">Посажено</th>
                      <th className="py-3 pr-6 font-semibold">Пусто</th>
                      <th className="py-3 font-semibold">Прогресс</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-700">
                    {data.fields.map((field) => {
                      const total = field.plots.length || 1
                      const readyPercent = Math.round(
                        (field.stageCounts.ready / total) * 100,
                      )
                      const growingPercent = Math.round(
                        (field.stageCounts.growing / total) * 100,
                      )
                      const plantedPercent = Math.round(
                        (field.stageCounts.planted / total) * 100,
                      )

                      return (
                        <tr key={field.id}>
                          <td className="py-4 pr-6 font-semibold text-gray-900">
                            {field.name}
                          </td>
                          <td className="py-4 pr-6">{field.plots.length}</td>
                          <td className="py-4 pr-6 text-green-600 font-semibold">
                            {field.stageCounts.ready}
                          </td>
                          <td className="py-4 pr-6 text-amber-600 font-semibold">
                            {field.stageCounts.growing}
                          </td>
                          <td className="py-4 pr-6 text-orange-500 font-semibold">
                            {field.stageCounts.planted}
                          </td>
                          <td className="py-4 pr-6 text-gray-400 font-semibold">
                            {field.stageCounts.empty}
                          </td>
                          <td className="py-4">
                            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500"
                                style={{ width: `${readyPercent}%` }}
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                              <span className="text-green-600">
                                {readyPercent}% готово
                              </span>
                              <span className="text-amber-600">
                                {growingPercent}% растёт
                              </span>
                              <span className="text-orange-500">
                                {plantedPercent}% посажено
                              </span>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  )
}
