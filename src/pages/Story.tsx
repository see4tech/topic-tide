import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { ArrowLeft } from "lucide-react";

const Story = () => {
  const { id } = useParams();
  
  const { data: topics } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  // Get translations from the cache
  const { data: translations } = useQuery({
    queryKey: ["translations"],
    initialData: {},
  });

  const story = topics?.find((t) => t.id === id);

  if (!story) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Historia no encontrada</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Volver a la página principal
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: import.meta.env.VITE_BODY_BG_COLOR }}>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 mb-6 hover:underline"
            style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Noticias
          </Link>

          <h1 
            className="text-4xl font-bold mb-4"
            style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
          >
            {translations[story.id] || story.title}
          </h1>

          <div className="flex items-center gap-4 text-sm">
            <span style={{ color: import.meta.env.VITE_AUTHOR_FONT_COLOR }}>
              Por {story.creator}
            </span>
            <time 
              dateTime={story.pubDate}
              className="text-sm"
              style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
            >
              {new Date(story.pubDate).toLocaleDateString('es-ES')}
            </time>
          </div>

          {story.image && (
            <img
              src={story.image}
              alt={translations[story.id] || story.title}
              className="w-full h-96 object-cover rounded-lg my-8"
            />
          )}

          <div 
            className="prose prose-lg max-w-none mb-8"
            style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
          >
            <p>{story.content}</p>
          </div>

          {story.link && (
            <a
              href={story.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm hover:underline"
              style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
            >
              Leer la noticia completa en el sitio original →
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Story;