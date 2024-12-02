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
      if (!topics?.length) {
        console.log('TranslationHandler - No topics to translate');
        return;
      }

      console.log('TranslationHandler - Starting batch translation');
      
      const newTranslations: Record<string, string> = {};
      let hasNewTranslations = false;

      for (const topic of topics) {
        // Check if we already have a translation
        if (translations[topic.id]) {
          console.log('TranslationHandler - Using cached translation for:', topic.id);
          newTranslations[topic.id] = translations[topic.id];
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

        try {
          let translatedTitle = topic.title;
          
          if (detection.hasEnglishWords || detection.hasEnglishPatterns || detection.shouldForceTranslate) {
            console.log('TranslationHandler - Attempting translation for:', topic.title);
            translatedTitle = await translateTitle(
              topic.title,
              import.meta.env.VITE_OPENAI_API_KEY
            );
            console.log('TranslationHandler - Translation received:', {
              original: topic.title,
              translated: translatedTitle
            });
            hasNewTranslations = true;
          } else {
            console.log('TranslationHandler - Text detected as Spanish, keeping original:', topic.title);
          }
          
          newTranslations[topic.id] = translatedTitle;

          // Update the query cache immediately for each translation
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
          // Use original title as fallback
          newTranslations[topic.id] = topic.title;
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