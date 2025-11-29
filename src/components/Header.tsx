import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import {
  ChevronDown,
  ChevronRight,
  Database,
  Home,
  Menu,
  Network,
  SquareFunction,
  StickyNote,
  X,
} from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [groupedExpanded, setGroupedExpanded] = useState<
    Record<string, boolean>
  >({})

  return (
    <>
      {/* Wooden Header Bar */}
      <header className="p-3 flex items-center bg-[#8B5E3C] border-b-4 border-[#5D4037] shadow-xl relative z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 bg-[#A1887F] hover:bg-[#D7CCC8] text-[#3E2723] rounded-lg border-2 border-[#5D4037] shadow-[0_2px_0_#3E2723] active:shadow-none active:translate-y-[2px] transition-all"
          aria-label="Open menu"
        >
          <Menu size={28} strokeWidth={3} />
        </button>

        <h1 className="ml-4 text-2xl font-black tracking-wider text-white drop-shadow-[2px_2px_0_#3E2723] flex items-center gap-2">
          <Link to="/" className="hover:scale-105 transition-transform">
            AgroGame
          </Link>
        </h1>

        <div className="ml-auto flex gap-2">
          <div className="bg-[#5D4037] px-3 py-1 rounded-full border-2 border-[#3E2723] text-amber-400 font-bold text-sm shadow-inner">
            v1.0
          </div>
        </div>
      </header>

      {/* Slide-out Menu (Wooden Panel Style) */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-[#8B5E3C] text-[#3E2723] border-r-4 border-[#5D4037] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundImage: 'url(/game/field_ground.png)',
          backgroundBlendMode: 'overlay',
          backgroundSize: '200px',
        }}
      >
        <div className="flex items-center justify-between p-4 border-b-4 border-[#5D4037] bg-[#8B5E3C]/90 backdrop-blur-sm">
          <h2 className="text-2xl font-black text-white drop-shadow-[2px_2px_0_#3E2723]">
            MENU
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 bg-[#FF5252] hover:bg-[#FF8A80] text-white rounded-lg border-2 border-[#B71C1C] shadow-[0_2px_0_#B71C1C] active:shadow-none active:translate-y-[2px] transition-all"
            aria-label="Close menu"
          >
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto space-y-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#FFF8E1] border-2 border-[#8D6E63] hover:bg-white hover:border-[#5D4037] hover:scale-[1.02] transition-all shadow-sm"
            activeProps={{
              className:
                'flex items-center gap-3 p-3 rounded-xl bg-[#FFECB3] border-2 border-[#FFA000] shadow-md scale-[1.02]',
            }}
          >
            <Home size={24} className="text-[#5D4037]" />
            <span className="font-bold text-lg">Farm</span>
          </Link>

          {/* Demo Links Start */}
          <div className="mt-4 mb-2 px-2 text-sm font-black text-[#5D4037]/70 uppercase tracking-widest">
            Dev Tools
          </div>

          <Link
            to="/demo/start/server-funcs"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#D7CCC8] border-2 border-[#8D6E63] hover:bg-[#EFEBE9] transition-all"
          >
            <SquareFunction size={20} />
            <span className="font-bold">Server Funcs</span>
          </Link>

          <Link
            to="/demo/start/api-request"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#D7CCC8] border-2 border-[#8D6E63] hover:bg-[#EFEBE9] transition-all"
          >
            <Network size={20} />
            <span className="font-bold">API Request</span>
          </Link>

          <div className="flex flex-row justify-between gap-2">
            <Link
              to="/demo/start/ssr"
              onClick={() => setIsOpen(false)}
              className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-[#D7CCC8] border-2 border-[#8D6E63] hover:bg-[#EFEBE9] transition-all"
            >
              <StickyNote size={20} />
              <span className="font-bold">SSR Demos</span>
            </Link>
            <button
              className="p-3 bg-[#D7CCC8] rounded-xl border-2 border-[#8D6E63] hover:bg-[#EFEBE9] transition-all"
              onClick={() =>
                setGroupedExpanded((prev) => ({
                  ...prev,
                  StartSSRDemo: !prev.StartSSRDemo,
                }))
              }
            >
              {groupedExpanded.StartSSRDemo ? (
                <ChevronDown size={20} />
              ) : (
                <ChevronRight size={20} />
              )}
            </button>
          </div>

          {groupedExpanded.StartSSRDemo && (
            <div className="flex flex-col ml-4 space-y-2 border-l-4 border-[#8D6E63] pl-2">
              <Link
                to="/demo/start/ssr/spa-mode"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg bg-[#EFEBE9] border border-[#BCAAA4] hover:bg-white"
              >
                <span className="font-bold text-sm">SPA Mode</span>
              </Link>

              <Link
                to="/demo/start/ssr/full-ssr"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg bg-[#EFEBE9] border border-[#BCAAA4] hover:bg-white"
              >
                <span className="font-bold text-sm">Full SSR</span>
              </Link>

              <Link
                to="/demo/start/ssr/data-only"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2 rounded-lg bg-[#EFEBE9] border border-[#BCAAA4] hover:bg-white"
              >
                <span className="font-bold text-sm">Data Only</span>
              </Link>
            </div>
          )}

          <Link
            to="/demo/drizzle"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#D7CCC8] border-2 border-[#8D6E63] hover:bg-[#EFEBE9] transition-all"
          >
            <Database size={20} />
            <span className="font-bold">Drizzle</span>
          </Link>

          <Link
            to="/demo/tanstack-query"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl bg-[#D7CCC8] border-2 border-[#8D6E63] hover:bg-[#EFEBE9] transition-all"
          >
            <Network size={20} />
            <span className="font-bold">TanStack Query</span>
          </Link>

          {/* Demo Links End */}
        </nav>
      </aside>
    </>
  )
}
