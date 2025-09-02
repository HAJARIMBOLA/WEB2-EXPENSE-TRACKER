import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
dotenv.config()

import { router as apiRouter } from './router'
import { errorHandler } from './utils/errors'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

// Dossier uploads
const uploadDir = process.env.UPLOAD_DIR || './uploads'
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

// API
app.use('/api', apiRouter)

// Healthcheck
app.get('/health', (_req, res) => res.json({ ok: true }))

// Errors
app.use(errorHandler)

const port = Number(process.env.PORT || 4000)
app.listen(port, () => console.log(`API running on http://localhost:${port}`))
