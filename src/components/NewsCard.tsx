import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "@/lib/airtable";
import { useEffect, useState } from "react";
import OpenAI from "openai";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

interface NewsCardProps {
  topic: Topic;
}

export const NewsCard = ({ topic }: NewsCardProps) => {
  const [translatedTitle, setTranslatedTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const formattedDate = topic.pubDate 
    ? new Date(topic.pubDate).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      })
    : '';

  useEffect(() => {
    const translateTitle = async () => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey) {
        console.error('OpenAI API key not found');
        return;
      }

      try {
        const translations = queryClient.getQueryData<Record<string, string>>(["translations"]) || {};
        
        if (translations[topic.id]) {
          console.log('Using cached translation for:', topic.id);
          setTranslatedTitle(translations[topic.id]);
          setIsLoading(false);
          return;
        }

        // Enhanced English detection patterns with more comprehensive word list
        const englishWords = /\b(the|is|are|was|were|has|have|had|will|would|could|should|may|might|must|can|court|urges|block|says|new|report|update|man|with|to|backdoor|hackers|hacked|networks|pitch|services|cybersecurity|DOJ|and|by|about|stepping|up|its|bid|dethrone|getting|serious|verification|impersonation|what|going|on|with|name|uses|magazine|promote|software|billionaire|owner|time)\b/i;
        
        // Enhanced pattern to catch proper nouns and technical terms
        const englishPatterns = /\b(ing|ed|ly)\b|\b[A-Z][a-z]+ [A-Z][a-z]+\b|\b[A-Z][a-z]+\b|\b(AI|ChatGPT|X|DOJ)\b/;
        
        const spanishChars = /[áéíóúñü¿¡]/i;
        const spanishCommonWords = /\b(el|la|los|las|un|una|unos|unas|y|en|de|para|por|con|sin|pero|que|como|este|esta|estos|estas|según|así|qué)\b/i;

        console.log('Analyzing title:', topic.title);
        
        const hasEnglishWords = englishWords.test(topic.title);
        const hasEnglishPatterns = englishPatterns.test(topic.title);
        const hasSpanishSpecificChars = spanishChars.test(topic.title);
        const hasSpanishWords = spanishCommonWords.test(topic.title);
        
        console.log('Detection results:', {
          hasEnglishWords,
          hasEnglishPatterns,
          hasSpanishSpecificChars,
          hasSpanishWords,
          title: topic.title
        });

        // Force translation for titles containing specific keywords or patterns
        const forceTranslatePatterns = /(ChatGPT|Billionaire|AI Software|Magazine)/i;
        const shouldForceTranslate = forceTranslatePatterns.test(topic.title);

        let finalTranslation = topic.title;

        if (shouldForceTranslate || hasEnglishWords || hasEnglishPatterns) {
          if (!(hasSpanishSpecificChars && hasSpanishWords) || shouldForceTranslate) {
            console.log('Text detected as English or contains force-translate terms, translating...');
            const openai = new OpenAI({
              apiKey: apiKey,
              dangerouslyAllowBrowser: true
            });

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
              model: "gpt-4o-mini",
            });

            const translation = completion.choices[0]?.message?.content;
            if (translation) {
              console.log('Translation received:', translation);
              finalTranslation = translation;
            }
          } else {
            console.log('Text has both English and Spanish indicators, using original');
          }
        } else {
          console.log('Text detected as Spanish or no clear English patterns, using original');
        }

        queryClient.setQueryData<Record<string, string>>(["translations"], (old = {}) => ({
          ...old,
          [topic.id]: finalTranslation
        }));

        setTranslatedTitle(finalTranslation);
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedTitle(topic.title);
      } finally {
        setIsLoading(false);
      }
    };

    translateTitle();
  }, [topic.title, topic.id, queryClient]);

  if (isLoading) {
    return null;
  }

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
            {translatedTitle}
          </h2>
        </Link>
        <div className="prose prose-sm max-w-none">
          <p 
            className={`${isExpanded ? '' : 'line-clamp-3'} text-base leading-relaxed`}
            style={{ color: import.meta.env.VITE_TEXT_FONT_COLOR }}
          >
            {topic.content}
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