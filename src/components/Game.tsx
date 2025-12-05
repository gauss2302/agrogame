import { useCallback, useEffect, useState } from 'react'
import { Gift, Sprout, Tractor, Truck } from 'lucide-react'
import { CROPS } from '../models/crop'
import type { CropType, GrowthStage } from '../models/crop'
import {
  claimRealProducts,
  getOrCreateFarm,
  harvestCrop,
  plantCrop,
  updatePlotStage,
} from '@/src/server/farm'

const GRID_SIZE = 5
const VIRTUAL_TO_REAL_RATIO = 100

interface PlotData {
  id: number
  position: number
  crop: CropType | null
  stage: GrowthStage
  plantedAt: string | null
}

interface FarmData {
  id: number
  coins: number
  realCrops: number
}

export default function Game({ onUpdate }: { onUpdate?: () => void }) {
  const [farm, setFarm] = useState<FarmData | null>(null)
  const [grid, setGrid] = useState<Array<PlotData>>([])
  const [selectedCrop, setSelectedCrop] = useState<CropType>('carrot')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [claimLoading, setClaimLoading] = useState(false)

  const loadFarm = useCallback(async () => {
    try {
      const data = await getOrCreateFarm()

      setFarm(data.farm)
      setGrid(data.plots as Array<PlotData>)

      // Resume growth timers
      data.plots.forEach((plot: any) => {
        if (
          plot.plantedAt &&
          plot.crop &&
          (plot.stage === 'planted' || plot.stage === 'growing')
        ) {
          resumeGrowth(plot.id, plot.crop, new Date(plot.plantedAt), plot.stage)
        }
      })
    } catch (err) {
      console.error('Failed to load farm:', err)
      setError(err instanceof Error ? err.message : 'Failed to connect')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadFarm()
  }, [loadFarm])

  const resumeGrowth = (
    plotId: number,
    cropType: CropType,
    plantedAt: Date,
    currentStage: GrowthStage,
  ) => {
    const growTime = CROPS[cropType].growTime
    const elapsed = Date.now() - plantedAt.getTime()
    const halfTime = growTime / 2

    if (currentStage === 'planted') {
      if (elapsed >= halfTime) {
        handleStageUpdate(plotId, 'growing')
        if (elapsed >= growTime) {
          setTimeout(() => handleStageUpdate(plotId, 'ready'), 100)
        } else {
          setTimeout(
            () => handleStageUpdate(plotId, 'ready'),
            growTime - elapsed,
          )
        }
      } else {
        setTimeout(() => {
          handleStageUpdate(plotId, 'growing')
          setTimeout(() => handleStageUpdate(plotId, 'ready'), halfTime)
        }, halfTime - elapsed)
      }
    } else if (currentStage === 'growing') {
      const remaining = growTime - elapsed
      if (remaining <= 0) {
        handleStageUpdate(plotId, 'ready')
      } else {
        setTimeout(() => handleStageUpdate(plotId, 'ready'), remaining)
      }
    }
  }

  const handleStageUpdate = async (
    plotId: number,
    stage: 'growing' | 'ready',
  ) => {
    try {
      await updatePlotStage({ data: { plotId, stage } })
      setGrid((prev) =>
        prev.map((p) => (p.id === plotId ? { ...p, stage } : p)),
      )
    } catch (err) {
      console.error('Failed to update stage:', err)
    }
  }

  const handlePlant = async (plot: PlotData) => {
    if (plot.stage !== 'empty') return
    if (!farm || farm.coins < 5) {
      showNotification('❌ Not enough coins to plant!')
      return
    }

    try {
      const result = await plantCrop({
        data: { plotId: plot.id, cropType: selectedCrop },
      })

      setFarm((prev) => (prev ? { ...prev, coins: result.newCoins } : null))
      setGrid((prev) =>
        prev.map((p) =>
          p.id === plot.id
            ? {
                ...p,
                crop: selectedCrop,
                stage: 'planted' as GrowthStage,
                plantedAt: new Date().toISOString(),
              }
            : p,
        ),
      )

      const growTime = CROPS[selectedCrop].growTime
      setTimeout(() => handleStageUpdate(plot.id, 'growing'), growTime / 2)
      setTimeout(() => handleStageUpdate(plot.id, 'ready'), growTime)

      showNotification(`🌱 Посажено ${CROPS[selectedCrop].name}!`)

      if (onUpdate) {
        onUpdate()
      }
    } catch (err: any) {
      showNotification(`❌ ${err.message}`)
    }
  }

  const handleHarvest = async (plot: PlotData) => {
    if (plot.stage !== 'ready' || !plot.crop) return

    try {
      const result = await harvestCrop({ data: { plotId: plot.id } })

      setFarm((prev) =>
        prev
          ? {
              ...prev,
              coins: result.newCoins,
              realCrops: result.totalVirtualHarvests,
            }
          : null,
      )

      setGrid((prev) =>
        prev.map((p) =>
          p.id === plot.id
            ? {
                ...p,
                crop: null,
                stage: 'empty' as GrowthStage,
                plantedAt: null,
              }
            : p,
        ),
      )

      let msg = `Собрано ${CROPS[result.harvestedCrop].name}! (+${result.earnedCoins} монет)`
      if (result.realProductsReady > 0 && result.progressToNextReal === 0) {
        msg += ` 🎉 New real product ready!`
      }
      showNotification(msg)

      // Trigger update callback
      if (onUpdate) {
        onUpdate()
      }
    } catch (err: any) {
      showNotification(`❌ ${err.message}`)
    }
  }

  const handlePlotClick = (plot: PlotData) => {
    if (plot.stage === 'empty') handlePlant(plot)
    else if (plot.stage === 'ready') handleHarvest(plot)
  }

  const handleClaimProducts = async () => {
    if (!farm) return
    const available = Math.floor(farm.realCrops / VIRTUAL_TO_REAL_RATIO)
    if (available <= 0) return

    setClaimLoading(true)
    try {
      const result = await claimRealProducts({ data: { count: available } })
      setFarm((prev) =>
        prev
          ? {
              ...prev,
              realCrops: prev.realCrops - available * VIRTUAL_TO_REAL_RATIO,
            }
          : null,
      )
      showNotification(result.message)
    } catch (err: any) {
      showNotification(`❌ ${err.message}`)
    } finally {
      setClaimLoading(false)
    }
  }

  const showNotification = (msg: string) => {
    setNotification(msg)
    setTimeout(() => setNotification(null), 3000)
  }

  const realProductsReady = farm
    ? Math.floor(farm.realCrops / VIRTUAL_TO_REAL_RATIO)
    : 0
  const progressToNext = farm ? farm.realCrops % VIRTUAL_TO_REAL_RATIO : 0
  const progressPercent = (progressToNext / VIRTUAL_TO_REAL_RATIO) * 100

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-2xl font-bold text-green-700 animate-pulse">
          Loading farm...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 p-4">
        <div className="text-2xl font-bold text-red-600">
          ⚠️ Connection Error
        </div>
        <div className="text-gray-600 max-w-md text-center">{error}</div>
        <div className="text-sm text-gray-500 max-w-md text-center bg-gray-100 p-4 rounded-lg">
          <p className="mb-2">Make sure PostgreSQL is running:</p>
          <code className="block bg-gray-200 p-2 rounded text-xs">
            docker-compose up -d && npx drizzle-kit push
          </code>
        </div>
        <button
          onClick={() => {
            setError(null)
            setLoading(true)
            loadFarm()
          }}
          className="mt-4 bg-green-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full max-w-7xl mx-auto p-2 sm:p-4 items-start">
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white px-6 py-3 rounded-2xl shadow-lg border-2 border-green-500 font-bold text-green-800 animate-bounce">
          {notification}
        </div>
      )}

      {/* Game Board */}
      <div className="flex-1 bg-gradient-to-b from-[#7EC850] via-[#6AB43F] to-[#5DA036] p-4 sm:p-6 md:p-8 rounded-3xl border-4 border-white shadow-[0_10px_0_rgba(76,175,80,0.4)] relative overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center justify-center">
        <div className="absolute top-0 left-0 w-full h-3 bg-white opacity-80" />
        <div className="absolute bottom-0 left-0 w-full h-3 bg-white opacity-80" />
        <div className="absolute top-0 left-0 w-3 h-full bg-white opacity-80" />
        <div className="absolute top-0 right-0 w-3 h-full bg-white opacity-80" />
        <div className="absolute top-3 right-2">
          <img src="/game/farmer_house.png" width={240} height={240} alt="" />
        </div>

        <div className="relative w-full max-w-[800px] h-[550px] sm:h-[600px] flex items-center justify-center">
          {/* Decorations */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute bottom-[-60px] left-0 w-full h-40 z-20 pointer-events-none">
              <img
                src="/game/grass/grass_long.png"
                alt=""
                className="hidden sm:block w-full h-full object-contain drop-shadow-2xl scale-110"
              />
            </div>

            <div className="absolute bottom-[-60px] left-95 w-full h-40 z-20 pointer-events-none">
              <img
                src="/game/grass/grass_long.png"
                alt=""
                className="hidden sm:block w-full h-full object-contain drop-shadow-2xl scale-110"
              />
            </div>

            <div className="absolute bottom-[-60px] right-95 w-full h-40 z-20 pointer-events-none">
              <img
                src="/game/grass/grass_long.png"
                alt=""
                className="hidden sm:block w-full h-full object-contain scale-110"
              />
            </div>
          </div>

          <div className="relative w-full grid grid-cols-5 gap-1 sm:block sm:w-auto">
            {grid.map((plot, i) => {
              const x = i % GRID_SIZE
              const y = Math.floor(i / GRID_SIZE)
              const tileWidth = 150
              const tileHeight = 100
              const left = (x - y) * (tileWidth / 2) - 75
              const top = (x + y) * (tileHeight / 2) - 270

              return (
                <div
                  key={plot.id}
                  onClick={() => handlePlotClick(plot)}
                  style={{
                    left: `${left}px`,
                    top: `${top}px`,
                    zIndex: x + y,
                    width: `${tileWidth}px`,
                    height: `${tileWidth}px`,
                  }}
                  className="relative sm:absolute cursor-pointer transition-transform duration-200 hover:-translate-y-2 hover:brightness-110 w-full aspect-square sm:w-[190px] sm:h-[190px]"
                >
                  <img
                    src="/game/field_ground.png"
                    alt=""
                    className="hidden sm:block w-full h-full object-contain drop-shadow-xl scale-125"
                  />
                  <img
                    src="/game/field_ground_mobile.jpg"
                    alt=""
                    className="block sm:hidden w-full h-full object-cover rounded-lg"
                  />

                  {plot.crop && plot.stage !== 'empty' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <img
                        src={
                          plot.stage === 'planted'
                            ? '/game/early_ground.png'
                            : CROPS[plot.crop].image
                        }
                        alt={plot.crop}
                        className={`w-[60%] h-[60%] object-contain drop-shadow-lg transition-all duration-500
                          ${plot.stage === 'planted' ? 'scale-75' : ''}
                          ${plot.stage === 'growing' ? 'scale-75' : ''}
                          ${plot.stage === 'ready' ? 'scale-100 animate-bounce' : ''}
                          ${(plot.stage !== 'planted' && CROPS[plot.crop].className) || ''}`}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full lg:w-80 flex flex-col gap-4 sm:gap-6">
        {/* Stats */}
        <div className="bg-gradient-to-br from-white via-[#FFFBEA] to-[#FFF4D1] rounded-3xl p-4 sm:p-6 shadow-[0_6px_0_rgba(255,193,7,0.3)] border-4 border-[#FFC107]">
          <h2 className="text-xl sm:text-2xl font-black text-[#F57C00] mb-4 flex items-center gap-2">
            <Tractor className="text-[#FF9800]" size={28} /> Статистика
          </h2>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#FFF9C4] to-[#FFEB3B] p-4 rounded-2xl border-2 border-white shadow-md">
              <div className="text-xs font-black text-[#F57F17] uppercase">
                💰 Монеты
              </div>
              <div className="text-4xl font-black text-[#F57F17]">
                {farm?.coins ?? 0}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#C8E6C9] to-[#81C784] p-4 rounded-2xl border-2 border-white shadow-md">
              <div className="text-xs font-black text-[#1B5E20] uppercase">
                🌾 Игровой уражай
              </div>
              <div className="text-4xl font-black text-[#1B5E20]">
                {farm?.realCrops ?? 0}
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold text-[#2E7D32] mb-1">
                  <span>До настоящих продуктов</span>
                  <span>
                    {progressToNext}/{VIRTUAL_TO_REAL_RATIO}
                  </span>
                </div>
                <div className="h-3 bg-white/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {realProductsReady > 0 && (
              <div className="bg-gradient-to-br from-[#FFECB3] to-[#FFD54F] p-4 rounded-2xl border-2 border-white shadow-md animate-pulse">
                <div className="flex items-center gap-2 mb-2">
                  <Gift className="text-[#E65100]" size={20} />
                  <span className="text-xs font-black text-[#E65100] uppercase">
                    Real Products Ready!
                  </span>
                </div>
                <div className="text-2xl font-black text-[#E65100] mb-2">
                  {realProductsReady} 📦
                </div>
                <button
                  onClick={handleClaimProducts}
                  disabled={claimLoading}
                  className="w-full bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white font-black py-2 px-4 rounded-xl border-b-4 border-[#E65100] hover:brightness-110 active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Truck size={18} />
                  {claimLoading ? 'Claiming...' : 'Claim for Delivery'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Seeds */}
        <div className="bg-gradient-to-br from-white via-[#E8F5E9] to-[#C8E6C9] rounded-3xl p-4 sm:p-6 shadow-[0_6px_0_rgba(76,175,80,0.3)] border-4 border-[#4CAF50]">
          <h3 className="text-lg sm:text-xl font-black text-[#2E7D32] mb-4 flex items-center gap-2">
            <Sprout className="text-[#4CAF50]" size={24} /> Семена (Цена: 5 💰)
          </h3>
          <div className="grid gap-3">
            {(Object.keys(CROPS) as Array<CropType>).map((crop) => (
              <button
                key={crop}
                onClick={() => setSelectedCrop(crop)}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all active:scale-95
                  ${
                    selectedCrop === crop
                      ? 'bg-gradient-to-r from-[#FFF9C4] to-[#FFEB3B] border-4 border-white shadow-lg scale-105'
                      : 'bg-white/80 border-2 border-gray-200 hover:border-[#4CAF50]'
                  }`}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl p-1 border-2 border-white">
                  <img
                    src={CROPS[crop].image}
                    alt={crop}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left flex-1">
                  <div className="font-black text-[#2E7D32] text-lg">
                    {CROPS[crop].name}
                  </div>
                  <div className="text-xs font-bold text-white bg-gradient-to-r from-[#FF9800] to-[#F57C00] inline-block px-2 py-0.5 rounded-full mt-1">
                    💰 +{CROPS[crop].value}
                  </div>
                </div>
                {selectedCrop === crop && (
                  <span className="text-[#4CAF50] text-xl">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
