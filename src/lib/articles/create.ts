import { ArticleFormData } from "@/schemas/article-schema"

/**
 * Creates a new article by sending a POST request to the API.
 * 
 * @param {ArticleFormData} data - The data for the article to create.
 * @returns {Promise<any>} The created article object.
 * @throws {Error} If the article creation fails.
 */
export async function createArticle(data: ArticleFormData) {
  const response = await fetch('/api/articles/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error('Error creating article')
  }

  const article = await response.json()
  return article
}
