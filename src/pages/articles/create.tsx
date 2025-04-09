'use client'

import { ArticleForm } from '@/components/article/article-form'
import { createArticle } from '@/lib/articles/create'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

/**
 * Page to create a new article.
 * 
 * Features:
 * - Renders a form for title, content, and cover image
 * - Uses React Query to submit the form via `createArticle`
 * - Displays toast notifications on success or failure
 * - Redirects to /articles/my on successful creation
 */
export default function CreateArticle() {
  const router = useRouter()

  /**
   * React Query mutation to create a new article.
   */
  const { mutate, isPending } = useMutation({
    mutationFn: createArticle,
    onSuccess: () => {
      toast.success('Article created successfully!')
      router.push('/articles/my')
    },
    onError: () => {
      toast.error('Failed to create article')
    },
  })

  return (
    <div className="mx-auto max-w-3xl pt-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create New Article</CardTitle>
          <CardDescription>Fill out the form to create a new article</CardDescription>
        </CardHeader>

        <ArticleForm
          onSubmit={(data) => mutate(data)}
          isSubmitting={isPending}
          submitLabel="Publish Article"
        />
      </Card>
    </div>
  )
}
