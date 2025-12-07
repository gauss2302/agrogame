import { createServerFn } from '@tanstack/react-start'

import type { CropType, GrowthStage } from '@/models/crop'
import { CROPS } from '@/models/crop'
import { db } from '@/db'

interface PlotMoisture {
  id: number
  position: number
  crop: CropType | null
  stage: GrowthStage
  moistureLevel: number // 0-100
  lastWatered: Date | null
  needsWatering: boolean
}

interface FieldIrrigation {
  id: number
  name: string
  averageMoisture: number
  totalPlots: number
  needsWatering: number
  plots: Array<PlotMoisture>
}

interface WaterScheduleEntry {
  time: string
  fieldsToWater: number
  plotsToWater: number
  estimatedWater: number // liters
}

interface IrrigationStats {
  totalWaterUsed: number // liters today
  averageMoisture: number
  plotsNeedingWater: number
  waterEfficiency: number // percentage
}

export interface IrrigationData {
  fields: Array<FieldIrrigation>
  schedule: Array<WaterScheduleEntry>
  stats: IrrigationStats
  recommendations: Array<string>
}

// Calculate moisture level based on crop type, stage, and time since planting
const calculateMoistureLevel = (
  crop: CropType | null,
  stage: GrowthStage,
  plantedAt: Date | null,
): number => {
  if (stage === 'empty' || !crop || !plantedAt) {
    return Math.floor(Math.random() * 30) + 20 // 20-50% for empty plots
  }

  const now = Date.now()
  const timeSincePlanted = now - new Date(plantedAt).getTime()
  const cropData = CROPS[crop]
  const growProgress = Math.min(timeSincePlanted / cropData.growTime, 1)

  // Different stages have different water needs
  let baseMoisture = 80
  if (stage === 'planted') {
    baseMoisture = 90 - growProgress * 20 // 90% -> 70%
  } else if (stage === 'growing') {
    baseMoisture = 70 - growProgress * 10 // 70% -> 60%
  } else if (stage === 'ready') {
    baseMoisture = 60 - growProgress * 10 // 60% -> 50%
  }

  // Add some randomness
  const variation = Math.random() * 10 - 5
  return Math.max(0, Math.min(100, Math.floor(baseMoisture + variation)))
}

// Determine if plot needs watering based on crop and moisture
const needsWatering = (
  crop: CropType | null,
  stage: GrowthStage,
  moisture: number,
): boolean => {
  if (stage === 'empty') return false

  // Different crops have different thresholds
  const thresholds: Record<CropType, number> = {
    carrot: 55,
    potato: 60,
    watermelon: 70, // Watermelon needs more water
  }

  const threshold = crop ? thresholds[crop] : 50
  return moisture < threshold
}

