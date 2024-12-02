import { NewsList } from "@/components/NewsList";
import { Footer } from "@/components/Footer";

const Index = () => {
  const logoUrl = import.meta.env.VITE_LOGO_URL;
  const tagline = import.meta.env.VITE_SITE_TAGLINE;
  const heroBgColor = import.meta.env.VITE_HERO_BG_COLOR || '#216B67';
  const bodyBgColor = import.meta.env.VITE_BODY_BG_COLOR || '#ffffff';

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bodyBgColor }}>
      <header className="text-white py-12" style={{ backgroundColor: heroBgColor.startsWith('#') ? heroBgColor : `#${heroBgColor}` }}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between">
            <div className="flex items-center gap-8 mb-6 md:mb-0">
              <img 
                src={logoUrl} 
                alt="See4Tech Logo" 
                className="h-40 w-auto object-contain" 
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