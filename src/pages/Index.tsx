import { NewsList } from "@/components/NewsList";
import { Footer } from "@/components/Footer";

const Index = () => {
  const logoUrl = import.meta.env.VITE_LOGO_URL;
  const tagline = import.meta.env.VITE_SITE_TAGLINE;
  const heroBgColor = import.meta.env.VITE_HERO_BG_COLOR;
  const bodyBgColor = import.meta.env.VITE_BODY_BG_COLOR;
  const heroFontColor = import.meta.env.VITE_HERO_FONT_COLOR;

  console.log('Raw Environment Variables in Index:', {
    LOGO_URL: logoUrl,
    HERO_BG: heroBgColor,
    BODY_BG: bodyBgColor,
    HERO_FONT: heroFontColor,
    RAW_ENV: import.meta.env
  });

  if (!heroBgColor) throw new Error('VITE_HERO_BG_COLOR must be defined in .env');
  if (!heroFontColor) throw new Error('VITE_HERO_FONT_COLOR must be defined in .env');
  if (!bodyBgColor) throw new Error('VITE_BODY_BG_COLOR must be defined in .env');

  return (
    <div style={{ backgroundColor: bodyBgColor }} className="min-h-screen flex flex-col">
      <header 
        style={{ 
          backgroundColor: heroBgColor,
          color: heroFontColor
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