export const getIrrigationData = createServerFn().handler(async () => {
  const farmsWithPlots = await db.query.farms.findMany({
    orderBy: (farm, { asc }) => [asc(farm.id)],
    with: {
      plots: {
        orderBy: (plot, { asc }) => [asc(plot.position)],
      },
    },
  })

  const fields: Array<FieldIrrigation> = farmsWithPlots.map((farm) => {
    const plotsWithMoisture: Array<PlotMoisture> = farm.plots.map((plot) => {
      const moisture = calculateMoistureLevel(
        plot.crop,
        plot.stage,
        plot.plantedAt,
      )
      const needs = needsWatering(plot.crop, plot.stage, moisture)

      return {
        id: plot.id,
        position: plot.position,
        crop: plot.crop,
        stage: plot.stage,
        moistureLevel: moisture,
        lastWatered: plot.plantedAt, // Simplified - assume watered when planted
        needsWatering: needs,
      }
    })

    const totalMoisture = plotsWithMoisture.reduce(
      (sum, p) => sum + p.moistureLevel,
      0,
    )
    const avgMoisture =
      plotsWithMoisture.length > 0
        ? Math.floor(totalMoisture / plotsWithMoisture.length)
        : 0
    const needsWateringCount = plotsWithMoisture.filter(
      (p) => p.needsWatering,
    ).length

    return {
      id: farm.id,
      name: farm.name,
      averageMoisture: avgMoisture,
      totalPlots: plotsWithMoisture.length,
      needsWatering: needsWateringCount,
      plots: plotsWithMoisture,
    }
  })

  // Generate watering schedule
  const schedule: Array<WaterScheduleEntry> = [
    { time: '06:00', fieldsToWater: 0, plotsToWater: 0, estimatedWater: 0 },
    { time: '12:00', fieldsToWater: 0, plotsToWater: 0, estimatedWater: 0 },
    { time: '18:00', fieldsToWater: 0, plotsToWater: 0, estimatedWater: 0 },
  ]

  fields.forEach((field) => {
    if (field.needsWatering > 0) {
      // Morning watering for most plots
      schedule[0].fieldsToWater += 1
      schedule[0].plotsToWater += Math.ceil(field.needsWatering * 0.6)
      schedule[0].estimatedWater += Math.ceil(field.needsWatering * 0.6) * 5

      // Evening watering for remaining
      schedule[2].fieldsToWater += 1
      schedule[2].plotsToWater += Math.floor(field.needsWatering * 0.4)
      schedule[2].estimatedWater += Math.floor(field.needsWatering * 0.4) * 5
    }
  })

  // Calculate stats
  const allPlots = fields.flatMap((f) => f.plots)
  const totalMoisture = allPlots.reduce((sum, p) => sum + p.moistureLevel, 0)
  const averageMoisture =
    allPlots.length > 0 ? Math.floor(totalMoisture / allPlots.length) : 0
  const plotsNeedingWater = allPlots.filter((p) => p.needsWatering).length
  const waterEfficiency = Math.max(
    0,
    Math.min(100, averageMoisture + Math.random() * 10),
  )

  const stats: IrrigationStats = {
    totalWaterUsed: Math.floor(Math.random() * 200) + 150, // 150-350 liters
    averageMoisture,
    plotsNeedingWater,
    waterEfficiency: Math.floor(waterEfficiency),
  }

  // Generate recommendations
  const recommendations: Array<string> = []

  if (averageMoisture < 50) {
    recommendations.push(
      'Общий уровень влажности низкий. Рекомендуется увеличить частоту полива.',
    )
  }

  if (plotsNeedingWater > allPlots.length * 0.3) {
    recommendations.push(
      'Более 30% участков требуют полива. Активируйте систему орошения.',
    )
  }

  fields.forEach((field) => {
    const watermelonPlots = field.plots.filter(
      (p) => p.crop === 'watermelon' && p.needsWatering,
    )
    if (watermelonPlots.length > 0) {
      recommendations.push(
        `Поле "${field.name}": арбузы требуют дополнительного полива (${watermelonPlots.length} участков).`,
      )
    }
  })

  if (recommendations.length === 0) {
    recommendations.push(
      'Уровень влажности оптимален. Продолжайте текущий режим полива.',
    )
  }

  return {
    fields,
    schedule,
    stats,
    recommendations,
  }
})

// Water specific plots
export const waterPlots = createServerFn({ method: 'POST' })
  .inputValidator((data: { plotIds: Array<number> }) => data)
  .handler(async ({ data }) => {
    const { plotIds } = data

    if (plotIds.length === 0) {
      throw new Error('Не выбрано ни одного участка для полива')
    }

    // In a real app, you'd update the lastWatered timestamp
    // For now, we'll just return success
    const waterUsed = plotIds.length * 5 // 5 liters per plot

    return {
      success: true,
      plotsWatered: plotIds.length,
      waterUsed,
      message: `✅ Полив завершён! ${plotIds.length} участков получили воду (${waterUsed}л).`,
    }
  })
