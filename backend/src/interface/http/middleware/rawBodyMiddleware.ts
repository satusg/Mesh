import { Request, Response, NextFunction } from 'express'

/**
 * Stores the raw request body buffer on req.rawBody.
 * Required for webhook signature verification.
 * Apply ONLY to webhook routes — before express.json().
 */
export function rawBodyMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const chunks: Buffer[] = []

  req.on('data', (chunk: Buffer) => chunks.push(chunk))
  req.on('end', () => {
    ;(req as Request & { rawBody: Buffer }).rawBody = Buffer.concat(chunks)
    next()
  })
  req.on('error', next)
}
