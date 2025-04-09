import { BaseError } from './base-error'

/**
 * Error thrown when the login attempt fails (i.e., incorrect credentials).
 */
export class LoginFailedError extends BaseError {
  constructor(message: string = 'Login failed due to invalid credentials') {
    super(message, 401, 'login_failed_error')
  }
}
