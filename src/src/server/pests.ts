import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

import type { CropType, GrowthStage } from '@/models/crop'
import { CROPS } from '@/models/crop'
import { db } from '@/db'

export type PestType =
  | 'locust' // Саранча
  | 'cotton_bollworm' // Хлопковая совка
  | 'colorado_beetle' // Колорадский жук
  | 'aphid' // Тля
  | 'spider_mite' // Паутинный клещ
  | 'carrot_fly' // Морковная муха
  | 'cutworm' // Подгрызающие совки
  | 'whitefly' // Белокрылка

export type PestSeverity = 'none' | 'low' | 'medium' | 'high' | 'critical'

interface PestInfo {
  name: string
  nameRu: string
  description: string
  affectedCrops: Array<CropType>
  icon: string
  color: string
  treatment: string
}

export const PEST_DATABASE: Record<PestType, PestInfo> = {
  locust: {
    name: 'Locust',
    nameRu: 'Саранча',
    description:
      'Опасный вредитель, уничтожающий все виды культур. Активен в жаркие месяцы.',
    affectedCrops: ['carrot', 'potato', 'watermelon'],
    icon: '🦗',
    color: 'red',
    treatment: 'Опрыскивание инсектицидами, биологические методы контроля',
  },
  cotton_bollworm: {
    name: 'Cotton Bollworm',
    nameRu: 'Хлопковая совка',
    description:
      'Гусеницы повреждают плоды и листья. Особенно опасны для бахчевых.',
    affectedCrops: ['watermelon'],
    icon: '🐛',
    color: 'orange',
    treatment: 'Феромонные ловушки, опрыскивание при обнаружении',
  },
  colorado_beetle: {
    name: 'Colorado Potato Beetle',
    nameRu: 'Колорадский жук',
    description:
      'Основной вредитель картофеля. Поедает листья, снижая урожайность.',
    affectedCrops: ['potato'],
    icon: '🪲',
    color: 'yellow',
    treatment: 'Ручной сбор, инсектициды, севооборот',
  },
  aphid: {
    name: 'Aphids',
    nameRu: 'Тля',
    description:
      'Мелкие насекомые, высасывающие соки растений. Переносчики вирусов.',
    affectedCrops: ['carrot', 'potato', 'watermelon'],
    icon: '🦟',
    color: 'green',
    treatment: 'Мыльный раствор, божьи коровки, инсектициды',
  },
  spider_mite: {
    name: 'Spider Mite',
    nameRu: 'Паутинный клещ',
    description: 'Микроскопический вредитель. Активен в жаркую сухую погоду.',
    affectedCrops: ['carrot', 'watermelon'],
    icon: '🕷️',
    color: 'brown',
    treatment: 'Увеличение влажности, акарициды, биопрепараты',
  },
  carrot_fly: {
    name: 'Carrot Fly',
    nameRu: 'Морковная муха',
    description:
      'Личинки повреждают корнеплоды моркови, делая их непригодными.',
    affectedCrops: ['carrot'],
    icon: '🪰',
    color: 'gray',
    treatment: 'Укрывной материал, посадка лука рядом, инсектициды',
  },
  cutworm: {
    name: 'Cutworm',
    nameRu: 'Подгрызающие совки',
    description: 'Гусеницы подгрызают стебли молодых растений у основания.',
    affectedCrops: ['carrot', 'potato', 'watermelon'],
    icon: '🐛',
    color: 'purple',
    treatment: 'Глубокая вспашка, ручной сбор, инсектициды',
  },
  whitefly: {
    name: 'Whitefly',
    nameRu: 'Белокрылка',
    description:
      'Мелкие белые насекомые на нижней стороне листьев. Ослабляют растения.',
    affectedCrops: ['potato', 'watermelon'],
    icon: '🦋',
    color: 'cyan',
    treatment: 'Желтые клеевые ловушки, инсектициды, биопрепараты',
  },
}

