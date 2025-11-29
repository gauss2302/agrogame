import React from 'react'
import {
  LayoutDashboard,
  Wallet,
  CloudSun,
  Grid,
  Droplets,
  Sprout,
  Bug,
  Leaf,
  Tractor,
  Users,
  Settings,
  HelpCircle,
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
            General
          </h3>
          <nav className="space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center gap-3 px-4 py-3 bg-green-50 text-green-700 rounded-lg font-medium"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Wallet size={20} />
              Financial
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <CloudSun size={20} />
              Weather Forecast
            </a>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Management
          </h3>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Grid size={20} />
              Field
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Droplets size={20} />
              Water Usage
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Sprout size={20} />
              Harvest Plan
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Bug size={20} />
              Pest & Disease
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Leaf size={20} />
              Soil & Crop
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Tractor size={20} />
              Equipment
            </a>
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Others
          </h3>
          <nav className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Users size={20} />
              User Management
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <Settings size={20} />
              Settings
            </a>
            <a
              href="#"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg font-medium transition-colors"
            >
              <HelpCircle size={20} />
              Help Support
            </a>
          </nav>
        </div>
      </div>
    </div>
  )
}
