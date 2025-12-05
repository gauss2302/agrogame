import { createFileRoute, useRouter } from '@tanstack/react-router'
import { getHarvestStats } from '../src/server/farm'
import Game from '../components/Game'

export const Route = createFileRoute('/game')({
  component: App,
  loader: async () => {
    return await getHarvestStats()
  },
})

function App() {
  const { potatoCount, carrotCount } = Route.useLoaderData()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] via-[#A8D8F0] to-[#90EE90] relative overflow-x-hidden overflow-y-auto overscroll-y-none">
      {/* Animated Sky Elements - Optimized for Mobile */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Fluffy animated clouds - Reduced on mobile */}
        <div className="absolute top-10 left-[10%] w-24 sm:w-32 h-12 sm:h-16 bg-white rounded-full opacity-80 blur-sm animate-[float_20s_ease-in-out_infinite]" />
        <div className="hidden sm:block absolute top-10 left-[15%] w-24 h-12 bg-white rounded-full opacity-80 blur-sm animate-[float_18s_ease-in-out_infinite_0.5s]" />
        <div className="absolute top-24 right-[20%] w-28 sm:w-40 h-14 sm:h-20 bg-white rounded-full opacity-80 blur-sm animate-[float_22s_ease-in-out_infinite_1s]" />
        <div className="hidden sm:block absolute top-24 right-[25%] w-28 h-14 bg-white rounded-full opacity-80 blur-sm animate-[float_19s_ease-in-out_infinite_1.5s]" />
        <div className="hidden sm:block absolute top-40 left-[40%] w-36 h-18 bg-white rounded-full opacity-70 blur-sm animate-[float_25s_ease-in-out_infinite_2s]" />

        {/* Bright animated sun - Smaller on mobile */}
        <div className="absolute top-4 sm:top-8 right-4 sm:right-8 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-radial from-[#FFD700] via-[#FFA500] to-[#FF8C00] rounded-full shadow-[0_0_40px_15px_rgba(255,215,0,0.4)] sm:shadow-[0_0_60px_20px_rgba(255,215,0,0.4)]">
          <div className="absolute inset-2 sm:inset-3 bg-[#FFED4E] rounded-full animate-pulse" />
          {/* Sun rays - Reduced on mobile */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="hidden sm:block absolute top-1/2 left-1/2 w-2 h-8 bg-gradient-to-t from-yellow-300/60 to-transparent origin-bottom animate-[spin_8s_linear_infinite]"
              style={{
                transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        {/* Decorative birds - Hidden on mobile for performance */}
        <div className="hidden sm:block absolute top-32 left-1/4 text-2xl animate-[fly_15s_ease-in-out_infinite]">
          🐦
        </div>
        <div className="hidden sm:block absolute top-48 right-1/3 text-xl animate-[fly_18s_ease-in-out_infinite_2s]">
          🦋
        </div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-2 sm:px-4">
        {/* Enhanced Game Header - Mobile Optimized */}
        <header className="mt-3 sm:mt-8 mb-3 sm:mb-6 relative w-full max-w-4xl">
          <div className="flex flex-col items-center justify-center gap-3 sm:gap-4">
            {/* Main Title Card */}
            <div className="bg-gradient-to-b from-white via-[#F0F8FF] to-[#E8F5E9] px-4 sm:px-8 md:px-12 py-3 sm:py-4 md:py-6 rounded-2xl sm:rounded-3xl border-[4px] sm:border-[6px] border-white shadow-[0_8px_32px_rgba(70,130,180,0.3),0_4px_0_rgba(70,130,180,0.2)] sm:shadow-[0_12px_48px_rgba(70,130,180,0.3),0_8px_0_rgba(70,130,180,0.2)] relative overflow-hidden w-full">
              {/* Decorative sparkles - Smaller on mobile */}
              <div
                className="absolute top-1 sm:top-2 left-2 sm:left-4 text-lg sm:text-2xl animate-[spin_3s_linear_infinite]"
                aria-hidden="true"
              >
                ✨
              </div>
              <div
                className="absolute bottom-1 sm:bottom-2 right-2 sm:right-4 text-lg sm:text-2xl animate-[spin_4s_linear_infinite]"
                aria-hidden="true"
              >
                ⭐
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#4CAF50] via-[#66BB6A] to-[#2E7D32] drop-shadow-[2px_2px_0_rgba(255,255,255,0.8)] sm:drop-shadow-[3px_3px_0_rgba(255,255,255,0.8)] tracking-tight text-center relative z-10">
                🌾 Agro Farm 🌾
              </h1>
              <p className="text-center text-xs sm:text-sm md:text-lg text-[#2E7D32] font-bold mt-2 sm:mt-3 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap px-2">
                <span className="bg-gradient-to-r from-green-400 to-green-600 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md text-[11px] sm:text-sm">
                  🌱 Сажай в телефоне
                </span>
                <span className="text-green-700 hidden sm:inline">·</span>
                <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-md text-[11px] sm:text-sm">
                  🥕 Забирай с грядки
                </span>
              </p>
            </div>
          </div>
        </header>

        {/* Game Component */}
        <main className="w-full flex justify-center" role="main">
          <Game
            potatoCount={potatoCount}
            carrotCount={carrotCount}
            onUpdate={() => router.invalidate()}
          />
        </main>
      </div>

      {/* Custom animations - Mobile Optimized */}
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }

        @keyframes fly {
          0%,
          100% {
            transform: translateX(0px) translateY(0px);
          }
          50% {
            transform: translateX(30px) translateY(-15px);
          }
        }

        /* Touch optimization */
        @media (max-width: 640px) {
          * {
            -webkit-tap-highlight-color: transparent;
            -webkit-touch-callout: none;
          }

          /* Reduce animation complexity on mobile for performance */
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-15px);
            }
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  )
}
