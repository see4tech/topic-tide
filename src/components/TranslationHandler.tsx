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

      const newTranslations = { ...translations };
      let hasNewTranslations = false;

      for (const topic of topics) {
        console.log('TranslationHandler - Processing topic:', topic.title);
        
        if (translations[topic.id]) {
          console.log('TranslationHandler - Using cached translation for:', topic.id);
          continue;
        }

        const detection = detectLanguage(topic.title);
        console.log('TranslationHandler - Language detection results:', detection);

        if (!detection.hasSpanishSpecificChars || detection.hasEnglishWords || detection.hasEnglishPatterns) {
          try {
            console.log('TranslationHandler - Translating topic:', topic.title);
            const translatedTitle = await translateTitle(
              topic.title,
              import.meta.env.VITE_OPENAI_API_KEY
            );
            console.log('TranslationHandler - Translation received:', translatedTitle);
            
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
          console.log('TranslationHandler - Text detected as Spanish, skipping translation');
        }
      }

      if (hasNewTranslations) {
        console.log('TranslationHandler - Updating translations cache');
        await onTranslationsUpdate(newTranslations);
      }
    };

    translateTopics();
  }, [topics, translations, toast, onTranslationsUpdate]);

  return null;
};