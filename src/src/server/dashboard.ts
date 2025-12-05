import { createServerFn } from '@tanstack/react-start'
import { count, gte } from 'drizzle-orm'

import type { CropType, GrowthStage } from '@/models/crop'
import { CROPS, GAME_CONFIG } from '@/models/crop'
import { db } from '@/db'
import { cropCatalog, harvestHistory } from '@/db/schema'

type StageCounts = Record<GrowthStage, number>

interface FieldPlot {
  id: number
  position: number
  crop: CropType | null
  stage: GrowthStage
}

export interface DashboardField {
  id: number
  name: string
  stageCounts: StageCounts
  plots: Array<FieldPlot>
}

export interface HarvestCategoryStat {
  type: CropType
  name: string
  weight: number
  change: number
  harvests: number
}

export interface HarvestGrowthPoint {
  label: string
  value: number
}

export interface SeedStockEntry {
  type: CropType
  name: string
  planted: number
  capacity: number
  color: string
}

export interface TotalHarvestSummary {
  totalWeight: number
  comparisonPercent: number
  segments: Array<{
    type: CropType
    label: string
    value: number
    color: string
  }>
}

export interface DashboardData {
  fields: Array<DashboardField>
  harvestCategories: Array<HarvestCategoryStat>
  harvestGrowth: Array<HarvestGrowthPoint>
  seedsStock: Array<SeedStockEntry>
  totalHarvest: TotalHarvestSummary
}

const chartColorMap: Record<string, string> = {
  carrot: '#F97316',
  potato: '#2B7F9E',
  watermelon: '#22C55E',
}

const progressColorMap: Record<string, string> = {
  carrot: 'bg-orange-500',
  potato: 'bg-amber-600',
  watermelon: 'bg-green-600',
}

const ensureDate = (value: Date | string | null) => {
  if (!value) return null
  return value instanceof Date ? value : new Date(value)
}

const createStageCounts = (): StageCounts => ({
  empty: 0,
  planted: 0,
  growing: 0,
  ready: 0,
})

