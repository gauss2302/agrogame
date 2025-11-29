import { useState } from 'react'
import { Sprout, Tractor, Coins } from 'lucide-react'
import { CropType, Plot, CROPS } from '../models/crop'

const GRID_SIZE = 5
const TOTAL_PLOTS = GRID_SIZE * GRID_SIZE

export default function Game() {
  const [grid, setGrid] = useState<Plot[]>(
    Array.from({ length: TOTAL_PLOTS }, (_, i) => ({
      id: i,
      crop: null,
      stage: 'empty',
      plantedAt: null,
    })),
  )
  const [selectedCrop, setSelectedCrop] = useState<CropType>('carrot')
  const [score, setScore] = useState(100)
  const [realCrops, setRealCrops] = useState(0)

  const plantCrop = (index: number) => {
    if (grid[index].stage !== 'empty') return
    if (score < 5) {
      alert('Not enough coins to plant!')
      return
    }

    setScore((prev) => prev - 5)

    const newGrid = [...grid]
    newGrid[index] = {
      ...newGrid[index],
      crop: selectedCrop,
      stage: 'planted',
      plantedAt: Date.now(),
    }
    setGrid(newGrid)

    // Simulate growth
    setTimeout(() => {
      setGrid((currentGrid) => {
        const updatedGrid = [...currentGrid]
        if (updatedGrid[index].stage === 'planted') {
          updatedGrid[index].stage = 'growing'
        }
        return updatedGrid
      })

      setTimeout(() => {
        setGrid((currentGrid) => {
          const updatedGrid = [...currentGrid]
          if (updatedGrid[index].stage === 'growing') {
            updatedGrid[index].stage = 'ready'
          }
          return updatedGrid
        })
      }, CROPS[selectedCrop].growTime / 2)
    }, CROPS[selectedCrop].growTime / 2)
  }

  const harvestCrop = (index: number) => {
    const plot = grid[index]
    if (plot.stage !== 'ready' || !plot.crop) return

    const cropValue = CROPS[plot.crop].value
    setScore((prev) => prev + cropValue)
    setRealCrops((prev) => prev + 1)

    const newGrid = [...grid]
    newGrid[index] = {
      id: index,
      crop: null,
      stage: 'empty',
      plantedAt: null,
    }
    setGrid(newGrid)
  }

  const handlePlotClick = (index: number) => {
    const plot = grid[index]
    if (plot.stage === 'empty') {
      plantCrop(index)
    } else if (plot.stage === 'ready') {
      harvestCrop(index)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full max-w-7xl mx-auto p-2 sm:p-4 items-start">
      {/* Game Board */}
      <div className="flex-1 bg-gradient-to-b from-[#7EC850] via-[#6AB43F] to-[#5DA036] p-4 sm:p-6 md:p-8 rounded-3xl border-4 border-white shadow-[0_10px_0_rgba(76,175,80,0.4),0_0_30px_rgba(76,175,80,0.2)] relative overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center justify-center">
        {/* White picket fence decoration */}
        <div className="absolute top-0 left-0 w-full h-3 bg-white opacity-80"></div>
        <div className="absolute bottom-0 left-0 w-full h-3 bg-white opacity-80"></div>
        <div className="absolute top-0 left-0 w-3 h-full bg-white opacity-80"></div>
        <div className="absolute top-0 right-0 w-3 h-full bg-white opacity-80"></div>
        <div className="absolute top-3 right-2 ">
          <img src="/game/farmer_house.png" width={240} height={240} />
        </div>

        {/* Isometric Grid Container - Mobile responsive */}
        <div className="relative w-full max-w-[800px] h-[550px] sm:h-[600px] flex items-center justify-center">
          <div
            className="relative w-full grid grid-cols-6 gap-1 sm:block sm:w-auto sm:gap-0 scale-[0.95] sm:scale-100 transition-transform duration-300"
            style={{
              transformOrigin: 'center center',
            }}
          >
            {grid.map((plot, i) => {
              // Calculate isometric coordinates
              const x = i % GRID_SIZE
              const y = Math.floor(i / GRID_SIZE)

              // Isometric projection
              // x-axis goes down-right, y-axis goes down-left
              const tileWidth = 150
              const tileHeight = 100
              const left = (x - y) * (tileWidth / 2) - 75 // Center offset
              const top = (x + y) * (tileHeight / 2) - 270
              const zIndex = x + y // Painter's algorithm

              return (
                <div
                  key={plot.id}
                  onClick={() => handlePlotClick(i)}
                  style={{
                    // Apply absolute positioning styles only when they matter (desktop)
                    // On mobile (static), left/top are ignored.
                    left: `${left}px`,
                    top: `${top}px`,
                    zIndex: zIndex,
                    width: `${tileWidth}px`,
                    height: `${tileWidth}px`, // Square container for the image, but positioned flattened
                  }}
                  className={`
                            relative sm:absolute cursor-pointer transition-transform duration-200
                            hover:-translate-y-2 hover:brightness-110
                            group
                            w-full aspect-square sm:w-[190px] sm:h-[190px] sm:aspect-auto
                        `}
                >
                  {/* Tile Image */}
                  <img
                    src="/game/field_ground.png"
                    alt="Ground"
                    className="hidden sm:block w-full h-full object-contain drop-shadow-xl scale-125"
                  />
                  <img
                    src="/game/field_ground_mobile.jpg"
                    alt="Ground"
                    className="block sm:hidden w-full h-full object-cover rounded-lg shadow-inner"
                  />

                  {/* Crop Image */}
                  {plot.crop && plot.stage !== 'empty' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <img
                        src={
                          plot.stage === 'planted'
                            ? '/game/early_ground.png'
                            : CROPS[plot.crop].image
                        }
                        alt={plot.crop}
                        className={`
                          w-[60%] h-[60%] object-contain drop-shadow-lg transition-all duration-500
                          ${plot.stage === 'planted' ? 'scale-75' : ''}
                          ${plot.stage === 'growing' ? 'scale-75' : ''}
                          ${plot.stage === 'ready' ? 'scale-100 animate-bounce-slow' : ''}
                          ${plot.stage !== 'planted' ? CROPS[plot.crop].className || '' : ''}
                        `}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      {/* Sidebar Controls */}
      <div className="w-full lg:w-80 flex flex-col gap-4 sm:gap-6">
        {/* Stats Card */}
        <div className="bg-gradient-to-br from-white via-[#FFFBEA] to-[#FFF4D1] rounded-3xl p-4 sm:p-6 shadow-[0_6px_0_rgba(255,193,7,0.3)] border-4 border-[#FFC107] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFD54F] rounded-full -translate-y-10 translate-x-10 opacity-50"></div>
          <h2 className="text-xl sm:text-2xl font-black text-[#F57C00] mb-3 sm:mb-4 flex items-center gap-2 relative z-10">
            <Tractor className="text-[#FF9800]" size={28} />
            Stats
          </h2>

          <div className="space-y-3 sm:space-y-4 relative z-10">
            <div className="bg-gradient-to-br from-[#FFF9C4] to-[#FFEB3B] p-3 sm:p-4 rounded-2xl border-3 border-white shadow-[0_4px_0_rgba(251,192,45,0.5)] relative overflow-hidden">
              <div className="absolute bottom-0 right-0 text-6xl opacity-10">
                💰
              </div>
              <div className="text-xs font-black text-[#F57F17] uppercase tracking-wider mb-1 relative z-10">
                💰 Coins
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#F57F17] flex items-center gap-2 drop-shadow-sm relative z-10">
                {score}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#C8E6C9] to-[#81C784] p-3 sm:p-4 rounded-2xl border-3 border-white shadow-[0_4px_0_rgba(76,175,80,0.5)] relative overflow-hidden">
              <div className="absolute bottom-0 right-0 text-6xl opacity-10">
                🌳
              </div>
              <div className="text-xs font-black text-[#1B5E20] uppercase tracking-wider mb-1 relative z-10">
                🌳 Real Impact
              </div>
              <div className="text-3xl sm:text-4xl font-black text-[#1B5E20] drop-shadow-sm relative z-10">
                {realCrops}
              </div>
              <div className="text-[10px] sm:text-xs font-bold text-[#2E7D32] mt-2 leading-tight relative z-10">
                *100 virtual crops = 1 real tree 🌲
              </div>
            </div>
          </div>
        </div>

        {/* Seed Selection */}
        <div className="bg-gradient-to-br from-white via-[#E8F5E9] to-[#C8E6C9] rounded-3xl p-4 sm:p-6 shadow-[0_6px_0_rgba(76,175,80,0.3)] border-4 border-[#4CAF50] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-24 h-24 bg-[#81C784] rounded-full -translate-y-12 -translate-x-12 opacity-30"></div>
          <h3 className="text-lg sm:text-xl font-black text-[#2E7D32] mb-3 sm:mb-4 uppercase flex items-center gap-2 relative z-10">
            <Sprout className="text-[#4CAF50]" size={24} />
            Seeds
          </h3>
          <div className="grid gap-2 sm:gap-3 relative z-10">
            {(Object.keys(CROPS) as CropType[]).map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`
                  flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl transition-all relative active:scale-95
                  ${
                    selectedCrop === crop
                      ? 'bg-gradient-to-r from-[#FFF9C4] to-[#FFEB3B] border-4 border-white shadow-[0_4px_0_rgba(251,192,45,0.5),0_0_20px_rgba(255,235,59,0.4)] scale-105'
                      : 'bg-white/80 border-3 border-[#E0E0E0] hover:bg-white hover:border-[#4CAF50] shadow-sm hover:shadow-md hover:scale-102'
                  }
                `}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl p-1 overflow-hidden shrink-0 border-2 border-white shadow-inner">
                  <img
                    src={CROPS[crop].image}
                    alt={crop}
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
                <div className="text-left flex-1">
                  <div className="font-black text-[#2E7D32] text-base sm:text-lg">
                    {CROPS[crop].name}
                  </div>
                  <div className="text-xs font-bold text-white bg-gradient-to-r from-[#FF9800] to-[#F57C00] inline-block px-2 py-0.5 rounded-full mt-1 shadow-sm">
                    💰 {CROPS[crop].value}
                  </div>
                </div>
                {selectedCrop === crop && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[#4CAF50] animate-bounce">
                    ✓
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
