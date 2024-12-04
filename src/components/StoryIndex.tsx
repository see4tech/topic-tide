import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/mysql";
import { Skeleton } from "@/components/ui/skeleton";
import { StoryIndexItem } from "./StoryIndexItem";

export const StoryIndex = () => {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (!topics?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">No stories available</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 
        className="text-3xl font-bold mb-6"
        style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
      >
        Índice de Historias
      </h1>
      
      <div className="space-y-4">
        {topics.map((topic) => (
          <StoryIndexItem 
            key={topic.id}
            topic={topic}
          />
        ))}
      </div>
    </div>
  );
};