export const getDashboardData = createServerFn().handler(async () => {
  const cropRows = await db.select().from(cropCatalog)

  const cropInfoMap = new Map<CropType, { name: string; value: number }>()
  cropRows.forEach((crop) => {
    cropInfoMap.set(crop.type, { name: crop.name, value: crop.value })
  })

  if (cropInfoMap.size === 0) {
    for (const [type, info] of Object.entries(CROPS) as Array<
      [CropType, (typeof CROPS)[CropType]]
    >) {
      cropInfoMap.set(type, { name: info.name, value: info.value })
    }
  }

  const trackedCropTypes =
    cropInfoMap.size > 0
      ? Array.from(cropInfoMap.keys())
      : (Object.keys(CROPS) as Array<CropType>)

  const farmsWithPlots = await db.query.farms.findMany({
    orderBy: (farm, { asc }) => [asc(farm.id)],
    with: {
      plots: {
        orderBy: (plot, { asc }) => [asc(plot.position)],
      },
    },
  })

  const fields: Array<DashboardField> = farmsWithPlots.map((farm) => {
    const stageCounts = createStageCounts()

    farm.plots.forEach((plot) => {
      stageCounts[plot.stage] += 1
    })

    return {
      id: farm.id,
      name: farm.name,
      stageCounts,
      plots: farm.plots.map((plot) => ({
        id: plot.id,
        position: plot.position,
        crop: plot.crop,
        stage: plot.stage,
      })),
    }
  })

  const allPlots = farmsWithPlots.flatMap((farm) => farm.plots)
  const plotCapacity = Math.max(allPlots.length, GAME_CONFIG.TOTAL_PLOTS, 1)

  const seedsStock: Array<SeedStockEntry> = trackedCropTypes
    .map((type) => {
      const planted = allPlots.filter((plot) => plot.crop === type).length
      const info = cropInfoMap.get(type)
      return {
        type,
        name: info?.name ?? type,
        planted,
        capacity: plotCapacity,
        color: progressColorMap[type] ?? 'bg-gray-400',
      }
    })
    .sort((a, b) => b.planted - a.planted)

  const harvestAgg = await db
    .select({
      cropType: harvestHistory.cropType,
      harvestCount: count(),
    })
    .from(harvestHistory)
    .groupBy(harvestHistory.cropType)

  const harvestTotals = new Map<CropType, number>()
  harvestAgg.forEach((row) => {
    harvestTotals.set(row.cropType, Number(row.harvestCount))
  })

  const now = new Date()
  const monthsToShow = 6
  const monthDescriptors = Array.from({ length: monthsToShow }, (_, idx) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth() - (monthsToShow - 1 - idx),
      1,
    )
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      label: date.toLocaleString('en-US', { month: 'short' }),
      date,
    }
  })

  const earliestMonthStart = monthDescriptors[0]?.date ?? now
  const lastWeekStart = new Date(now)
  lastWeekStart.setDate(lastWeekStart.getDate() - 7)
  const twoWeeksAgo = new Date(lastWeekStart)
  twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 7)

  const monthlyCounts = new Map<string, number>(
    monthDescriptors.map(({ key }) => [key, 0]),
  )

  const weeklyBuckets = new Map<
    CropType,
    { current: number; previous: number }
  >()

  trackedCropTypes.forEach((type) => {
    weeklyBuckets.set(type, { current: 0, previous: 0 })
  })

  const recentHarvests = await db
    .select({
      cropType: harvestHistory.cropType,
      harvestedAt: harvestHistory.harvestedAt,
    })
    .from(harvestHistory)
    .where(gte(harvestHistory.harvestedAt, earliestMonthStart))

  recentHarvests.forEach((item) => {
    const dateValue = ensureDate(item.harvestedAt)
    if (!dateValue) return

    const monthKey = `${dateValue.getFullYear()}-${dateValue.getMonth()}`
    if (monthlyCounts.has(monthKey)) {
      monthlyCounts.set(monthKey, (monthlyCounts.get(monthKey) ?? 0) + 1)
    }

    if (dateValue >= twoWeeksAgo) {
      const bucketName = dateValue >= lastWeekStart ? 'current' : 'previous'
      const entry = weeklyBuckets.get(item.cropType)
      if (entry) {
        entry[bucketName] += 1
      } else {
        weeklyBuckets.set(item.cropType, {
          current: bucketName === 'current' ? 1 : 0,
          previous: bucketName === 'previous' ? 1 : 0,
        })
      }
    }
  })

  const harvestGrowth = monthDescriptors.map(({ key, label }) => ({
    label,
    value: monthlyCounts.get(key) ?? 0,
  }))

  const lastGrowth = harvestGrowth.at(-1)?.value ?? 0
  const prevGrowth = harvestGrowth.at(-2)?.value ?? 0
  const comparisonPercent =
    prevGrowth === 0
      ? lastGrowth > 0
        ? 100
        : 0
      : Math.round(((lastGrowth - prevGrowth) / prevGrowth) * 100)

  const harvestCategories = trackedCropTypes
    .map((type) => {
      const info = cropInfoMap.get(type)
      const harvests = harvestTotals.get(type) ?? 0
      const bucket = weeklyBuckets.get(type) ?? { current: 0, previous: 0 }
      const weight = Math.round(harvests * (info?.value ?? 1))
      const change =
        bucket.previous === 0
          ? bucket.current > 0
            ? 100
            : 0
          : Math.round(
              ((bucket.current - bucket.previous) / bucket.previous) * 100,
            )

      return {
        type,
        name: info?.name ?? type,
        weight,
        change,
        harvests,
      }
    })
    .sort((a, b) => b.harvests - a.harvests)

  const totalWeight = harvestCategories.reduce(
    (sum, entry) => sum + entry.weight,
    0,
  )

  const segments = harvestCategories
    .filter((entry) => entry.weight > 0)
    .map((entry) => ({
      type: entry.type,
      label: entry.name,
      value: entry.weight,
      color: chartColorMap[entry.type] ?? '#4B5563',
    }))

  const payload: DashboardData = {
    fields,
    harvestCategories,
    harvestGrowth,
    seedsStock,
    totalHarvest: {
      totalWeight,
      comparisonPercent,
      segments,
    },
  }

  return payload
})
