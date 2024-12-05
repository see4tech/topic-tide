import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/mysql";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/utils/dateFormatter";

const Story = () => {
  const { id } = useParams();
  console.log("Looking for story with ID:", id);
  
  const { data: topics, isLoading, error } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  console.log("Fetched topics:", topics);

  const story = topics?.find((t) => t.id.toString() === id);
  console.log("Found story:", story);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Cargando...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1>Error al cargar la historia</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Volver a la página principal
        </Link>
      </div>
    );
  }

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

  const formattedDate = formatDate(story.pubDate);

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
            {story.tituloTraducido || story.titulo}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-sm mb-8">
            {story.creador && (
              <span
                className="font-medium"
                style={{ color: import.meta.env.VITE_AUTHOR_FONT_COLOR }}
              >
                Por {story.creador}
              </span>
            )}
            <time
              dateTime={story.pubDate}
              className="text-sm"
              style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
            >
              {formattedDate}
            </time>
          </div>

          <div className="mb-8">
            <img
              src={story.imagen || import.meta.env.VITE_DEFAULT_NEWS_IMAGE}
              alt={story.tituloTraducido || story.titulo}
              className="w-full h-[400px] object-cover rounded-lg shadow-lg"
              onError={(e) => {
                console.log('Image failed to load, using default image');
                e.currentTarget.src = import.meta.env.VITE_DEFAULT_NEWS_IMAGE;
              }}
            />
          </div>

          <div
            className="prose prose-lg max-w-none mb-8"
            style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
            dangerouslySetInnerHTML={{ __html: story.contenidoNoticioso }}
          />

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