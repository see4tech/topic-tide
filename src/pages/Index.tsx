import { NewsList } from "@/components/NewsList";

const Index = () => {
  const logoUrl = import.meta.env.VITE_LOGO_URL;

  return (
    <div className="min-h-screen bg-background">
      <main className="container py-8">
        <div className="flex flex-col items-center mb-8">
          <img 
            src={logoUrl} 
            alt="Punto Digital Logo" 
            className="h-20 mb-4"
          />
          <h1 className="text-4xl font-bold">Punto Digital</h1>
        </div>
        <NewsList />
      </main>
    </div>
  );
};

export default Index;