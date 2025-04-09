'use client'

import { useQuery, useMutation } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import { update } from '@/lib/articles/update'
import { ArticleForm } from '@/components/article/article-form'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { toast } from 'sonner'
import { fetchById } from '@/lib/articles/fetch-by-id'

/**
 * Page for editing an existing article.
 *
 * Features:
 * - Loads the current article data based on the ID from the route
 * - Displays the form pre-filled with existing data
 * - Submits the updated values via React Query mutation
 * - Redirects to "My Articles" upon success
 */
export default function EditArticle() {
  const params = useParams()
  const router = useRouter()
  const articleId = params?.id as string

  /**
   * Fetch the article data by ID for pre-filling the form.
   */
  const { data: article, isLoading } = useQuery({
    queryKey: ['article', articleId],
    queryFn: () => fetchById(articleId),
    enabled: !!articleId,
  })

  /**
   * Mutation to update the article.
   */
  const { mutate, isPending } = useMutation({
    mutationFn: (data: { title: string; content: string; coverImage: string }) =>
      update(articleId, data),
    onSuccess: () => {
      toast.success('Article updated!')
      router.push('/articles/my')
    },
    onError: () => {
      toast.error('Failed to update article')
    },
  })

  if (isLoading) return <p>Loading...</p>

  return (
    <div className="mx-auto max-w-3xl pt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Edit Article</CardTitle>
          <CardDescription>Update the article information below</CardDescription>
        </CardHeader>

        <ArticleForm
          defaultValues={{
            title: article?.title || '',
            content: article?.content || '',
            coverImage: article?.coverImage || '',
          }}
          onSubmit={(data) => mutate(data)}
          isSubmitting={isPending}
          submitLabel="Update Article"
        />
      </Card>
    </div>
  )
}
