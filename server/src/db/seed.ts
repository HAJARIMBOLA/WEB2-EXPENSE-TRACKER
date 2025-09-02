import { prisma } from './client.js'

const DEFAULT_CATEGORIES = [
  'Food','Transport','Housing','Utilities','Health','Entertainment','Education',
  'Savings','Debt','Shopping','Travel','Insurance','Taxes','Gifts & Donations','Other'
]

export async function seedDefaultCategoriesForUser(userId: string) {
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map(name => ({ name, userId })),
    skipDuplicates: true
  })
}
