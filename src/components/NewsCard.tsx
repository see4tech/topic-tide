import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "@/lib/airtable";
import { useEffect, useState } from "react";
import OpenAI from "openai";

interface NewsCardProps {
  topic: Topic;
}

export const NewsCard = ({ topic }: NewsCardProps) => {
  const [translatedTitle, setTranslatedTitle] = useState(topic.title);

  // Format the date if it exists
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
        // Simple check if the text might be in English (contains common English words)
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
        setTranslatedTitle(topic.title); // Fallback to original title
      }
    };

    translateTitle();
  }, [topic.title]);

  console.log('Raw pubDate:', topic.pubDate);
  console.log('Formatted date:', formattedDate);

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
      <CardHeader className="p-0">
        <a href={topic.link} target="_blank" rel="noopener noreferrer">
          <img
            src={topic.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
            alt={topic.title}
            className="w-full h-48 object-cover"
          />
        </a>
      </CardHeader>
      <CardContent className="p-6 flex flex-col flex-grow">
        <a
          href={topic.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block mb-4"
        >
          <h2 className="text-lg font-semibold hover:text-primary leading-relaxed" style={{ color: '#216B67' }}>
            {translatedTitle}
          </h2>
        </a>
        <p className="text-muted-foreground mb-8 line-clamp-4 flex-grow">
          {topic.content}
        </p>
        <div className="flex justify-between items-center text-sm text-muted-foreground border-t pt-4 mt-auto">
          <time dateTime={topic.pubDate} className="font-medium">
            {formattedDate}
          </time>
          <span>{topic.creator}</span>
        </div>
      </CardContent>
    </Card>
  );
};