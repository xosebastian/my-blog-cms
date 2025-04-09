import { BaseError } from './base-error'

/**
 * Error thrown when an article is not found in the database.
 */
export class ArticleNotFoundError extends BaseError {
  constructor(articleId: string) {
    super(`Article not found with ID: "${articleId}"`, 404, 'article_not_found')
  }
}
