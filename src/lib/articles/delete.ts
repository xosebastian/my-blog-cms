/**
 * Deletes an article by ID using the API route.
 * 
 * @param id - The ID of the article to delete
 */
export async function deleteArticle(id: string): Promise<void> {
  const res = await fetch(`/api/articles/${id}`, {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || 'Failed to delete article')
  }
}
