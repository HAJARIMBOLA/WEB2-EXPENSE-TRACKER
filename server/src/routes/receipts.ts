import { Router, Response } from 'express'
import fs from 'fs'
import path from 'path'
import { prisma } from '../db/client'
import { requireAuth, AuthedRequest } from '../middlewares/auth'
import { asyncHandler, ApiError } from '../utils/errors'
import mime from 'mime-types'

const router = Router()

// GET /api/receipts/:idExpense
router.get(
  '/:idExpense',
  requireAuth,
  asyncHandler(async (req: AuthedRequest, res: Response) => {
    const { idExpense } = req.params as { idExpense: string }

    const exp = await prisma.expense.findFirst({
      where: { id: idExpense, userId: req.user!.id },
      include: { receipt: true }
    })

    if (!exp) throw new ApiError(404, 'Expense not found')
    if (!exp.receipt) throw new ApiError(404, 'No receipt for this expense')

    const filePath = exp.receipt.filePath
    if (!fs.existsSync(filePath)) throw new ApiError(404, 'File missing on server')

    const mimeType =
      mime.lookup(path.extname(filePath)) ||
      exp.receipt.mimeType ||
      'application/octet-stream'

    res.setHeader('Content-Type', String(mimeType))
    res.setHeader(
      'Content-Disposition',
      `inline; filename="${path.basename(filePath)}"`
    )

    fs.createReadStream(filePath).pipe(res)
  })
)

export default router
