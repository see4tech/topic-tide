import { useQuery } from "@tanstack/react-query";
// import { fetchTopics } from "@/lib/airtable";
import { fetchTopics } from "@/lib/mysql";
import { NewsCard } from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;

export const NewsList = () => {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
    meta: {
      onError: (error: Error) => {
        toast({
          title: "Error",
          description: "No se pudieron cargar las noticias. Por favor, intente más tarde.",
          variant: "destructive",
        });
      },
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-destructive">Error al cargar las noticias</h2>
        <p className="text-muted-foreground mt-2">Por favor, intente más tarde</p>
      </div>
    );
  }

  if (!topics?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">No hay noticias disponibles</h2>
        <p className="text-muted-foreground">Vuelva más tarde para ver actualizaciones</p>
      </div>
    );
  }

  const totalPages = Math.ceil(topics.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTopics = topics.slice(startIndex, endIndex);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {currentTopics.map((topic) => (
          <NewsCard key={topic.id} topic={topic} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <Pagination className="justify-center">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                style={{ color: import.meta.env.VITE_PAGINATION_FONT_COLOR }}
              />
            </PaginationItem>
            
            {[...Array(totalPages)].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                  className="cursor-pointer"
                  style={{ color: import.meta.env.VITE_PAGINATION_FONT_COLOR }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                style={{ color: import.meta.env.VITE_PAGINATION_FONT_COLOR }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};