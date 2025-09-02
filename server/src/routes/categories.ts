// src/routes/categories.ts
import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { z } from 'zod'
import { requireAuth, AuthedRequest } from '../middlewares/auth'
import { asyncHandler, ApiError } from '../utils/errors'

const router = Router()

router.get(
  '/',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const categories = await prisma.category.findMany({
      where: { userId: req.user!.id },
      orderBy: { name: 'asc' }
    })
    res.json(categories)
  })
)

router.post(
  '/',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const body = z.object({ name: z.string().min(1).max(50) }).parse(req.body)
    const cat = await prisma.category.create({
      data: { name: body.name, userId: req.user!.id }
    })
    res.status(201).json(cat)
  })
)

router.put(
  '/:id',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const id = req.params.id
    const body = z.object({ name: z.string().min(1).max(50) }).parse(req.body)
    const cat = await prisma.category.findFirst({ where: { id, userId: req.user!.id } })
    if (!cat) throw new ApiError(404, 'Category not found')
    const updated = await prisma.category.update({ where: { id }, data: { name: body.name } })
    res.json(updated)
  })
)

router.delete(
  '/:id',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const id = req.params.id
    const cat = await prisma.category.findFirst({
      where: { id, userId: req.user!.id },
      include: { expenses: true }
    })
    if (!cat) throw new ApiError(404, 'Category not found')
    if (cat.expenses.length > 0) throw new ApiError(409, 'Category is in use')
    await prisma.category.delete({ where: { id } })
    res.status(204).send()
  })
)

export default router
