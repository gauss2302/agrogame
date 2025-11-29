import { pgEnum, pgTable, integer, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

import { CROPS, type CropType, type GrowthStage } from '../models/crop'

const cropTypeValues = Object.keys(CROPS) as CropType[]
const growthStageValues: GrowthStage[] = ['empty', 'planted', 'growing', 'ready']

export const cropTypeEnum = pgEnum('crop_type', cropTypeValues)
export const growthStageEnum = pgEnum('growth_stage', growthStageValues)

export const cropCatalog = pgTable('crop_catalog', {
  id: serial('id').primaryKey(),
  type: cropTypeEnum('type').notNull().unique(),
  name: text('name').notNull(),
  growTimeMs: integer('grow_time_ms').notNull(),
  value: integer('value').notNull(),
  image: text('image').notNull(),
  className: text('class_name'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const farms = pgTable('farms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  coins: integer('coins').notNull().default(100),
  realCrops: integer('real_crops').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
})

export const plots = pgTable(
  'plots',
  {
    id: serial('id').primaryKey(),
    farmId: integer('farm_id')
      .notNull()
      .references(() => farms.id, { onDelete: 'cascade' }),
    position: integer('position').notNull(),
    crop: cropTypeEnum('crop'),
    stage: growthStageEnum('stage').notNull().default('empty'),
    plantedAt: timestamp('planted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (plots) => ({
    farmPositionIdx: uniqueIndex('plots_farm_position_idx').on(plots.farmId, plots.position),
  }),
)
