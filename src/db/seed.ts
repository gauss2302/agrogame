import { CROPS } from '../models/crop'
import { cropCatalog } from './schema'
import { db } from './index'
import type { CropType } from '../models/crop'

async function seed() {
  console.log('🌱 Seeding crop catalog...')

  const cropEntries = Object.entries(CROPS) as Array<
    [CropType, (typeof CROPS)[CropType]]
  >

  for (const [type, data] of cropEntries) {
    await db
      .insert(cropCatalog)
      .values({
        type,
        name: data.name,
        growTimeMs: data.growTime,
        value: data.value,
        image: data.image,
        className: data.className ?? null,
      })
      .onConflictDoUpdate({
        target: cropCatalog.type,
        set: {
          name: data.name,
          growTimeMs: data.growTime,
          value: data.value,
          image: data.image,
          className: data.className ?? null,
          updatedAt: new Date(),
        },
      })

    console.log(`  ✅ ${data.name} (${type})`)
  }

  console.log('🎉 Seed completed!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
