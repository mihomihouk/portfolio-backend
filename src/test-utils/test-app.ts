import express, { RequestHandler } from 'express'
import cors from 'cors'

export function createTestApp(path: string, ...handlers: RequestHandler[]) {
  const app = express()
  app.use(cors())
  app.use(express.json())
  app.use(path, ...handlers)
  return app
}
