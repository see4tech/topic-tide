import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "@/lib/airtable";
import { useState } from "react";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/dateFormatter";

interface NewsCardProps {
  topic: Topic;
}

export const NewsCard = ({ topic }: NewsCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const formattedDate = formatDate(topic.pubDate);

  return (
    <Card className={`h-full overflow-hidden hover:shadow-lg transition-all flex flex-col bg-white border-gray-200 ${isExpanded ? 'h-auto' : ''}`}>
      <CardHeader className="p-0">
        <div className="relative">
          <Link to={`/story/${topic.id}`}>
            <img
              src={topic.image || import.meta.env.VITE_DEFAULT_NEWS_IMAGE}
              alt={topic.title}
              className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
            />
          </Link>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-xs p-2 text-center"
            style={{ color: import.meta.env.VITE_IMAGE_TEXT_FONT_COLOR }}
          >
            Haz clic en la imagen o el título para ver más detalles
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="mb-3 text-sm flex items-center">
          <time 
            dateTime={topic.pubDate} 
            className="font-medium"
            style={{ color: import.meta.env.VITE_PUBDATE_FONT_COLOR }}
          >
            {formattedDate}
          </time>
          {topic.creator && (
            <>
              <span className="mx-2">•</span>
              <span 
                className="font-medium"
                style={{ color: import.meta.env.VITE_AUTHOR_FONT_COLOR }}
              >
                {topic.creator}
              </span>
            </>
          )}
        </div>
        <Link
          to={`/story/${topic.id}`}
          className="group"
        >
          <h2 
            className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors"
            style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
          >
            {topic.title}
          </h2>
        </Link>
        <div className="prose prose-sm max-w-none">
          <p 
            className={`${isExpanded ? '' : 'line-clamp-3'} text-base leading-relaxed`}
            style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
          >
            {topic.contentSnippet}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          className="mt-4 inline-flex items-center transition-colors text-sm font-medium cursor-pointer"
          style={{ color: import.meta.env.VITE_READ_MORE_FONT_COLOR }}
        >
          {isExpanded ? 'Leer menos ↑' : 'Leer más ↓'}
        </button>
      </CardContent>
    </Card>
  );
};