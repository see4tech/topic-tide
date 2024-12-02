import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import OpenAI from "openai";

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
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      
      if (!apiKey) {
        console.error('OpenAI API key not found');
        return;
      }

      const openai = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true
      });
      
      for (const topic of topics) {
        try {
          // Simple check if the title might be in English (contains common English words)
          const englishWords = /\b(the|is|are|was|were|has|have|had|will|would|could|should|may|might|must|can|court|urges|block|says|new|report|update)\b/i;
          const spanishChars = /[áéíóúñü¿¡]/i;
          const spanishCommonWords = /\b(el|la|los|las|un|una|unos|unas|y|en|de|para|por|con|sin|pero|que|como|este|esta|estos|estas)\b/i;
          
          console.log('Analyzing title:', topic.title);
          
          const hasEnglishWords = englishWords.test(topic.title);
          const hasSpanishSpecificChars = spanishChars.test(topic.title);
          const hasSpanishWords = spanishCommonWords.test(topic.title);
          
          if (hasSpanishSpecificChars || hasSpanishWords) {
            console.log('Text detected as Spanish, using original');
            translations[topic.id] = topic.title;
          } else if (hasEnglishWords) {
            console.log('Text detected as English, translating...');
            const completion = await openai.chat.completions.create({
              messages: [
                {
                  role: "system",
                  content: "You are a translator. Translate the following English text to Spanish. Only return the translation, nothing else."
                },
                {
                  role: "user",
                  content: topic.title
                }
              ],
              model: "gpt-4",
            });

            const translation = completion.choices[0]?.message?.content;
            if (translation) {
              console.log('Translation received:', translation);
              translations[topic.id] = translation;
            }
          } else {
            console.log('Language detection inconclusive, using original');
            translations[topic.id] = topic.title;
          }
        } catch (error) {
          console.error('Translation error:', error);
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