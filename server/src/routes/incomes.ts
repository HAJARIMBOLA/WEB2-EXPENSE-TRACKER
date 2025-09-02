import { Router, Request, Response } from 'express'
import { prisma } from '../db/client.js'
import { requireAuth, AuthedRequest } from '../middlewares/auth.js'
import { asyncHandler, ApiError } from '../utils/errors.js'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'

const router = Router()

// ------------------ Validation Zod ------------------
const IncomeBody = z.object({
  amount: z.coerce.number().positive(),
  date: z.string().refine(v => !Number.isNaN(Date.parse(v)), 'Invalid date'),
  source: z.string().min(1).max(100),
  description: z.string().max(500).optional()
})

// ------------------ GET /api/incomes ------------------
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { start, end } = req.query as Record<string, string | undefined>

    const args: Prisma.IncomeFindManyArgs = {
      where: { userId: req.user!.id },
      orderBy: { date: 'desc' }
    }

    if (start || end) {
      const s = start ? new Date(start) : new Date('1970-01-01')
      const e = end ? new Date(end) : new Date('2999-12-31')
      args.where = { ...args.where, date: { gte: s, lte: e } }
    }

    const incomes = await prisma.income.findMany(args)
    res.json(incomes)
  })
)

// ------------------ GET /api/incomes/:id ------------------
router.get(
  '/:id',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const item = await prisma.income.findFirst({
      where: { id: req.params.id, userId: req.user!.id }
    })
    if (!item) throw new ApiError(404, 'Income not found')
    res.json(item)
  })
)

// ------------------ POST /api/incomes ------------------
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const data = IncomeBody.parse(req.body)
    const created = await prisma.income.create({
      data: {
        userId: req.user!.id,
        amount: data.amount,
        date: new Date(data.date),
        source: data.source,
        description: data.description || null
      }
    })
    res.status(201).json(created)
  })
)

// ------------------ PUT /api/incomes/:id ------------------
router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const id = req.params.id
    const existing = await prisma.income.findFirst({
      where: { id, userId: req.user!.id }
    })
    if (!existing) throw new ApiError(404, 'Income not found')

    const data = IncomeBody.parse(req.body)
    const updated = await prisma.income.update({
      where: { id },
      data: {
        amount: data.amount,
        date: new Date(data.date),
        source: data.source,
        description: data.description || null
      }
    })
    res.json(updated)
  })
)

// ------------------ DELETE /api/incomes/:id ------------------
router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const id = req.params.id
    const existing = await prisma.income.findFirst({
      where: { id, userId: req.user!.id }
    })
    if (!existing) throw new ApiError(404, 'Income not found')

    await prisma.income.delete({ where: { id } })
    res.status(204).send()
  })
)

export default router
