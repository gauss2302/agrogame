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
  growTime: number // in milliseconds
  value: number // coins earned on harvest
  image: string
  className?: string
}

export const CROPS: Record<CropType, CropData> = {
  carrot: {
    name: 'Морковь',
    growTime: 9000, // 9 seconds
    value: 10,
    image: '/game/carrot/another_carrot_2.png',
    className: '-rotate-12 -translate-y-4',
  },
  potato: {
    name: 'Картошка',
    growTime: 10000, // 10 seconds
    value: 15,
    image: '/game/potato/potato_plant.png',
    className: '-rotate-22 -translate-y-2',
  },
  watermelon: {
    name: 'Арбуз',
    growTime: 8000, // 8 seconds
    value: 25,
    image: '/game/watermelon/watermelon_plant.png',
  },
}

// Constants for game mechanics
export const GAME_CONFIG = {
  PLANT_COST: 5, // coins to plant a crop
  GRID_SIZE: 5, // 5x5 grid
  TOTAL_PLOTS: 25, // total plots (5*5)
  VIRTUAL_TO_REAL_RATIO: 100, // 100 virtual harvests = 1 real product
  INITIAL_COINS: 100, // starting coins for new farms
}
