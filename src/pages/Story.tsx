import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const Story = () => {
  const { id } = useParams();
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  const story = topics?.find(topic => topic.id === id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto space-y-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-64 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="container mx-auto px-4 py-8 flex-grow">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-2xl font-bold mb-4">Story not found</h1>
            <p className="text-muted-foreground">
              The story you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: import.meta.env.VITE_BODY_BG_COLOR }}
    >
      <main className="container mx-auto px-4 py-8 flex-grow">
        <div className="max-w-4xl mx-auto space-y-8">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm hover:underline mb-8"
            style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Noticias
          </a>

          <h1 
            className="text-4xl font-bold"
            style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
          >
            {story.title}
          </h1>

          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: import.meta.env.VITE_AUTHOR_FONT_COLOR }}>
              Por {story.creator}
            </span>
            <time 
              dateTime={story.pubDate}
              style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
            >
              {new Date(story.pubDate).toLocaleDateString('es-ES')}
            </time>
          </div>

          {story.image && (
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          )}

          <div 
            className="prose prose-lg max-w-none"
            style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
          >
            <p className="whitespace-pre-wrap">{story.content}</p>
          </div>

          {story.link && (
            <a
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm hover:underline"
              style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
            >
              Leer la historia completa en el sitio original →
            </a>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Story;