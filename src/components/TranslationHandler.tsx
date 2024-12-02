import { Topic } from "@/lib/airtable";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { detectLanguage } from "@/utils/languageDetection";
import { translateTitle } from "@/services/translationService";

interface TranslationHandlerProps {
  topics: Topic[];
  translations: Record<string, string>;
  onTranslationsUpdate: (newTranslations: Record<string, string>) => Promise<void>;
}

export const TranslationHandler = ({ 
  topics, 
  translations, 
  onTranslationsUpdate 
}: TranslationHandlerProps) => {
  const { toast } = useToast();

  useEffect(() => {
    const translateTopics = async () => {
      if (!topics) return;

      console.log('TranslationHandler - Starting batch translation for all topics');
      console.log('TranslationHandler - Topics received:', topics.map(t => ({ id: t.id, title: t.title })));
      
      const newTranslations = { ...translations };
      let hasNewTranslations = false;

      const untranslatedTopics = topics.filter(topic => !translations[topic.id]);
      
      if (untranslatedTopics.length === 0) {
        console.log('TranslationHandler - All topics already translated');
        return;
      }

      console.log(`TranslationHandler - Found ${untranslatedTopics.length} untranslated topics`);

      // Sort topics by date to identify the most recent ones
      const sortedTopics = [...untranslatedTopics].sort((a, b) => 
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      console.log('TranslationHandler - Last two articles:', 
        sortedTopics.slice(0, 2).map(t => ({
          id: t.id,
          title: t.title,
          pubDate: t.pubDate
        }))
      );

      for (const topic of sortedTopics) {
        console.log('\nTranslationHandler - Processing topic:', {
          id: topic.id,
          title: topic.title,
          pubDate: topic.pubDate
        });

        const detection = detectLanguage(topic.title);
        console.log('TranslationHandler - Language detection results:', {
          title: topic.title,
          ...detection
        });
        
        if (!detection.hasSpanishSpecificChars || detection.hasEnglishWords || detection.hasEnglishPatterns || detection.shouldForceTranslate) {
          try {
            console.log('TranslationHandler - Attempting translation for:', topic.title);
            const translatedTitle = await translateTitle(
              topic.title,
              import.meta.env.VITE_OPENAI_API_KEY
            );
            console.log('TranslationHandler - Translation received:', {
              original: topic.title,
              translated: translatedTitle
            });
            
            newTranslations[topic.id] = translatedTitle;
            hasNewTranslations = true;
          } catch (error) {
            console.error('TranslationHandler - Translation error:', error);
            toast({
              title: "Error de traducción",
              description: "No se pudo traducir el título",
              variant: "destructive",
            });
          }
        } else {
          console.log('TranslationHandler - Text detected as Spanish, skipping translation:', topic.title);
          newTranslations[topic.id] = topic.title;
        }
      }

      if (hasNewTranslations) {
        console.log('TranslationHandler - Final translations:', newTranslations);
        await onTranslationsUpdate(newTranslations);
      }
    };

    translateTopics();
  }, [topics]); // Keep only topics in dependency array

  return null;
};