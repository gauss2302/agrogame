/* eslint-disable @typescript-eslint/consistent-type-imports */
import { createServerFn } from '@tanstack/react-start'
import { count, eq } from 'drizzle-orm'
import { db } from '@/db'
import { deliveryOrders, farms, harvestHistory, plots } from '@/db/schema'
import { CROPS, CropType } from '@/models/crop'

const GRID_SIZE = 5
const TOTAL_PLOTS = GRID_SIZE * GRID_SIZE
const PLANT_COST = 5
const VIRTUAL_TO_REAL_RATIO = 100

// Get or create farm
export const getOrCreateFarm = createServerFn().handler(async () => {
  let farm = await db.query.farms.findFirst({ where: eq(farms.id, 1) })

  if (!farm) {
    const [newFarm] = await db
      .insert(farms)
      .values({
        name: 'My Farm',
        coins: 100,
        realCrops: 0,
      })
      .returning()
    farm = newFarm

    const plotsData = Array.from({ length: TOTAL_PLOTS }, (_, i) => ({
      farmId: farm!.id,
      position: i,
      crop: null,
      stage: 'empty' as const,
      plantedAt: null,
    }))
    await db.insert(plots).values(plotsData)
  }

  const farmPlots = await db.query.plots.findMany({
    where: eq(plots.farmId, farm.id),
    orderBy: (p, { asc }) => [asc(p.position)],
  })

  return { farm, plots: farmPlots }
})

// Plant a crop
export const plantCrop = createServerFn({ method: 'POST' })
  .inputValidator((d: { plotId: number; cropType: CropType }) => d)
  .handler(async ({ data }) => {
    const { plotId, cropType } = data

    const plot = await db.query.plots.findFirst({ where: eq(plots.id, plotId) })
    if (!plot) throw new Error('Plot not found')
    if (plot.stage !== 'empty') throw new Error('Plot is not empty')

    const farm = await db.query.farms.findFirst({
      where: eq(farms.id, plot.farmId),
    })
    if (!farm) throw new Error('Farm not found')
    if (farm.coins < PLANT_COST) throw new Error('Not enough coins')

    await db
      .update(farms)
      .set({ coins: farm.coins - PLANT_COST, updatedAt: new Date() })
      .where(eq(farms.id, farm.id))

    const [updatedPlot] = await db
      .update(plots)
      .set({
        crop: cropType,
        stage: 'planted',
        plantedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(plots.id, plotId))
      .returning()

    return { plot: updatedPlot, newCoins: farm.coins - PLANT_COST }
  })

// Update plot stage
export const updatePlotStage = createServerFn({ method: 'POST' })
  .inputValidator((d: { plotId: number; stage: 'growing' | 'ready' }) => d)
  .handler(async ({ data }) => {
    const { plotId, stage } = data

    const [updatedPlot] = await db
      .update(plots)
      .set({ stage, updatedAt: new Date() })
      .where(eq(plots.id, plotId))
      .returning()

    return { plot: updatedPlot }
  })

// Harvest a crop
export const harvestCrop = createServerFn({ method: 'POST' })
  .inputValidator((d: { plotId: number }) => d)
  .handler(async ({ data }) => {
    const { plotId } = data

    const plot = await db.query.plots.findFirst({ where: eq(plots.id, plotId) })
    if (!plot) throw new Error('Plot not found')
    if (plot.stage !== 'ready' || !plot.crop) throw new Error('Crop not ready')

    const farm = await db.query.farms.findFirst({
      where: eq(farms.id, plot.farmId),
    })
    if (!farm) throw new Error('Farm not found')

    const cropValue = CROPS[plot.crop].value
    const newCoins = farm.coins + cropValue
    const newRealCrops = farm.realCrops + 1

    const realProductsReady = Math.floor(newRealCrops / VIRTUAL_TO_REAL_RATIO)
    const virtualCropsRemaining = newRealCrops % VIRTUAL_TO_REAL_RATIO

    await db
      .update(farms)
      .set({ coins: newCoins, realCrops: newRealCrops, updatedAt: new Date() })
      .where(eq(farms.id, farm.id))

    await db.insert(harvestHistory).values({
      farmId: farm.id,
      cropType: plot.crop,
      coinsEarned: cropValue,
    })

    const [updatedPlot] = await db
      .update(plots)
      .set({
        crop: null,
        stage: 'empty',
        plantedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(plots.id, plotId))
      .returning()

    return {
      plot: updatedPlot,
      newCoins,
      totalVirtualHarvests: newRealCrops,
      realProductsReady,
      progressToNextReal: virtualCropsRemaining,
      harvestedCrop: plot.crop,
      earnedCoins: cropValue,
    }
  })

// Get delivery status
export const getDeliveryStatus = createServerFn().handler(async () => {
  const farm = await db.query.farms.findFirst({ where: eq(farms.id, 1) })
  if (!farm) return null

  const totalVirtual = farm.realCrops
  const realProductsReady = Math.floor(totalVirtual / VIRTUAL_TO_REAL_RATIO)
  const progressToNext = totalVirtual % VIRTUAL_TO_REAL_RATIO

  return {
    totalVirtualHarvests: totalVirtual,
    realProductsReady,
    progressToNextReal: progressToNext,
    percentToNext: Math.round((progressToNext / VIRTUAL_TO_REAL_RATIO) * 100),
  }
})

// Claim real products
export const claimRealProducts = createServerFn({ method: 'POST' })
  .inputValidator((d: { count: number }) => d)
  .handler(async ({ data }) => {
    const { count } = data

    const farm = await db.query.farms.findFirst({ where: eq(farms.id, 1) })
    if (!farm) throw new Error('Farm not found')

    const availableReal = Math.floor(farm.realCrops / VIRTUAL_TO_REAL_RATIO)
    if (count > availableReal) throw new Error('Not enough real products')

    const virtualToDeduct = count * VIRTUAL_TO_REAL_RATIO
    const newRealCrops = farm.realCrops - virtualToDeduct

    const [order] = await db
      .insert(deliveryOrders)
      .values({
        farmId: farm.id,
        quantity: count,
        virtualCropsUsed: virtualToDeduct,
        status: 'pending',
      })
      .returning()

    await db
      .update(farms)
      .set({ realCrops: newRealCrops, updatedAt: new Date() })
      .where(eq(farms.id, farm.id))

    return {
      orderId: order.id,
      claimed: count,
      remaining: Math.floor(newRealCrops / VIRTUAL_TO_REAL_RATIO),
      message: `🎉 Order #${order.id} created! ${count} real product(s) ready for delivery!`,
    }
  })

// Get harvest stats
export const getHarvestStats = createServerFn().handler(async () => {
  const potatoStats = await db
    .select({ count: count() })
    .from(harvestHistory)
    .where(eq(harvestHistory.cropType, 'potato'))

  const carrotStats = await db
    .select({ count: count() })
    .from(harvestHistory)
    .where(eq(harvestHistory.cropType, 'carrot'))

  return {
    potatoCount: potatoStats[0]?.count || 0,
    carrotCount: carrotStats[0]?.count || 0,
  }
})
