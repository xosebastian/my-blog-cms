
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Edit,
  Trash,
} from "lucide-react";
import { ArticleDto } from "@/models/article";
import { format } from 'date-fns'

type ArticleListProps = {
  articles: ArticleDto[];
  totalPages: number;
  currentPage: number;
  query?: string; 
  onPageChange?: (page: number) => void;
  showAuthor?: boolean;
  title?: string;
  onEdit?: (articleId: string) => void;
  onDelete?: (articleId: string) => void;
};

export default function ArticleList({
  articles,
  totalPages,
  currentPage,
  query,
  onPageChange,
  showAuthor = true,
  title = "Articles",
  onEdit,
  onDelete,
}: ArticleListProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>

      {articles.length === 0 ? (
        <p className="text-center text-muted-foreground">No articles found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="flex flex-col">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={article.coverImage || "/placeholder.svg"}
                  alt={article.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="mt-4">
                <CardTitle>{article.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(article.createdAt), 'dd/MM/yyyy')}
                  </div>

                  {showAuthor && (
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <Link
                        href={`/articles/${article.authorId}`}
                        className="hover:underline"
                      >
                        {article.authorName}
                      </Link>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3">{article.content}</p>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Link href={`/articles/view/${article.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Read more
                  </Button>
                </Link>

                {/* Conditionally render Edit and Delete buttons */}
                {onEdit && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onEdit(article.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                )}

                {onDelete && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => onDelete(article.id)}
                  >
                    <Trash className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {query ? (
            <>
              <Link
                href={`/articles/search?q=${encodeURIComponent(query)}&page=${
                  currentPage - 1
                }`}
                passHref
              >
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous page</span>
                </Button>
              </Link>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <Link
                href={`/articles/search?q=${encodeURIComponent(query)}&page=${
                  currentPage + 1
                }`}
                passHref
              >
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next page</span>
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Previous page</span>
              </Button>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
                <span className="sr-only">Next page</span>
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
