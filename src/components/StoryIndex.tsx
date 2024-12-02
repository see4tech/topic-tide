import { useQuery } from "@tanstack/react-query";
import { fetchTopics } from "@/lib/airtable";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { detectLanguage } from "@/utils/languageDetection";
import { translateTitle } from "@/services/translationService";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

export const StoryIndex = () => {
  const { toast } = useToast();
  const { data: topics, isLoading } = useQuery({
    queryKey: ["topics"],
    queryFn: fetchTopics,
  });

  const { data: translations, refetch: refetchTranslations } = useQuery({
    queryKey: ["translations"],
    initialData: {},
  });

  useEffect(() => {
    const translateTopics = async () => {
      if (!topics) return;

      const newTranslations = { ...translations };
      let hasNewTranslations = false;

      for (const topic of topics) {
        console.log('Checking translation for topic:', topic.title);
        
        // Skip if already translated
        if (translations[topic.id]) {
          console.log('Topic already translated:', topic.title);
          continue;
        }

        const detection = detectLanguage(topic.title);
        console.log('Language detection results:', detection);

        if (
          (detection.hasEnglishWords || detection.hasEnglishPatterns || detection.shouldForceTranslate) &&
          !detection.hasSpanishSpecificChars
        ) {
          try {
            console.log('Translating topic:', topic.title);
            const translatedTitle = await translateTitle(
              topic.title,
              import.meta.env.VITE_OPENAI_API_KEY
            );
            newTranslations[topic.id] = translatedTitle;
            hasNewTranslations = true;
          } catch (error) {
            console.error('Translation error:', error);
            toast({
              title: "Error de traducción",
              description: "No se pudo traducir el título",
              variant: "destructive",
            });
          }
        }
      }

      if (hasNewTranslations) {
        console.log('New translations found, updating cache');
        refetchTranslations();
      }
    };

    translateTopics();
  }, [topics, translations, toast, refetchTranslations]);

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
                {translations[topic.id] || topic.title}
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