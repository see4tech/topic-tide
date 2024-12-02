import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { NewsCard } from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

export const NewsList = () => {
  const { toast } = useToast();
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch news. Please try again later.",
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

  if (!topics?.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold">No news available</h2>
        <p className="text-muted-foreground">Check back later for updates</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
      {topics.map((topic) => (
        <NewsCard key={topic.id} topic={topic} />
      ))}
    </div>
  );
};