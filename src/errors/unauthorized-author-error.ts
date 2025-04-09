import { BaseError } from './base-error'

/**
 * Error thrown when the user is not authorized to modify the article.
 */
export class UnauthorizedAuthorError extends BaseError {
  constructor() {
    super('You are not allowed to modify this article.', 403, 'unauthorized_author')
  }
}
