import { Topic } from "@/lib/airtable";
import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { detectLanguage } from "@/utils/languageDetection";
import { translateTitle } from "@/services/translationService";
import { useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();

  useEffect(() => {
    const translateTopics = async () => {
      if (!topics) return;

      console.log('TranslationHandler - Starting batch translation for all topics');
      
      const newTranslations = { ...translations };
      let hasNewTranslations = false;

      // Sort topics by date to identify the most recent ones
      const sortedTopics = [...topics].sort((a, b) => 
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      );

      console.log('TranslationHandler - Processing sorted topics. Last two:', 
        sortedTopics.slice(0, 2).map(t => ({
          id: t.id,
          title: t.title,
          pubDate: t.pubDate
        }))
      );

      for (const topic of sortedTopics) {
        if (translations[topic.id]) {
          console.log('TranslationHandler - Using cached translation for:', topic.id);
          continue;
        }

        console.log('TranslationHandler - Processing topic:', {
          id: topic.id,
          title: topic.title
        });

        const detection = detectLanguage(topic.title);
        console.log('TranslationHandler - Language detection results:', {
          title: topic.title,
          ...detection
        });

        if (detection.hasEnglishWords || detection.hasEnglishPatterns || detection.shouldForceTranslate) {
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

            // Update the query cache immediately
            queryClient.setQueryData(
              ["translations"],
              (oldData: Record<string, string> = {}) => ({
                ...oldData,
                [topic.id]: translatedTitle
              })
            );
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
          
          // Update the query cache for Spanish titles too
          queryClient.setQueryData(
            ["translations"],
            (oldData: Record<string, string> = {}) => ({
              ...oldData,
              [topic.id]: topic.title
            })
          );
        }
      }

      if (hasNewTranslations) {
        console.log('TranslationHandler - Final translations:', newTranslations);
        await onTranslationsUpdate(newTranslations);
      }
    };

    translateTopics();
  }, [topics, translations, onTranslationsUpdate, queryClient, toast]);

  return null;
};