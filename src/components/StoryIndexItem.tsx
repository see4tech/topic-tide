import { Link } from "react-router-dom";
import { Topic } from "@/lib/airtable";

interface StoryIndexItemProps {
  topic: Topic;
  translatedTitle: string;
}

export const StoryIndexItem = ({ topic, translatedTitle }: StoryIndexItemProps) => {
  return (
    <Link 
      to={`/story/${topic.id}`}
      className="block p-4 rounded-lg border hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <h2 
          className="text-xl font-semibold"
          style={{ color: import.meta.env.VITE_TITLE_FONT_COLOR }}
        >
          {translatedTitle || topic.title}
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
  );
};