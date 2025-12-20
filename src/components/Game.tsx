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

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkSize = () => setIsDesktop(window.innerWidth >= 640)
    checkSize()
    window.addEventListener('resize', checkSize)
    return () => window.removeEventListener('resize', checkSize)
  }, [])

  return isDesktop
}

export default function Game({ onUpdate }: { onUpdate?: () => void }) {
  const [farm, setFarm] = useState<FarmData | null>(null)
  const [grid, setGrid] = useState<Array<PlotData>>([])
  const [selectedCrop, setSelectedCrop] = useState<CropType>('carrot')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [claimLoading, setClaimLoading] = useState(false)
  const [harvestingPlot, setHarvestingPlot] = useState<number | null>(null)
  const [plantingPlot, setPlantingPlot] = useState<number | null>(null)
  const [celebrationCoins, setCelebrationCoins] = useState<{id: number, value: number, x: number, y: number}[]>([])
  const isDesktop = useIsDesktop()

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
      setPlantingPlot(plot.id)

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

      setTimeout(() => setPlantingPlot(null), 600)

      if (onUpdate) {
        onUpdate()
      }
    } catch (err: any) {
      setPlantingPlot(null)
      showNotification(`❌ ${err.message}`)
    }
  }

  const handleHarvest = async (plot: PlotData) => {
    if (plot.stage !== 'ready' || !plot.crop) return

    try {
      setHarvestingPlot(plot.id)

      const result = await harvestCrop({ data: { plotId: plot.id } })

      // Add floating coin animation
      const newCoins = Array.from({ length: 5 }, (_, i) => ({
        id: Date.now() + i,
        value: result.earnedCoins,
        x: Math.random() * 100 - 50,
        y: Math.random() * 50,
      }))
      setCelebrationCoins(prev => [...prev, ...newCoins])

      // Remove coins after animation
      setTimeout(() => {
        setCelebrationCoins(prev => prev.filter(c => !newCoins.find(nc => nc.id === c.id)))
      }, 2000)

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

      let msg = `✨ Собрано ${CROPS[result.harvestedCrop].name}! (+${result.earnedCoins} монет)`
      if (result.realProductsReady > 0 && result.progressToNextReal === 0) {
        msg += ` 🎉 New real product ready!`
      }
      showNotification(msg)

      setTimeout(() => setHarvestingPlot(null), 600)

      // Trigger update callback
      if (onUpdate) {
        onUpdate()
      }
    } catch (err: any) {
      setHarvestingPlot(null)
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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-200 via-green-200 to-yellow-200 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(76,175,80,0.6)] border-4 border-white font-black text-green-900 animate-[slideDown_0.3s_ease-out,wiggle_0.5s_ease-in-out_0.3s_2] text-lg">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-[shimmer_1.5s_linear_infinite]" />
          <span className="relative z-10">{notification}</span>
        </div>
      )}

      {/* Floating Coins Animation */}
      {celebrationCoins.map(coin => (
        <div
          key={coin.id}
          className="fixed top-1/2 left-1/2 z-50 text-3xl font-black text-yellow-500 pointer-events-none animate-[floatUp_2s_ease-out_forwards] drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]"
          style={{
            transform: `translate(${coin.x}px, ${coin.y}px)`,
            textShadow: '2px 2px 4px rgba(0,0,0,0.3), 0 0 20px rgba(255,215,0,0.6)'
          }}
        >
          +{coin.value}💰
        </div>
      ))}

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

              const plotStyles = isDesktop
                ? {
                    left: `${left}px`,
                    top: `${top}px`,
                    zIndex: x + y,
                    width: `${tileWidth}px`,
                    height: `${tileWidth}px`,
                  }
                : {}

              return (
                <div
                  key={plot.id}
                  onClick={() => handlePlotClick(plot)}
                  style={plotStyles}
                  className={`relative sm:absolute cursor-pointer transition-all duration-300 w-full aspect-square sm:w-[190px] sm:h-[190px]
                    ${plot.stage === 'empty' ? 'hover:scale-110 hover:-translate-y-3 hover:brightness-110 hover:drop-shadow-[0_0_20px_rgba(139,195,74,0.8)]' : ''}
                    ${plot.stage === 'ready' ? 'hover:scale-105 hover:-translate-y-2' : ''}
                    ${plantingPlot === plot.id ? 'animate-[plant_0.6s_ease-out]' : ''}
                    ${harvestingPlot === plot.id ? 'animate-[harvest_0.6s_ease-out]' : ''}
                  `}
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

                  {/* Sparkle effects for ready crops */}
                  {plot.stage === 'ready' && (
                    <>
                      <div className="absolute top-0 left-1/4 text-2xl animate-[sparkle_1.5s_ease-in-out_infinite]">✨</div>
                      <div className="absolute top-1/4 right-1/4 text-2xl animate-[sparkle_1.5s_ease-in-out_infinite_0.5s]">⭐</div>
                      <div className="absolute bottom-1/4 left-1/3 text-xl animate-[sparkle_1.5s_ease-in-out_infinite_1s]">✨</div>
                      <div className="absolute inset-0 bg-yellow-200/20 blur-xl rounded-full animate-pulse pointer-events-none" />
                    </>
                  )}

                  {/* Glow effect for interactive plots */}
                  {plot.stage === 'empty' && (
                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-green-400/30 blur-lg animate-pulse pointer-events-none" />
                  )}

                  {plot.crop && plot.stage !== 'empty' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                      <img
                        src={
                          plot.stage === 'planted'
                            ? '/game/early_ground.png'
                            : CROPS[plot.crop].image
                        }
                        alt={plot.crop}
                        className={`w-[60%] h-[60%] object-contain drop-shadow-lg transition-all duration-700
                          ${plot.stage === 'planted' ? 'scale-50 opacity-70 animate-[grow_0.5s_ease-out]' : ''}
                          ${plot.stage === 'growing' ? 'scale-90 animate-[wiggle_2s_ease-in-out_infinite]' : ''}
                          ${plot.stage === 'ready' ? 'scale-110 animate-[bounce_1s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(139,195,74,0.8)]' : ''}
                          ${(plot.stage !== 'planted' && CROPS[plot.crop].className) || ''}`}
                        style={{
                          filter: plot.stage === 'ready' ? 'brightness(1.2) saturate(1.3)' : 'brightness(1)'
                        }}
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
            <div className="bg-gradient-to-br from-[#FFF9C4] to-[#FFEB3B] p-4 rounded-2xl border-2 border-white shadow-[0_0_20px_rgba(255,235,59,0.5)] relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-[shimmer_1.5s_linear_infinite]" />
              <div className="text-xs font-black text-[#F57F17] uppercase">
                💰 Монеты
              </div>
              <div className="text-4xl font-black text-[#F57F17] animate-[pulse_2s_ease-in-out_infinite] drop-shadow-[0_0_10px_rgba(245,127,23,0.4)]">
                {farm?.coins ?? 0}
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#C8E6C9] to-[#81C784] p-4 rounded-2xl border-2 border-white shadow-[0_0_20px_rgba(129,199,132,0.5)] relative overflow-hidden group hover:scale-105 transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 group-hover:animate-[shimmer_1.5s_linear_infinite]" />
              <div className="text-xs font-black text-[#1B5E20] uppercase">
                🌾 Игровой уражай
              </div>
              <div className="text-4xl font-black text-[#1B5E20] drop-shadow-[0_0_10px_rgba(27,94,32,0.4)]">
                {farm?.realCrops ?? 0}
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs font-bold text-[#2E7D32] mb-1">
                  <span>До настоящих продуктов</span>
                  <span className="animate-pulse">
                    {progressToNext}/{VIRTUAL_TO_REAL_RATIO}
                  </span>
                </div>
                <div className="h-3 bg-white/50 rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#4CAF50] via-[#66BB6A] to-[#8BC34A] transition-all duration-500 relative overflow-hidden shadow-[0_0_10px_rgba(76,175,80,0.6)]"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-40 animate-[shimmer_2s_linear_infinite]" />
                  </div>
                </div>
              </div>
            </div>

            {realProductsReady > 0 && (
              <div className="bg-gradient-to-br from-[#FFECB3] to-[#FFD54F] p-4 rounded-2xl border-4 border-white shadow-[0_0_30px_rgba(255,193,7,0.8),0_0_60px_rgba(255,152,0,0.4)] relative overflow-hidden animate-[wiggle_0.5s_ease-in-out_infinite]">
                <div className="absolute top-0 left-0 text-3xl animate-[sparkle_1s_ease-in-out_infinite]">🎉</div>
                <div className="absolute top-0 right-0 text-3xl animate-[sparkle_1s_ease-in-out_infinite_0.3s]">✨</div>
                <div className="absolute bottom-0 left-1/3 text-2xl animate-[sparkle_1s_ease-in-out_infinite_0.6s]">⭐</div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-[shimmer_2s_linear_infinite]" />
                <div className="flex items-center gap-2 mb-2 relative z-10">
                  <Gift className="text-[#E65100] animate-bounce" size={20} />
                  <span className="text-xs font-black text-[#E65100] uppercase">
                    Real Products Ready!
                  </span>
                </div>
                <div className="text-2xl font-black text-[#E65100] mb-2 relative z-10 drop-shadow-[0_0_10px_rgba(230,81,0,0.5)] animate-pulse">
                  {realProductsReady} 📦
                </div>
                <button
                  onClick={handleClaimProducts}
                  disabled={claimLoading}
                  className="relative z-10 w-full bg-gradient-to-r from-[#FF9800] to-[#F57C00] text-white font-black py-2 px-4 rounded-xl border-b-4 border-[#E65100] hover:brightness-110 hover:scale-105 hover:shadow-[0_0_20px_rgba(255,152,0,0.8)] active:border-b-0 active:translate-y-1 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Truck size={18} className="animate-bounce" />
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
                className={`relative flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 active:scale-95 overflow-hidden group
                  ${
                    selectedCrop === crop
                      ? 'bg-gradient-to-r from-[#FFF9C4] to-[#FFEB3B] border-4 border-white shadow-[0_0_20px_rgba(255,235,59,0.6)] scale-105'
                      : 'bg-white/80 border-2 border-gray-200 hover:border-[#4CAF50] hover:shadow-[0_0_15px_rgba(76,175,80,0.3)] hover:scale-102'
                  }`}
              >
                {selectedCrop === crop && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 animate-[shimmer_1.5s_linear_infinite]" />
                )}
                <div className={`w-14 h-14 bg-gradient-to-br from-[#E8F5E9] to-[#C8E6C9] rounded-xl p-1 border-2 border-white transition-transform ${selectedCrop === crop ? 'animate-bounce' : 'group-hover:scale-110'}`}>
                  <img
                    src={CROPS[crop].image}
                    alt={crop}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left flex-1 relative z-10">
                  <div className="font-black text-[#2E7D32] text-lg">
                    {CROPS[crop].name}
                  </div>
                  <div className="text-xs font-bold text-white bg-gradient-to-r from-[#FF9800] to-[#F57C00] inline-block px-2 py-0.5 rounded-full mt-1 shadow-md">
                    💰 +{CROPS[crop].value}
                  </div>
                </div>
                {selectedCrop === crop && (
                  <span className="text-[#4CAF50] text-2xl animate-[pulse_1s_ease-in-out_infinite] drop-shadow-[0_0_8px_rgba(76,175,80,0.8)] relative z-10">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -150%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(3deg); }
        }

        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }

        @keyframes floatUp {
          0% {
            transform: translate(var(--tx, 0), var(--ty, 0)) scale(0.5);
            opacity: 1;
          }
          50% {
            transform: translate(var(--tx, 0), calc(var(--ty, 0) - 80px)) scale(1.2);
            opacity: 1;
          }
          100% {
            transform: translate(var(--tx, 0), calc(var(--ty, 0) - 150px)) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes plant {
          0% { transform: scale(1.2) translateY(-20px); opacity: 0.5; }
          50% { transform: scale(0.9) translateY(5px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }

        @keyframes harvest {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.15) rotate(-5deg); }
          50% { transform: scale(1.3) rotate(5deg); opacity: 1; }
          75% { transform: scale(1.15) rotate(-3deg); opacity: 0.5; }
          100% { transform: scale(0.8) rotate(0deg); opacity: 0; }
        }

        @keyframes sparkle {
          0%, 100% {
            transform: scale(1) translateY(0);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.5) translateY(-10px);
            opacity: 1;
          }
        }

        @keyframes grow {
          0% {
            transform: scale(0) rotate(-45deg);
            opacity: 0;
          }
          60% {
            transform: scale(0.6) rotate(5deg);
            opacity: 0.8;
          }
          100% {
            transform: scale(0.5) rotate(0deg);
            opacity: 0.7;
          }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  )
}
