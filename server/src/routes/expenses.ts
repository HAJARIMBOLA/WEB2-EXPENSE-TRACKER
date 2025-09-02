import { Router, Response } from 'express'
import { prisma } from '../db/client'
import { requireAuth, AuthedRequest } from '../middlewares/auth'
import { asyncHandler, ApiError } from '../utils/errors'
import { z } from 'zod'
import { upload } from '../middlewares/upload'
import type { Prisma } from '@prisma/client'

const router = Router()

// Validation des entrées
const IsoDateString = z.string().refine(v => !Number.isNaN(Date.parse(v)), 'Invalid date')

const ExpenseBody = z.object({
  amount: z.coerce.number().positive(),
  categoryId: z.string().uuid(),
  description: z.string().max(500).optional(),
  type: z.enum(['one-time', 'recurring']).default('one-time'),
  date: IsoDateString.optional(),
  startDate: IsoDateString.optional(),
  endDate: IsoDateString.optional()
})
.refine(d => (d.type === 'one-time' ? !!d.date : !!d.startDate), {
  message: 'Date is required for one-time; startDate for recurring'
})
.refine(d => {
  if (d.type === 'recurring' && d.endDate && d.startDate) {
    return new Date(d.endDate) >= new Date(d.startDate)
  }
  return true
}, { message: 'endDate must be >= startDate' })

// Type helper : un expense avec category + receipt
type ExpenseWithExtras = Awaited<ReturnType<typeof prisma.expense.findMany>>[number]

// GET /api/expenses
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { start, end, category, type } = req.query as {
      start?: string; end?: string; category?: string; type?: 'one-time' | 'recurring'
    }

    // WHERE typé
    const where: Prisma.ExpensesWhereInput = { userId: req.user!.id }
    if (category) where.category = { name: { equals: category } }
    if (type === 'one-time') where.type = 'ONE_TIME'
    if (type === 'recurring') where.type = 'RECURRING'

    if (start || end) {
      const startDate = start ? new Date(start) : undefined
      const endDate = end ? new Date(end) : undefined

      const expenses = await prisma.expense.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { category: true, receipt: true }
      })

      const filtered = expenses.filter((e: ExpenseWithExtras) => {
        if (e.type === 'ONE_TIME') {
          if (!e.date) return false
          if (startDate && e.date < startDate) return false
          if (endDate && e.date > endDate) return false
          return true
        } else {
          const s = startDate ?? new Date('1970-01-01')
          const eend = endDate ?? new Date('2999-12-31')
          return (e.startDate! <= eend) && (e.endDate === null || e.endDate >= s)
        }
      })

      return res.json(filtered)
    }

    const expenses = await prisma.expense.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { category: true, receipt: true }
    })
    res.json(expenses)
  })
)

// GET /api/expenses/:id
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { id } = req.params as { id: string }
    const item = await prisma.expense.findFirst({
      where: { id, userId: req.user!.id },
      include: { receipt: true }
    })
    if (!item) throw new ApiError(404, 'Expense not found')
    res.json(item)
  })
)

// POST /api/expenses
router.post(
  '/',
  requireAuth,
  upload.single('receipt'),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const data = ExpenseBody.parse(req.body)

    const created = await prisma.expense.create({
      data: {
        user: { connect: { id: req.user!.id } },
        amount: data.amount,
        category: { connect: { id: data.categoryId } },
        description: data.description ?? null,
        type: data.type === 'one-time' ? 'ONE_TIME' : 'RECURRING',
        date: data.type === 'one-time' ? new Date(data.date!) : null,
        startDate: data.type === 'recurring' ? new Date(data.startDate!) : null,
        endDate: data.type === 'recurring' && data.endDate ? new Date(data.endDate) : null
      }
    })

    if (req.file) {
      await prisma.receipt.create({
        data: {
          expense: { connect: { id: created.id } },
          filePath: req.file.path,
          mimeType: req.file.mimetype,
          sizeBytes: req.file.size
        }
      })
    }

    const item = await prisma.expense.findUnique({
      where: { id: created.id },
      include: { receipt: true }
    })
    res.status(201).json(item)
  })
)

// PUT /api/expenses/:id
router.put(
  '/:id',
  requireAuth,
  upload.single('receipt'),
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { id } = req.params as { id: string }

    const existing = await prisma.expense.findFirst({
      where: { id, userId: req.user!.id },
      include: { receipt: true }
    })
    if (!existing) throw new ApiError(404, 'Expense not found')

    const data = ExpenseBody.parse(req.body)

    await prisma.expense.update({
      where: { id },
      data: {
        amount: data.amount,
        category: { connect: { id: data.categoryId } },
        description: data.description ?? null,
        type: data.type === 'one-time' ? 'ONE_TIME' : 'RECURRING',
        date: data.type === 'one-time' ? new Date(data.date!) : null,
        startDate: data.type === 'recurring' ? new Date(data.startDate!) : null,
        endDate: data.type === 'recurring' && data.endDate ? new Date(data.endDate) : null
      }
    })

    if (req.file) {
      if (existing.receipt) {
        await prisma.receipt.update({
          where: { expenseId: id },
          data: {
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            sizeBytes: req.file.size
          }
        })
      } else {
        await prisma.receipt.create({
          data: {
            expense: { connect: { id } },
            filePath: req.file.path,
            mimeType: req.file.mimetype,
            sizeBytes: req.file.size
          }
        })
      }
    }

    const updated = await prisma.expense.findUnique({
      where: { id },
      include: { receipt: true }
    })
    res.json(updated)
  })
)

// DELETE /api/expenses/:id
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { id } = req.params as { id: string }
    const existing = await prisma.expense.findFirst({
      where: { id, userId: req.user!.id }
    })
    if (!existing) throw new ApiError(404, 'Expense not found')

    await prisma.expense.delete({ where: { id } })
    res.status(204).send()
  })
)

export default router
