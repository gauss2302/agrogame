import React from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'

export const TopBar = () => {
  return (
    <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="relative w-96">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
        <input
          type="text"
          placeholder="Search Data..."
          className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/20"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-semibold text-gray-400 bg-white border border-gray-200 rounded">
            ⌘
          </kbd>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-xs font-semibold text-gray-400 bg-white border border-gray-200 rounded">
            K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-gray-600 hover:bg-gray-50 rounded-full transition-colors">
          <Bell size={24} />
          <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
        </button>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-800">James Mason</p>
            <p className="text-xs text-gray-500">Field Surveyor</p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  )
}
