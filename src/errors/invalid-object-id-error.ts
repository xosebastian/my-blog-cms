import { BaseError } from './base-error'

/**
 * Error thrown when a provided ID is not a valid MongoDB ObjectId.
 */
export class InvalidObjectIdError extends BaseError {
  constructor(id: string) {
    super(`Invalid ObjectId: "${id}"`, 400, 'invalid_object_id')
  }
}
