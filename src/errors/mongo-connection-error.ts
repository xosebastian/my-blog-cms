import { BaseError } from './base-error'

/**
 * Error thrown when a connection to MongoDB fails.
 */
export class MongoConnectionError extends BaseError {
  constructor(message: string = 'Failed to connect to MongoDB') {
    super(message, 500, 'mongo_connection_error')
  }
}
