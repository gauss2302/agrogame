import { createFileRoute } from '@tanstack/react-router'

import { Calendar, Download, Filter } from 'lucide-react'
import { Sidebar } from '../components/dashboard/Sidebar'
import { TopBar } from '../components/dashboard/TopBar'
import { FieldFarms } from '../components/dashboard/FieldFarms'
import { HarvestCategories } from '../components/dashboard/HarvestCategories'
import { HarvestGrowth } from '../components/dashboard/HarvestGrowth'
import { SeedsStock } from '../components/dashboard/SeedsStock'
import { TotalHarvest } from '../components/dashboard/TotalHarvest'
import { AnalyticsChat } from '../components/dashboard/AnalyticsChat'
import { getDashboardData } from '@/src/server/dashboard'

export const Route = createFileRoute('/dashboard')({
  loader: () => getDashboardData(),
  staleTime: 0,
  gcTime: 0,
  component: Dashboard,
})

function Dashboard() {
  const data = Route.useLoaderData()

  return (
    <div className="flex min-h-screen bg-white font-sans">
      <Sidebar />

      <div className="flex-1 ml-64">
        <TopBar />

        <main className="p-8 bg-white min-h-[calc(100vh-80px)]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Панель управления
            </h1>

            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <Calendar size={16} />
                Последние 6 месяцев
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors">
                <Filter size={16} />
                Фильтр
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-[#2E5C46] text-white rounded-lg text-sm font-medium hover:bg-[#254a38] transition-colors shadow-sm">
                <Download size={16} />
                Скачать
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <FieldFarms fields={data.fields} />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HarvestCategories categories={data.harvestCategories} />
                <TotalHarvest data={data.totalHarvest} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <HarvestGrowth data={data.harvestGrowth} />
                <SeedsStock entries={data.seedsStock} />
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-8 h-[calc(100vh-120px)]">
                <AnalyticsChat />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
