import { NewsList } from "@/components/NewsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Latest News</h1>
        <NewsList />
      </main>
    </div>
  );
};

export default Index;