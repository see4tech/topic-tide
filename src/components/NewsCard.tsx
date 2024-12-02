import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "@/lib/airtable";
import { useEffect, useState } from "react";
import OpenAI from "openai";

interface NewsCardProps {
  topic: Topic;
}

export const NewsCard = ({ topic }: NewsCardProps) => {
  const [translatedTitle, setTranslatedTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

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
        // More comprehensive English detection
        const englishPattern = /^[a-zA-Z0-9\s,.'"-]*$/;
        const spanishChars = /[áéíóúñü¿¡]/i;
        const spanishCommonWords = /\b(el|la|los|las|un|una|unos|unas|y|en|de|para|por|con|sin|pero|que|como|este|esta|estos|estas)\b/i;
        
        console.log('Analyzing title:', topic.title);
        
        const hasOnlyEnglishChars = englishPattern.test(topic.title);
        const hasSpanishSpecificChars = spanishChars.test(topic.title);
        const hasSpanishWords = spanishCommonWords.test(topic.title);
        
        console.log('Language analysis:', {
          hasOnlyEnglishChars,
          hasSpanishSpecificChars,
          hasSpanishWords
        });

        // If text has Spanish-specific characters or common Spanish words, consider it Spanish
        if (hasSpanishSpecificChars || hasSpanishWords) {
          console.log('Text detected as Spanish, using original');
          setTranslatedTitle(topic.title);
        } else if (hasOnlyEnglishChars) {
          console.log('Text detected as English, translating...');
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
            setTranslatedTitle(translation);
          }
        } else {
          console.log('Language detection inconclusive, using original');
          setTranslatedTitle(topic.title);
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedTitle(topic.title);
      } finally {
        setIsLoading(false);
      }
    };

    translateTitle();
  }, [topic.title]);

  if (isLoading) {
    return null;
  }

  return (
    <Card className={`h-full overflow-hidden hover:shadow-lg transition-all flex flex-col bg-white border-gray-200 ${isExpanded ? 'h-auto' : ''}`}>
      <CardHeader className="p-0">
        <div className="relative">
          <a href={topic.link} target="_blank" rel="noopener noreferrer">
            <img
              src={topic.image || import.meta.env.VITE_DEFAULT_NEWS_IMAGE}
              alt={topic.title}
              className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
            />
          </a>
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-2 text-center">
            Haz clic en la imagen o el título para leer la historia completa
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="mb-3 text-sm text-muted-foreground flex items-center">
          <time dateTime={topic.pubDate} className="font-medium">
            {formattedDate}
          </time>
          {topic.creator && (
            <>
              <span className="mx-2">•</span>
              <span className="font-medium text-primary">{topic.creator}</span>
            </>
          )}
        </div>
        <a
          href={topic.link}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <h2 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors" style={{ color: '#216B67' }}>
            {translatedTitle}
          </h2>
        </a>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p className={`${isExpanded ? '' : 'line-clamp-3'} text-base leading-relaxed`}>
            {topic.content}
          </p>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsExpanded(!isExpanded);
          }}
          className="mt-4 inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium cursor-pointer"
        >
          {isExpanded ? 'Leer menos ↑' : 'Leer más ↓'}
        </button>
      </CardContent>
    </Card>
  );
};