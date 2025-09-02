// src/middlewares/auth.ts
import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ApiError } from '../utils/errors'

export interface AuthedRequest extends Request {
  user?: { id: string; email: string }
}

export function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) throw new ApiError(401, 'Missing token')
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as any
    req.user = { id: payload.sub, email: payload.email }
    next()
  } catch {
    throw new ApiError(401, 'Invalid token')
  }
}
