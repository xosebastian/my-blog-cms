"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, User } from "lucide-react";
import { AuthorDto } from "@/models/author";
import Image from "next/image";

type AuthorListProps = {
  authors: AuthorDto[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
};

/**
 * Component that displays a list of authors in cards.
 *
 * @param authors - List of authors to display.
 * @param totalPages - Total number of available pages for pagination.
 * @param currentPage - The current page number.
 * @param onPageChange - Function to handle page change.
 */
export default function AuthorList({
  authors,
  totalPages,
  currentPage,
  onPageChange,
}: AuthorListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Authors</h2>

      {/* Responsive grid of author cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {authors.map((author) => (
          <Card key={author.id} className="flex flex-col">
            <div className="relative aspect-square w-full overflow-hidden">
              {/* Author's image */}

              <Image
                src={author.image || "/placeholder.svg"} // Default image in case there is no image
                alt={`Photo of ${author.name}`}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                {author.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground">
                {author.totalArticles}{" "}
                {author.totalArticles === 1 ? "article" : "articles"}
              </p>
            </CardContent>
            <CardFooter>
              <Link href={`/articles/author/${author.id}`} className="w-full">
                <Button variant="outline" className="w-full">
                  View Articles
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous Page</span>
          </Button>

          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next Page</span>
          </Button>
        </div>
      )}
    </div>
  );
}
