import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/mysql";
import { NewsCard } from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 6;
const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const NewsList = () => {
  console.log("NewsList component rendering");
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedScore, setSelectedScore] = useState<string>("high");

  const { data: topics, isLoading, error, isError } = useQuery({
    queryKey: ["topics"],
    queryFn: async () => {
      try {
        console.log("Fetching topics...");
        const topics = await fetchTopics();
        console.log("Fetched topics:", topics);
        return topics;
      } catch (error) {
        console.error("Error fetching topics:", error);
        throw error;
      }
    },
    refetchInterval: REFETCH_INTERVAL,
    refetchOnWindowFocus: true,
    meta: {
      onSettled: (data, error) => {
        if (error) {
          toast({
            title: "Error",
            description: "No se pudieron cargar las noticias. Por favor, intente más tarde.",
            variant: "destructive",
          });
        }
      },
    },
  });

  console.log("Current topics state:", topics);
  console.log("Loading state:", isLoading);
  console.log("Error state:", error);

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
    console.error("Error in NewsList:", error);
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-destructive">Error al cargar las noticias</h2>
        <p className="text-muted-foreground mt-2">Por favor, intente más tarde</p>
      </div>
    );
  }

  if (!topics || !Array.isArray(topics) || topics.length === 0) {
    console.log("No topics available or invalid topics data");
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">No hay noticias disponibles</h2>
        <p className="text-muted-foreground">Vuelva más tarde para ver actualizaciones</p>
      </div>
    );
  }

  // Group topics by puntuacion
  const groupedTopics = topics.reduce((acc, topic) => {
    const score = topic.puntuacion || 0;
    if (score === 1) {
      acc.high.push(topic);
    } else if (score === 2) {
      acc.medium.push(topic);
    } else if (score === 3) {
      acc.low.push(topic);
    }
    return acc;
  }, { high: [], medium: [], low: [] });

  console.log("Grouped topics by puntuacion:", groupedTopics);

  // Filter topics based on selected score group
  let filteredTopics = [];
  switch (selectedScore) {
    case 'high':
      filteredTopics = groupedTopics.high;
      break;
    case 'medium':
      filteredTopics = groupedTopics.medium;
      break;
    case 'low':
      filteredTopics = groupedTopics.low;
      break;
    default:
      filteredTopics = [...groupedTopics.high, ...groupedTopics.medium, ...groupedTopics.low];
  }

  const totalPages = Math.ceil(filteredTopics.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTopics = filteredTopics.slice(startIndex, endIndex);

  return (
    <div className="space-y-12">
      <div className="flex items-center gap-4 flex-wrap">
        <Button
          variant={selectedScore === "high" ? "default" : "outline"}
          onClick={() => setSelectedScore("high")}
        >
          Noticias Destacadas ({groupedTopics.high.length})
        </Button>
        <Button
          variant={selectedScore === "medium" ? "default" : "outline"}
          onClick={() => setSelectedScore("medium")}
        >
          Noticias Relevantes ({groupedTopics.medium.length})
        </Button>
        <Button
          variant={selectedScore === "low" ? "default" : "outline"}
          onClick={() => setSelectedScore("low")}
        >
          Otras Noticias ({groupedTopics.low.length})
        </Button>
        <Button
          variant={selectedScore === "all" ? "default" : "outline"}
          onClick={() => setSelectedScore("all")}
        >
          Todas las noticias
        </Button>
      </div>

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
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
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
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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