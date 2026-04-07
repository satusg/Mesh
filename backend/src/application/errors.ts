/**
 * Typed error for the application layer.
 * Infrastructure adapters throw these so the HTTP layer can map them
 * to meaningful status codes without leaking internal details.
 */
export class ApplicationError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly httpStatus: number = 400,
  ) {
    super(message)
    this.name = 'ApplicationError'
  }
}
