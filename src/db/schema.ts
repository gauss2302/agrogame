import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

import { CROPS } from '../models/crop'
import type { CropType, GrowthStage } from '../models/crop'

const cropTypeValues = Object.keys(CROPS) as [CropType, ...Array<CropType>]
const growthStageValues: [GrowthStage, ...Array<GrowthStage>] = [
  'empty',
  'planted',
  'growing',
  'ready',
]

export const cropTypeEnum = pgEnum('crop_type', cropTypeValues)
export const growthStageEnum = pgEnum('growth_stage', growthStageValues)

// Delivery order status
export const deliveryStatusEnum = pgEnum('delivery_status', [
  'pending', // Order created, waiting for processing
  'confirmed', // Order confirmed by farmer
  'preparing', // Products being prepared
  'shipped', // Products shipped
  'delivered', // Products delivered
  'cancelled', // Order cancelled
])

export const cropCatalog = pgTable('crop_catalog', {
  id: serial('id').primaryKey(),
  type: cropTypeEnum('type').notNull().unique(),
  name: text('name').notNull(),
  growTimeMs: integer('grow_time_ms').notNull(),
  value: integer('value').notNull(),
  image: text('image').notNull(),
  className: text('class_name'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const farms = pgTable('farms', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  coins: integer('coins').notNull().default(100),
  realCrops: integer('real_crops').notNull().default(0), // Total virtual harvests
  totalDelivered: integer('total_delivered').notNull().default(0), // Total real products delivered
  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
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
    createdAt: timestamp('created_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (plots) => ({
    farmPositionIdx: uniqueIndex('plots_farm_position_idx').on(
      plots.farmId,
      plots.position,
    ),
  }),
)

// Track real product delivery orders
export const deliveryOrders = pgTable('delivery_orders', {
  id: serial('id').primaryKey(),
  farmId: integer('farm_id')
    .notNull()
    .references(() => farms.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull(), // Number of real products
  virtualCropsUsed: integer('virtual_crops_used').notNull(), // Virtual harvests converted
  status: deliveryStatusEnum('status').notNull().default('pending'),

  // Delivery info
  recipientName: text('recipient_name'),
  recipientPhone: text('recipient_phone'),
  deliveryAddress: text('delivery_address'),
  notes: text('notes'),

  // Tracking
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
  shippedAt: timestamp('shipped_at', { withTimezone: true }),
  deliveredAt: timestamp('delivered_at', { withTimezone: true }),

  createdAt: timestamp('created_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Track harvest history for analytics
export const harvestHistory = pgTable('harvest_history', {
  id: serial('id').primaryKey(),
  farmId: integer('farm_id')
    .notNull()
    .references(() => farms.id, { onDelete: 'cascade' }),
  cropType: cropTypeEnum('crop_type').notNull(),
  coinsEarned: integer('coins_earned').notNull(),
  harvestedAt: timestamp('harvested_at', { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// Relations for relational queries
export const farmsRelations = relations(farms, ({ many }) => ({
  plots: many(plots),
  deliveryOrders: many(deliveryOrders),
  harvestHistory: many(harvestHistory),
}))

export const plotsRelations = relations(plots, ({ one }) => ({
  farm: one(farms, {
    fields: [plots.farmId],
    references: [farms.id],
  }),
}))

export const deliveryOrdersRelations = relations(deliveryOrders, ({ one }) => ({
  farm: one(farms, {
    fields: [deliveryOrders.farmId],
    references: [farms.id],
  }),
}))

export const harvestHistoryRelations = relations(harvestHistory, ({ one }) => ({
  farm: one(farms, {
    fields: [harvestHistory.farmId],
    references: [farms.id],
  }),
}))
