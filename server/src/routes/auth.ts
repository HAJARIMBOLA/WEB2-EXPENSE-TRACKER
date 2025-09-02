import { Router, Request, Response } from 'express'
import { prisma } from '../db/client'
import { z } from 'zod'
import argon2 from 'argon2'
import jwt from 'jsonwebtoken'
import { seedDefaultCategoriesForUser } from '../db/seed'
import { asyncHandler, ApiError } from '../utils/errors'
import { requireAuth, AuthedRequest } from '../middlewares/auth'



const router = Router()

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

router.post(
  '/signup',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = credsSchema.parse(req.body)
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) throw new ApiError(400, 'Email already exists')

    const passwordHash = await argon2.hash(password)
    const user = await prisma.user.create({ data: { email, passwordHash } })
    await seedDefaultCategoriesForUser(user.id)

    res.status(201).json({ id: user.id, email: user.email, createdAt: user.createdAt })
  })
)

router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = credsSchema.parse(req.body)
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) throw new ApiError(401, 'Invalid credentials')

    const ok = await argon2.verify(user.passwordHash, password)
    if (!ok) throw new ApiError(401, 'Invalid credentials')

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    )
    res.json({ accessToken: token })
  })
)

router.get(
  '/me',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.user!.id } })
    res.json({ id: user!.id, email: user!.email, createdAt: user!.createdAt })
  })
)

export default router
