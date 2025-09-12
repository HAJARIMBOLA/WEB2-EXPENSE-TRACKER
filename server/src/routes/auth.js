import { Router } from "express";
import { z } from "zod";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { prisma } from "../db/client.js";
import { seedDefaultCategoriesForUser } from "../db/seed.js";
import { asyncHandler, ApiError } from "../utils/errors.js";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

const credsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});

router.post(
  "/signup",
  asyncHandler(async (req, res) => {
    const { email, password } = credsSchema.parse(req.body);

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) throw new ApiError(409, "Email already in use");

    const passwordHash = await argon2.hash(password);
    const user = await prisma.user.create({
      data: { email, passwordHash }
    });

    // seed catégories
    await seedDefaultCategoriesForUser(user.id);

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "30d"
    });

    res.status(201).json({ token, user: { id: user.id, email: user.email } });
  })
);

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = credsSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError(401, "Invalid credentials");

    const ok = await argon2.verify(user.passwordHash, password);
    if (!ok) throw new ApiError(401, "Invalid credentials");

    const token = jwt.sign({}, process.env.JWT_SECRET, {
      subject: user.id,
      expiresIn: "30d"
    });

    res.json({ token, user: { id: user.id, email: user.email } });
  })
);

router.get(
  "/me",
  requireAuth,
  asyncHandler(async (req, res) => {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, createdAt: true }
    });
    res.json(me);
  })
);

export default router;
