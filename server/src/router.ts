import { Router } from 'express'

import authRoutes from './routes/auth'
import userRoutes from './routes/user'
import categoryRoutes from './routes/categories'
import expenseRoutes from './routes/expenses'
import incomeRoutes from './routes/incomes'
import receiptRoutes from './routes/receipts'
import summaryRoutes from './routes/summary'

export const router = Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/categories', categoryRoutes)
router.use('/expenses', expenseRoutes)
router.use('/incomes', incomeRoutes)
router.use('/receipts', receiptRoutes)
router.use('/summary', summaryRoutes)