interface PestDetection {
  type: PestType
  severity: PestSeverity
  confidence: number // 0-100
  detectedAt: Date
}

interface PlotPestStatus {
  id: number
  position: number
  crop: CropType | null
  stage: GrowthStage
  pests: Array<PestDetection>
  overallThreat: PestSeverity
}

interface FieldPestStatus {
  id: number
  name: string
  totalPlots: number
  infectedPlots: number
  threatLevel: PestSeverity
  plots: Array<PlotPestStatus>
  dominantPests: Array<{ type: PestType; count: number }>
}

interface PestStats {
  totalDetections: number
  criticalPlots: number
  mostCommonPest: PestType | null
  threatTrend: 'increasing' | 'stable' | 'decreasing'
}

interface TreatmentRecommendation {
  priority: 'urgent' | 'high' | 'medium' | 'low'
  pest: PestType
  affectedFields: Array<string>
  action: string
}

export interface PestManagementData {
  fields: Array<FieldPestStatus>
  stats: PestStats
  recommendations: Array<TreatmentRecommendation>
  pestGuide: Record<PestType, PestInfo>
}

// Simulate pest detection based on crop type and growth stage
const detectPests = (
  crop: CropType | null,
  stage: GrowthStage,
): Array<PestDetection> => {
  if (stage === 'empty' || !crop) return []

  const detections: Array<PestDetection> = []
  const rand = Math.random()

  // Get pests that affect this crop
  const possiblePests = (
    Object.entries(PEST_DATABASE) as Array<[PestType, PestInfo]>
  )
    .filter(([_, info]) => info.affectedCrops.includes(crop))
    .map(([type]) => type)

  // Randomly detect some pests
  possiblePests.forEach((pestType) => {
    const detectionChance =
      stage === 'ready' ? 0.4 : stage === 'growing' ? 0.3 : 0.15

    if (Math.random() < detectionChance) {
      const severities: Array<PestSeverity> = [
        'low',
        'medium',
        'high',
        'critical',
      ]
      const weights = [50, 30, 15, 5] // Most are low severity

      let severity: PestSeverity = 'low'
      const roll = Math.random() * 100
      let cumulative = 0
      for (let i = 0; i < weights.length; i++) {
        cumulative += weights[i]
        if (roll < cumulative) {
          severity = severities[i]
          break
        }
      }

      detections.push({
        type: pestType,
        severity,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100%
        detectedAt: new Date(),
      })
    }
  })

  return detections
}

const calculateOverallThreat = (pests: Array<PestDetection>): PestSeverity => {
  if (pests.length === 0) return 'none'

  const maxSeverity = pests.reduce((max, pest) => {
    const severityOrder = { none: 0, low: 1, medium: 2, high: 3, critical: 4 }
    return severityOrder[pest.severity] > severityOrder[max]
      ? pest.severity
      : max
  }, 'none' as PestSeverity)

  return maxSeverity
}

