import { createFileRoute } from '@tanstack/react-router'
import Game from '../components/Game'

export const Route = createFileRoute('/')({ component: App })

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] via-[#A8D8F0] to-[#90EE90] relative overflow-x-hidden">
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
        <div className="mt-4 sm:mt-8 mb-4 sm:mb-6 relative">
          <div className="bg-gradient-to-b from-white to-[#F0F8FF] px-6 sm:px-10 py-3 sm:py-5 rounded-3xl border-4 border-white shadow-[0_8px_0_rgba(70,130,180,0.3),0_0_20px_rgba(70,130,180,0.2)] relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-[#4CAF50] to-[#2E7D32] drop-shadow-[2px_2px_0_rgba(255,255,255,0.8)] tracking-tight text-center">
              🌾 My Farm 🌾
            </h1>
            <p className="text-center text-sm sm:text-base text-[#2E7D32] font-bold mt-1 sm:mt-2">
              Grow Virtual · Plant Real 🌱
            </p>
          </div>
        </div>

        <Game />
      </div>
    </div>
  )
}
