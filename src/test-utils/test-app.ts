import express, { Router } from 'express'
import cors from 'cors'

export function createTestApp(path: string, router: Router) {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(path, router)
  return app
}