export const getPestManagementData = createServerFn().handler(async () => {
  const farmsWithPlots = await db.query.farms.findMany({
    orderBy: (farm, { asc }) => [asc(farm.id)],
    with: {
      plots: {
        orderBy: (plot, { asc }) => [asc(plot.position)],
      },
    },
  })

  const fields: Array<FieldPestStatus> = farmsWithPlots.map((farm) => {
    const plots: Array<PlotPestStatus> = farm.plots.map((plot) => {
      const pests = detectPests(plot.crop, plot.stage)
      const overallThreat = calculateOverallThreat(pests)

      return {
        id: plot.id,
        position: plot.position,
        crop: plot.crop,
        stage: plot.stage,
        pests,
        overallThreat,
      }
    })

    const infectedPlots = plots.filter((p) => p.overallThreat !== 'none').length

    // Calculate field threat level
    const plotThreats = plots.map((p) => p.overallThreat)
    const threatCounts = {
      none: plotThreats.filter((t) => t === 'none').length,
      low: plotThreats.filter((t) => t === 'low').length,
      medium: plotThreats.filter((t) => t === 'medium').length,
      high: plotThreats.filter((t) => t === 'high').length,
      critical: plotThreats.filter((t) => t === 'critical').length,
    }

    let fieldThreat: PestSeverity = 'none'
    if (threatCounts.critical > 0) fieldThreat = 'critical'
    else if (threatCounts.high > 2) fieldThreat = 'high'
    else if (threatCounts.high > 0 || threatCounts.medium > 3)
      fieldThreat = 'medium'
    else if (threatCounts.medium > 0 || threatCounts.low > 0)
      fieldThreat = 'low'

    // Count dominant pests
    const pestCounts = new Map<PestType, number>()
    plots.forEach((plot) => {
      plot.pests.forEach((pest) => {
        pestCounts.set(pest.type, (pestCounts.get(pest.type) || 0) + 1)
      })
    })

    const dominantPests = Array.from(pestCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)

    return {
      id: farm.id,
      name: farm.name,
      totalPlots: plots.length,
      infectedPlots,
      threatLevel: fieldThreat,
      plots,
      dominantPests,
    }
  })

  // Calculate stats
  const allDetections = fields.flatMap((f) => f.plots.flatMap((p) => p.pests))
  const criticalPlots = fields
    .flatMap((f) => f.plots)
    .filter(
      (p) => p.overallThreat === 'critical' || p.overallThreat === 'high',
    ).length

  const pestTypeCounts = new Map<PestType, number>()
  allDetections.forEach((detection) => {
    pestTypeCounts.set(
      detection.type,
      (pestTypeCounts.get(detection.type) || 0) + 1,
    )
  })

  const mostCommonPest =
    pestTypeCounts.size > 0
      ? Array.from(pestTypeCounts.entries()).sort((a, b) => b[1] - a[1])[0][0]
      : null

  const stats: PestStats = {
    totalDetections: allDetections.length,
    criticalPlots,
    mostCommonPest,
    threatTrend:
      criticalPlots > 5
        ? 'increasing'
        : criticalPlots > 2
          ? 'stable'
          : 'decreasing',
  }

  // Generate recommendations
  const recommendations: Array<TreatmentRecommendation> = []

  // Critical pest recommendations
  fields.forEach((field) => {
    const criticalPests = new Map<PestType, number>()
    field.plots.forEach((plot) => {
      plot.pests.forEach((pest) => {
        if (pest.severity === 'critical' || pest.severity === 'high') {
          criticalPests.set(pest.type, (criticalPests.get(pest.type) || 0) + 1)
        }
      })
    })

    criticalPests.forEach((count, pestType) => {
      const priority = count > 3 ? 'urgent' : count > 1 ? 'high' : 'medium'
      const pestInfo = PEST_DATABASE[pestType]

      recommendations.push({
        priority,
        pest: pestType,
        affectedFields: [field.name],
        action: `${pestInfo.nameRu}: ${pestInfo.treatment}`,
      })
    })
  })

  // Sort by priority
  const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
  recommendations.sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  )

  return {
    fields,
    stats,
    recommendations: recommendations.slice(0, 5), // Top 5
    pestGuide: PEST_DATABASE,
  }
})

// Apply treatment to fields
export const applyTreatment = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { fieldIds: Array<number>; pestType: PestType }) => data,
  )
  .handler(async ({ data }) => {
    const { fieldIds, pestType } = data

    if (fieldIds.length === 0) {
      throw new Error('Не выбрано ни одного поля для обработки')
    }

    const pestInfo = PEST_DATABASE[pestType]

    return {
      success: true,
      fieldsProcessed: fieldIds.length,
      message: `✅ Обработка завершена! ${fieldIds.length} полей обработано от ${pestInfo.nameRu}.`,
    }
  })
