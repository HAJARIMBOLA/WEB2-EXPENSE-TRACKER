// src/routes/summary.ts
import { Router, Response } from 'express'
import { prisma } from '../db/client'
import { requireAuth, AuthedRequest } from '../middlewares/auth'
import { asyncHandler } from '../utils/errors'

const router = Router()

function monthRange(iso?: string) {
  const now = iso ? new Date(`${iso}-01T00:00:00Z`) : new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
  return { start, end }
}

// GET /api/summary/monthly?month=YYYY-MM
router.get(
  '/monthly',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const month = req.query.month as string | undefined
    const { start, end } = monthRange(month)
    const userId = req.user!.id

    const incomeAgg = await prisma.income.aggregate({
      _sum: { amount: true },
      where: { userId, date: { gte: start, lt: end } }
    })

    const oneTimeAgg = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'ONE_TIME', date: { gte: start, lt: end } }
    })

    const recurringAgg = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'RECURRING',
        startDate: { lt: end },
        OR: [{ endDate: null }, { endDate: { gte: start } }]
      }
    })

    const totalIncome = Number(incomeAgg._sum.amount || 0)
    const totalExpenses = Number(oneTimeAgg._sum.amount || 0) + Number(recurringAgg._sum.amount || 0)
    const remaining = totalIncome - totalExpenses

    res.json({ monthStart: start, monthEnd: end, totalIncome, totalExpenses, remaining, alert: remaining < 0 })
  })
)

// GET /api/summary?start=YYYY-MM-DD&end=YYYY-MM-DD
router.get(
  '/',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { start: s, end: e } = req.query as { start?: string; end?: string }
    const start = s ? new Date(s) : new Date('1970-01-01')
    const end = e ? new Date(e) : new Date('2999-12-31')
    const userId = req.user!.id

    const incomeAgg = await prisma.income.aggregate({
      _sum: { amount: true },
      where: { userId, date: { gte: start, lte: end } }
    })

    const oneTimeAgg = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'ONE_TIME', date: { gte: start, lte: end } }
    })

    // Récurrents: compter les mois actifs dans la plage et multiplier
    const recurrences = await prisma.expense.findMany({
      where: {
        userId,
        type: 'RECURRING',
        startDate: { lte: end },
        OR: [{ endDate: null }, { endDate: { gte: start } }]
      }
    })

    const monthStart = (d: Date) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1))
    const clamp = (d: Date, lo: Date, hi: Date) => (d < lo ? lo : d > hi ? hi : d)
    const monthsBetween = (a: Date, b: Date) =>
      (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth()) + 1

    const startMonth = monthStart(start)
    const endMonth = monthStart(new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 1)))

    let recurringTotal = 0
    for (const r of recurrences) {
      const s0 = monthStart(r.startDate!)
      const e0 = monthStart(r.endDate ? r.endDate : end)
      const sClamp = clamp(s0, startMonth, endMonth)
      const eClamp = clamp(e0, startMonth, endMonth)
      if (sClamp <= eClamp) recurringTotal += Number(r.amount) * monthsBetween(sClamp, eClamp)
    }

    const totalIncome = Number(incomeAgg._sum.amount || 0)
    const totalExpenses = Number(oneTimeAgg._sum.amount || 0) + recurringTotal
    const remaining = totalIncome - totalExpenses
    res.json({ start, end, totalIncome, totalExpenses, remaining })
  })
)

// GET /api/summary/alerts
router.get(
  '/alerts',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const now = new Date()
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1))
    const userId = req.user!.id

    const incomeAgg = await prisma.income.aggregate({
      _sum: { amount: true },
      where: { userId, date: { gte: start, lt: end } }
    })

    const oneTimeAgg = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { userId, type: 'ONE_TIME', date: { gte: start, lt: end } }
    })

    const recurringAgg = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        userId,
        type: 'RECURRING',
        startDate: { lt: end },
        OR: [{ endDate: null }, { endDate: { gte: start } }]
      }
    })

    const totalIncome = Number(incomeAgg._sum.amount || 0)
    const totalExpenses = Number(oneTimeAgg._sum.amount || 0) + Number(recurringAgg._sum.amount || 0)

    if (totalExpenses > totalIncome) {
      const diff = (totalExpenses - totalIncome).toFixed(2)
      return res.json({ alert: true, message: `You've exceeded your monthly budget by $${diff}` })
    }
    res.json({ alert: false })
  })
)

export default router
