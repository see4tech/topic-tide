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
      const newTranslations = { ...translations };
      let hasNewTranslations = false;

      const untranslatedTopics = topics.filter(topic => !translations[topic.id]);
      
      if (untranslatedTopics.length === 0) {
        console.log('TranslationHandler - All topics already translated');
        return;
      }

      console.log(`TranslationHandler - Found ${untranslatedTopics.length} untranslated topics`);

      for (const topic of untranslatedTopics) {
        console.log('TranslationHandler - Processing topic:', topic.title);
        const detection = detectLanguage(topic.title);
        
        if (!detection.hasSpanishSpecificChars || detection.hasEnglishWords || detection.hasEnglishPatterns || detection.shouldForceTranslate) {
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
          newTranslations[topic.id] = topic.title;
        }
      }

      if (hasNewTranslations) {
        console.log('TranslationHandler - Updating translations cache with batch results');
        await onTranslationsUpdate(newTranslations);
      }
    };

    translateTopics();
  }, [topics]); // Keep only topics in dependency array

  return null;
};