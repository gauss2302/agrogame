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
    <div className="h-screen bg-gradient-to-b from-[#87CEEB] via-[#A8D8F0] to-[#90EE90] relative overflow-x-hidden overflow-y-auto overscroll-y-none">
      {/* Fluffy clouds */}
      <div className="absolute top-10 left-[10%] w-32 h-16 bg-white rounded-full opacity-80 blur-sm"></div>
      <div className="absolute top-10 left-[15%] w-24 h-12 bg-white rounded-full opacity-80 blur-sm"></div>
      <div className="absolute top-24 right-[20%] w-40 h-20 bg-white rounded-full opacity-80 blur-sm"></div>
      <div className="absolute top-24 right-[25%] w-28 h-14 bg-white rounded-full opacity-80 blur-sm"></div>

      {/* Bright sun */}
      <div className="absolute top-8 right-8 w-20 h-20 bg-gradient-radial from-[#FFD700] to-[#FFA500] rounded-full shadow-[0_0_40px_10px_rgba(255,215,0,0.4)]">
        <div className="absolute inset-2 bg-[#FFED4E] rounded-full animate-pulse"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col items-center px-2 sm:px-4">
        {/* Casual game style header */}
        <div className="mt-4 sm:mt-8 mb-4 sm:mb-6 relative w-full max-w-4xl">
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Main Title */}
            <div className="bg-gradient-to-b from-white to-[#F0F8FF] px-6 sm:px-10 py-3 sm:py-5 rounded-3xl border-4 border-white shadow-[0_8px_0_rgba(70,130,180,0.3),0_0_20px_rgba(70,130,180,0.2)] relative z-10">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#4CAF50] to-[#2E7D32] drop-shadow-[2px_2px_0_rgba(255,255,255,0.8)] tracking-tight text-center">
                🌾 Agro Farm 🌾
              </h1>
              <p className="text-center text-sm sm:text-base text-[#2E7D32] font-bold mt-1 sm:mt-2">
                Сажай в телефоне · Забирай с грядки 🌱
              </p>
            </div>
          </div>
        </div>

        <Game onUpdate={() => router.invalidate()} />

        {/* Stats Panel - Moved below game */}
        <div className="mt-8 mb-12 w-full max-w-4xl px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12">
            {/* Potato Stats */}
            <div className="flex items-center bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl border-4 border-[#8B4513] shadow-[0_4px_0_rgba(139,69,19,0.2)] transform hover:scale-105 transition-transform duration-300">
              <img
                src="/game/potato/potato_stat.png"
                alt="Potato Harvests"
                className="w-16 h-16 object-contain mr-4 drop-shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#8B4513] uppercase tracking-wider">
                  Картошка
                </span>
                <span className="text-3xl font-black text-[#8B4513]">
                  {potatoCount}
                </span>
              </div>
            </div>

            {/* Carrot Stats */}
            <div className="flex items-center bg-white/90 backdrop-blur-sm px-6 py-3 rounded-2xl border-4 border-[#E65100] shadow-[0_4px_0_rgba(230,81,0,0.2)] transform hover:scale-105 transition-transform duration-300">
              <div className="flex flex-col items-end mr-4">
                <span className="text-sm font-bold text-[#E65100] uppercase tracking-wider">
                  Морковь
                </span>
                <span className="text-3xl font-black text-[#E65100]">
                  {carrotCount}
                </span>
              </div>
              <img
                src="/game/carrot/carrot_stat.png"
                alt="Carrot Harvests"
                className="w-16 h-16 object-contain drop-shadow-md"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
