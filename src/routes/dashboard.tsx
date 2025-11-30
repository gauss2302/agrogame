import { createFileRoute } from '@tanstack/react-router'
import { Sidebar } from '../components/dashboard/Sidebar'
import { TopBar } from '../components/dashboard/TopBar'
import { FieldFarms } from '../components/dashboard/FieldFarms'
import { HarvestCategories } from '../components/dashboard/HarvestCategories'
import { HarvestGrowth } from '../components/dashboard/HarvestGrowth'
import { SeedsStock } from '../components/dashboard/SeedsStock'
import { TotalHarvest } from '../components/dashboard/TotalHarvest'
import { Calendar, Download, Filter } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
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
                <Calendar size={16} />1 Окт - 15 Окт 2023
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

          <div className="grid grid-cols-3 gap-6 mb-6">
            <FieldFarms />
            <HarvestCategories />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <HarvestGrowth />
            <SeedsStock />
            <TotalHarvest />
          </div>
        </main>
      </div>
    </div>
  )
}
