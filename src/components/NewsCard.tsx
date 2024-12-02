import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Topic } from "@/lib/airtable";

interface NewsCardProps {
  topic: Topic;
}

export const NewsCard = ({ topic }: NewsCardProps) => {
  return (
    <a
      href={topic.link}
      target="_blank"
      rel="noopener noreferrer"
      className="block transition-transform hover:-translate-y-1"
    >
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-0">
          <img
            src={topic.image || "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b"}
            alt={topic.title}
            className="w-full h-48 object-cover"
          />
        </CardHeader>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold mb-2 line-clamp-2">{topic.title}</h2>
          <p className="text-muted-foreground line-clamp-3">{topic.content}</p>
        </CardContent>
      </Card>
    </a>
  );
};