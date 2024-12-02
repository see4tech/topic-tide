import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "@/lib/airtable";
import { useEffect, useState } from "react";
import OpenAI from "openai";

interface NewsCardProps {
  topic: Topic;
}

export const NewsCard = ({ topic }: NewsCardProps) => {
  const [translatedTitle, setTranslatedTitle] = useState(topic.title);

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
        const commonEnglishWords = /\b(the|is|are|what|how|why|when|who|this|that|with)\b/i;
        if (commonEnglishWords.test(topic.title)) {
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
            model: "gpt-4",
          });

          const translation = completion.choices[0]?.message?.content;
          if (translation) {
            console.log('Translated title:', translation);
            setTranslatedTitle(translation);
          }
        }
      } catch (error) {
        console.error('Translation error:', error);
        setTranslatedTitle(topic.title);
      }
    };

    translateTitle();
  }, [topic.title]);

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow flex flex-col bg-white border-gray-200">
      <CardHeader className="p-0">
        <div className="relative">
          <a href={topic.link} target="_blank" rel="noopener noreferrer">
            <img
              src={topic.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
              alt={topic.title}
              className="w-full h-48 object-cover hover:opacity-90 transition-opacity"
            />
          </a>
          <div className="absolute top-0 left-0 bg-primary/90 text-white px-3 py-1 text-sm m-3 rounded">
            TECNOLOGÍA
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
          <h2 className="text-xl font-bold mb-3 leading-tight group-hover:text-primary transition-colors">
            {translatedTitle}
          </h2>
        </a>
        <div className="prose prose-sm max-w-none text-gray-600">
          <p className="line-clamp-3 text-base leading-relaxed">
            {topic.content}
          </p>
        </div>
        <a
          href={topic.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center text-primary hover:text-primary/80 transition-colors text-sm font-medium"
        >
          Leer más →
        </a>
      </CardContent>
    </Card>
  );
};