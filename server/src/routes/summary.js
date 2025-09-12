import { Router } from "express";
import { prisma } from "../db/client.js";
import { asyncHandler } from "../utils/errors.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

function startOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}
function endOfMonth(d = new Date()) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const now = new Date();
    const sMonth = startOfMonth(now);
    const eMonth = endOfMonth(now);

    const [expMonth, incMonth, expToday, incToday] = await Promise.all([
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: { userId, date: { gte: sMonth, lte: eMonth } }
      }),
      prisma.income.aggregate({
        _sum: { amount: true },
        where: { userId, date: { gte: sMonth, lte: eMonth } }
      }),
      prisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          date: {
            gte: new Date(now.toDateString()),
            lte: new Date(now.toDateString() + " 23:59:59")
          }
        }
      }),
      prisma.income.aggregate({
        _sum: { amount: true },
        where: {
          userId,
          date: {
            gte: new Date(now.toDateString()),
            lte: new Date(now.toDateString() + " 23:59:59")
          }
        }
      })
    ]);

    const monthExpense = Number(expMonth._sum.amount ?? 0);
    const monthIncome = Number(incMonth._sum.amount ?? 0);
    const todayExpense = Number(expToday._sum.amount ?? 0);
    const todayIncome = Number(incToday._sum.amount ?? 0);

    res.json({
      month: {
        expense: monthExpense,
        income: monthIncome,
        balance: monthIncome - monthExpense
      },
      today: {
        expense: todayExpense,
        income: todayIncome,
        balance: todayIncome - todayExpense
      }
    });
  })
);

export default router;
