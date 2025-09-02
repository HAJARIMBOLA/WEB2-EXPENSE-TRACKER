import { Router, Response } from 'express'
import { prisma } from '../db/client'
import { requireAuth, AuthedRequest } from '../middlewares/auth'
import { asyncHandler } from '../utils/errors'

const router = Router()

// GET /api/user/profile
router.get(
  '/profile',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    })

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    })
  })
)

export default router
