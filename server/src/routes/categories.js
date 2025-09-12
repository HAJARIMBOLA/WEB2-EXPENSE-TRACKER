import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db/client.js";
import { asyncHandler } from "../utils/errors.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const categorySchema = z.object({
  name: z.string().min(1),
  type: z.enum(["EXPENSE", "INCOME"])
});

router.get(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const list = await prisma.category.findMany({
      where: { userId: req.user.id },
      orderBy: [{ type: "asc" }, { name: "asc" }]
    });
    res.json(list);
  })
);

router.post(
  "/",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = categorySchema.parse(req.body);
    const cat = await prisma.category.create({
      data: { ...data, userId: req.user.id }
    });
    res.status(201).json(cat);
  })
);

router.put(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const data = categorySchema.parse(req.body);
    const cat = await prisma.category.update({
      where: { id: req.params.id },
      data
    });
    res.json(cat);
  })
);

router.delete(
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    await prisma.category.delete({ where: { id: req.params.id } });
    res.status(204).end();
  })
);

export default router;
