import React from 'react'
import {
  Bug,
  CloudSun,
  Droplets,
  Grid,
  HelpCircle,
  LayoutDashboard,
  Leaf,
  Settings,
  Sprout,
  Tractor,
  Users,
  Wallet,
} from 'lucide-react'
import { Link } from '@tanstack/react-router'

export const Sidebar = () => {
  return (
    <div className="w-64 bg-white h-screen border-r border-gray-100 flex flex-col p-6 fixed left-0 top-0 overflow-y-auto">
      <div className="flex items-center gap-2 mb-10">
        <div className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <span className="text-orange-500">❖</span> AgroDashboard
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Общее
          </h3>
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium"
            >
              <LayoutDashboard size={20} />
              Панель
            </Link>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Wallet size={20} />
              Финансы
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <CloudSun size={20} />
              Прогноз погоды
            </a>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Управление
          </h3>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Grid size={20} />
              Поля
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Droplets size={20} />
              Полив
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Sprout size={20} />
              План урожая
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Bug size={20} />
              Вредители
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Leaf size={20} />
              Почва и культуры
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Tractor size={20} />
              Оборудование
            </a>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Другое
          </h3>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Users size={20} />
              Пользователи
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Settings size={20} />
              Настройки
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <HelpCircle size={20} />
              Помощь
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}
