import { useQuery } from "@tanstack/react-query";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ITEMS_PER_PAGE = 6;
const REFETCH_INTERVAL = 5 * 60 * 1000; // 5 minutes

export const NewsList = () => {
  console.log("NewsList component rendering");
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

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

  // Get unique categories
  const categories = ["all", ...new Set(topics.map(topic => topic.categoria))];

  // Filter topics by category if selected
  const filteredTopics = selectedCategory === "all" 
    ? topics 
    : topics.filter(topic => topic.categoria === selectedCategory);

  // Group topics by puntuacion
  const groupedTopics = filteredTopics.reduce((acc, topic) => {
    const score = topic.puntuacion || 0;
    if (score >= 8) {
      acc.high.push(topic);
    } else if (score >= 5) {
      acc.medium.push(topic);
    } else {
      acc.low.push(topic);
    }
    return acc;
  }, { high: [], medium: [], low: [] });

  // Combine all topics in the desired order (high priority first)
  const allTopics = [...groupedTopics.high, ...groupedTopics.medium, ...groupedTopics.low];
  const totalPages = Math.ceil(allTopics.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTopics = allTopics.slice(startIndex, endIndex);

  console.log("Rendering grouped topics:", groupedTopics);

  return (
    <div className="space-y-12">
      <div className="w-full max-w-xs">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === "all" ? "Todas las categorías" : category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {groupedTopics.high.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}>
            Noticias Destacadas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {currentTopics.filter(topic => (topic.puntuacion || 0) >= 8).map((topic) => (
              <NewsCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {groupedTopics.medium.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}>
            Noticias Relevantes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {currentTopics.filter(topic => (topic.puntuacion || 0) >= 5 && (topic.puntuacion || 0) < 8).map((topic) => (
              <NewsCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

      {groupedTopics.low.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6" style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}>
            Otras Noticias
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {currentTopics.filter(topic => (topic.puntuacion || 0) < 5).map((topic) => (
              <NewsCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      )}

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