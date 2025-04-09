"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArticleFormData, articleSchema } from "@/schemas/article-schema";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { FormField } from "@/components/form-field";
import { Label } from "@/components/ui/label";

type Props = {
  onSubmit: (data: ArticleFormData) => void;
  defaultValues?: ArticleFormData;
  isSubmitting?: boolean;
  submitLabel?: string;
};

export function ArticleForm({
  onSubmit,
  defaultValues,
  isSubmitting = false,
  submitLabel = "Publish Article",
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ArticleFormData>({
    resolver: zodResolver(articleSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <CardContent className="space-y-4">
        <FormField
          id="title"
          label="Title"
          type="text"
          register={register}
          error={errors.title?.message}
        />

        <div className="space-y-2">
          <Label htmlFor="content">Content</Label>
          <textarea
            id="content"
            {...register("content")}
            placeholder="Write the content of your article"
            className="w-full p-2 border rounded-md"
            rows={6}
          />
          {errors.content && (
            <p className="text-sm text-red-500">{errors.content.message}</p>
          )}
        </div>

        <FormField
          id="coverImage"
          label="Cover Image URL"
          type="text"
          register={register}
          error={errors.coverImage?.message}
        />
      </CardContent>

      <CardFooter className="flex justify-end space-x-4">
        <Button type="submit" className="w-32" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </CardFooter>
    </form>
  );
}
