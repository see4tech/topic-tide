import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

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
          <Link 
            key={topic.id} 
            to={`/story/${topic.id}`}
            className="block p-4 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h2 
                className="text-xl font-semibold"
                style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
              >
                {topic.title}
              </h2>
              <time 
                dateTime={topic.pubDate}
                className="text-sm"
                style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
              >
                {new Date(topic.pubDate).toLocaleDateString('es-ES')}
              </time>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};