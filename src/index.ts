import express from 'express'
import cors from 'cors'
import logRouter from './routes/log.route'
import { analyticsRouter } from './routes'
import { errorHandler } from './middlewares/error-handler'

const app = express()

app.set('trust proxy', 1)

const port = process.env.PORT || 4000

const whiteList = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(origin => origin.trim())

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (whiteList.indexOf(origin) !== -1) {
        return callback(null, true)
      } else {
        return callback(new Error('Not allowed by CORS'))
      }
    }
  })
)

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Backend API is running')
})

app.use('/api/log', logRouter)
app.use('/api/visitor-analytics', analyticsRouter)
app.use(errorHandler)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
