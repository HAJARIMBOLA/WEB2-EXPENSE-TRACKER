// server/src/db/seed.ts
import { prisma } from './client'

const DEFAULT_CATEGORIES = [
  'Food','Transport','Housing','Utilities','Health','Entertainment','Education',
  'Savings','Debt','Shopping','Travel','Insurance','Taxes','Gifts & Donations','Other'
]

export async function seedDefaultCategoriesForUser(userId: string) {
  for (const name of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { userId_name: { userId, name } }, // <- nécessite @@unique([userId, name])
      update: {},
      create: { name, userId },
    })
  }
}
