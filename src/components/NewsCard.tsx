import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "@/lib/airtable";

interface NewsCardProps {
  topic: Topic;
}

export const NewsCard = ({ topic }: NewsCardProps) => {
  // Format the date if it exists
  const formattedDate = topic.pubDate ? new Date(topic.pubDate).toLocaleDateString() : '';

  return (
    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="p-0">
        <img
          src={topic.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
          alt={topic.title}
          className="w-full h-48 object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <a
          href={topic.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform hover:-translate-y-1"
        >
          <h2 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-primary">{topic.title}</h2>
        </a>
        <p className="text-muted-foreground line-clamp-3 mb-4">{topic.content}</p>
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <time dateTime={topic.pubDate}>{formattedDate}</time>
          <span>{topic.creator}</span>
        </div>
      </CardContent>
    </Card>
  );
};