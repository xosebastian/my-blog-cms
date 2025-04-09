import { BaseError } from './base-error';

/**
 * Error thrown when the user registration fails (e.g., email already exists).
 */
export class SignUpFailedError extends BaseError {
  constructor(message: string = 'User registration failed') {
    super(message, 400, 'signup_failed_error');
  }
}
