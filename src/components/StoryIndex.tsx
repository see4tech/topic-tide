import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { translate } from '@vitalets/google-translate-api';

export const StoryIndex = () => {
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  const [translatedTitles, setTranslatedTitles] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const translateTitles = async () => {
      if (!topics) return;

      const translations: { [key: string]: string } = {};
      
      for (const topic of topics) {
        try {
          // Simple check if the title might be in English (contains common English words)
          const mightBeEnglish = /\b(the|a|an|in|on|at|to|for|of|with)\b/i.test(topic.title);
          
          if (mightBeEnglish) {
            console.log(`Attempting to translate title: ${topic.title}`);
            const result = await translate(topic.title, { to: 'es' });
            translations[topic.id] = result.text;
            console.log(`Translated title: ${result.text}`);
          } else {
            translations[topic.id] = topic.title;
          }
        } catch (error) {
          console.error(`Translation error for ${topic.title}:`, error);
          translations[topic.id] = topic.title;
        }
      }
      
      setTranslatedTitles(translations);
    };

    translateTitles();
  }, [topics]);

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
                {translatedTitles[topic.id] || topic.title}
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