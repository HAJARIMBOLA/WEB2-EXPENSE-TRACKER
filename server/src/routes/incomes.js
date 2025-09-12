import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "../utils/errors.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const payload = z.object({
  categoryId: z.string().cuid(),
  amount: z.number().positive(),
  date: z.coerce.date().optional(),
  note: z.string().max(255).optional()
});

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const { from, to, categoryId, page = 1, pageSize = 20 } = req.query;

    const where = {
      userId: req.user.id,
      ...(categoryId ? { categoryId } : {}),
      ...(from || to
        ? {
            date: {
              ...(from ? { gte: new Date(from) } : {}),
              ...(to ? { lte: new Date(to) } : {})
            }
          }
        : {})
    };

    const [items, total] = await Promise.all([
      prisma.income.findMany({
        where,
        orderBy: { date: "desc" },
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        include: { category: true }
      }),
      prisma.income.count({ where })
    ]);

    res.json({ items, total });
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = payload.parse(req.body);
    const created = await prisma.income.create({
      data: {
        ...data,
        userId: req.user.id
      }
    });
    res.status(201).json(created);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = payload.partial().parse(req.body);
    const updated = await prisma.income.update({
      where: { id: req.params.id },
      data
    });
    res.json(updated);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.income.delete({ where: { id: req.params.id } });
    res.status(204).end();
  })
);

export default router;
