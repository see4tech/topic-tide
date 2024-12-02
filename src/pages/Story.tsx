import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { useParams, Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const Story = () => {
  const { id } = useParams();
  const [fullContent, setFullContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  const story = topics?.find(topic => topic.id === id);

  useEffect(() => {
    const fetchContent = async (url: string) => {
      setIsLoadingContent(true);
      try {
        console.log('Fetching content from:', url);
        const response = await fetch(url);
        const html = await response.text();
        
        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Try to find the main content
        // This is a simple example - you might need to adjust selectors based on the target sites
        const article = doc.querySelector('article') || 
                       doc.querySelector('main') || 
                       doc.querySelector('.content') ||
                       doc.querySelector('.post-content');
                       
        if (article) {
          console.log('Content found:', article.textContent);
          setFullContent(article.textContent);
        } else {
          console.log('No content found, using original content');
          setFullContent(null);
        }
      } catch (err) {
        console.error('Error fetching content:', err);
        setError("Couldn't fetch the full story. Showing available content instead.");
        setFullContent(null);
      } finally {
        setIsLoadingContent(false);
      }
    };

    if (story?.link) {
      fetchContent(story.link);
    }
  }, [story?.link]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-8 w-64 mb-4" />
        <Skeleton className="h-4 w-32 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold">Story not found</h2>
        <Link 
          to="/"
          className="inline-flex items-center mt-4 text-sm font-medium"
          style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: import.meta.env.VITE_BODY_BG_COLOR }}>
      <div className="container mx-auto px-4 py-8">
        <Link 
          to="/"
          className="inline-flex items-center mb-6 text-sm font-medium"
          style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>
        
        <article className="max-w-3xl mx-auto">
          <h1 
            className="text-3xl font-bold mb-4"
            style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
          >
            {story.title}
          </h1>
          
          <div className="mb-6 flex items-center gap-2">
            <time 
              dateTime={story.pubDate}
              className="text-sm font-medium"
              style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
            >
              {new Date(story.pubDate).toLocaleDateString('es-ES')}
            </time>
            {story.creator && (
              <>
                <span>•</span>
                <span 
                  className="text-sm font-medium"
                  style={{ color: import.meta.env.VITE_AUTHOR_FONT_COLOR }}
                >
                  {story.creator}
                </span>
              </>
            )}
          </div>

          {story.image && (
            <img
              src={story.image}
              alt={story.title}
              className="w-full h-auto rounded-lg mb-8"
            />
          )}

          {isLoadingContent ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div 
              className="prose prose-lg max-w-none"
              style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
            >
              {error && (
                <p className="text-red-500 mb-4">{error}</p>
              )}
              <p className="whitespace-pre-wrap">
                {fullContent || story.content}
              </p>
            </div>
          )}

          {story.link && (
            <a
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-8 text-sm font-medium"
              style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
            >
              Leer la historia original ↗
            </a>
          )}
        </article>
      </div>
      <Footer />
    </div>
  );
};

export default Story;