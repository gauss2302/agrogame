export type CropType = 'carrot' | 'potato' | 'watermelon'
export type GrowthStage = 'empty' | 'planted' | 'growing' | 'ready'

export interface Plot {
  id: number
  crop: CropType | null
  stage: GrowthStage
  plantedAt: number | null
}

export interface CropData {
  name: string
  growTime: number
  value: number
  image: string
  className?: string
}

export const CROPS: Record<CropType, CropData> = {
  carrot: {
    name: 'Carrot',
    growTime: 9000,
    value: 10,
    image: '/game/carrot/another_carrot_2.png',
    className: '-rotate-12 -translate-y-4',
  },
  potato: {
    name: 'Potato',
    growTime: 10000,
    value: 15,
    image: '/game/potato/potato_plant.png',
    className: '-rotate-22 -translate-y-2',
  },
  watermelon: {
    name: 'Watermelon',
    growTime: 8000,
    value: 25,
    image: '/game/watermelon/watermelon_plant.png',
  },
}
