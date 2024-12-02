import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "@/lib/airtable";

interface NewsCardProps {
  topic: Topic;
}

export const NewsCard = ({ topic }: NewsCardProps) => {
  // Format the date if it exists
  const formattedDate = topic.pubDate ? new Date(topic.pubDate).toLocaleDateString() : '';

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
            {topic.title}
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