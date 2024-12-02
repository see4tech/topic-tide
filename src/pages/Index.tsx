import { NewsList } from "@/components/NewsList";
import { Footer } from "@/components/Footer";

const Index = () => {
  const logoUrl = import.meta.env.VITE_LOGO_URL;
  const tagline = import.meta.env.VITE_SITE_TAGLINE;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-[#216B67] text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
            <div className="flex items-center gap-8 mb-6 md:mb-0">
              <img 
                src={logoUrl} 
                alt="See4Tech Logo" 
                className="h-32 w-auto" // Increased height from h-24 to h-32
              />
              <div className="text-left">
                <h1 className="text-4xl font-bold mb-2">Punto Digital</h1>
                <p className="text-xl opacity-90">{tagline}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-grow">
        <NewsList />
      </main>

      <Footer />
    </div>
  );
};

export default Index;