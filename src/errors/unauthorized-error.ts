import { BaseError } from './base-error'

/**
 * Error thrown when a user is not authorized (i.e., no valid session).
 */
export class UnauthorizedError extends BaseError {
  constructor(message: string = 'User is not authorized') {
    super(message, 401, 'unauthorized_error')
  }
}
