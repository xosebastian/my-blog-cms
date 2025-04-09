import { ArticleFormData } from '@/schemas/article-schema'

/**
 * Updates an existing article by ID using the API route.
 * 
 * @param id - The ID of the article to update
 * @param data - The updated form data
 * @returns The updated article or throws error
 */
export async function update(id: string, data: ArticleFormData): Promise<void> {
  const res = await fetch(`/api/articles/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to update article')
  }
}
