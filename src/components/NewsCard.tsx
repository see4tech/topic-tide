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
          className="w-full h-64 object-cover"
        />
      </CardHeader>
      <CardContent className="p-6">
        <a
          href={topic.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block transition-transform hover:-translate-y-1"
        >
          <h2 className="text-xl font-semibold mb-4 hover:text-primary">{topic.title}</h2>
        </a>
        <p className="text-muted-foreground mb-8 min-h-[120px]">{topic.content}</p>
        <div className="flex justify-between items-center text-sm text-muted-foreground mt-auto">
          <time dateTime={topic.pubDate}>{formattedDate}</time>
          <span>{topic.creator}</span>
        </div>
      </CardContent>
    </Card>
  );
};