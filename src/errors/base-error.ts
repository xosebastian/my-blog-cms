/**
 * Base class for all custom application errors.
 */
export class BaseError extends Error {
    public readonly statusCode: number
    public readonly type: string
  
    constructor(message: string, statusCode = 500, type = 'internal_error') {
      super(message)
      this.name = this.constructor.name
      this.statusCode = statusCode
      this.type = type
      Error.captureStackTrace?.(this, this.constructor)
    }
  }
  