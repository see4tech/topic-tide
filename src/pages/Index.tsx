import { NewsList } from "@/components/NewsList";
import { Footer } from "@/components/Footer";

const Index = () => {
  const logoUrl = import.meta.env.VITE_LOGO_URL;
  const tagline = import.meta.env.VITE_SITE_TAGLINE;
  const heroBgColor = import.meta.env.VITE_HERO_BG_COLOR;
  const bodyBgColor = import.meta.env.VITE_BODY_BG_COLOR;
  const heroFontColor = import.meta.env.VITE_HERO_FONT_COLOR;

  console.log('Raw environment variables in Index:', {
    VITE_HERO_BG_COLOR: import.meta.env.VITE_HERO_BG_COLOR,
    VITE_BODY_BG_COLOR: import.meta.env.VITE_BODY_BG_COLOR,
    VITE_HERO_FONT_COLOR: import.meta.env.VITE_HERO_FONT_COLOR
  });

  console.log('Processed color variables in Index:', {
    heroBgColor,
    bodyBgColor,
    heroFontColor,
    allEnvVars: import.meta.env
  });

  return (
    <div 
      style={{ 
        backgroundColor: bodyBgColor || '#ffffff',
        color: heroFontColor || '#000000'
      }} 
      className="min-h-screen flex flex-col"
    >
      <header 
        style={{ 
          backgroundColor: heroBgColor || '#2B2B2B',
          color: heroFontColor || '#ffffff'
        }}
        className="py-12"
      >
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