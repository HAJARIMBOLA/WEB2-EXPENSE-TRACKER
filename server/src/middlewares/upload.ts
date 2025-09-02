import multer from 'multer'
import bytes from 'bytes'
import path from 'path'

const ACCEPT = ['image/jpeg', 'image/png', 'application/pdf']

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, process.env.UPLOAD_DIR || './uploads'),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  }
})

const fileSize = bytes.parse(process.env.MAX_UPLOAD ?? '5mb') ?? 5 * 1024 * 1024

export const upload = multer({
  storage,
  limits: { fileSize },
  fileFilter: (_req, file, cb) => cb(null, ACCEPT.includes(file.mimetype))
})
