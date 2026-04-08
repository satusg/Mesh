import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'
import { ApplicationError } from '../../../application/errors'

export interface ApiError {
  error: {
    code: string
    message: string
    details?: unknown
  }
}

// Keep AppError for any HTTP-layer use
export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 400,
  ) {
    super(message)
    this.name = 'AppError'
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(422).json({
      error: {
        code:    'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: err.flatten(),
      },
    } satisfies ApiError)
    return
  }

  // Typed application-layer errors — always surface the message
  if (err instanceof ApplicationError) {
    res.status(err.httpStatus).json({
      error: { code: err.code, message: err.message },
    } satisfies ApiError)
    return
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: { code: err.code, message: err.message },
    } satisfies ApiError)
    return
  }

  if (err instanceof Error && err.message.toLowerCase().includes('not found')) {
    res.status(404).json({
      error: { code: 'NOT_FOUND', message: err.message },
    } satisfies ApiError)
    return
  }

  console.error('[Backend] [Unhandled error]', err)
  res.status(500).json({
    error: {
      code:    'INTERNAL_ERROR',
      message: process.env.NODE_ENV === 'production'
        ? 'An unexpected error occurred'
        : (err instanceof Error ? err.message : 'An unexpected error occurred'),
    },
  } satisfies ApiError)
}
