import { NextFunction, Request, Response } from 'express'

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error('Error: ', err.message)

  res.status(err.status || 500).json({
    success: false,
    status: 'error',
    message: err.message || 'Internal Server Error'
  })
}
