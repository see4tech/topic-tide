import { NewsList } from "@/components/NewsList";
import { Footer } from "@/components/Footer";

const Index = () => {
  const logoUrl = import.meta.env.VITE_LOGO_URL;
  const tagline = import.meta.env.VITE_SITE_TAGLINE;
  const heroBgColor = import.meta.env.VITE_HERO_BG_COLOR;
  const bodyBgColor = import.meta.env.VITE_BODY_BG_COLOR;

  // Function to determine if a color is light
  const isLightColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  console.log('Raw Environment Variables:', {
    LOGO_URL: logoUrl,
    HERO_BG: heroBgColor,
    BODY_BG: bodyBgColor,
    RAW_ENV: import.meta.env
  });

  // Ensure the color starts with # and handle undefined
  const formattedHeroBgColor = heroBgColor ? (heroBgColor.startsWith('#') ? heroBgColor : `#${heroBgColor}`) : '#2B2B2B';
  const isLightBg = isLightColor(formattedHeroBgColor);

  console.log('Processed Hero Background Color:', {
    original: heroBgColor,
    formatted: formattedHeroBgColor,
    style: { backgroundColor: formattedHeroBgColor }
  });

  return (
    <div style={{ backgroundColor: bodyBgColor }} className="min-h-screen flex flex-col">
      <header 
        className={`py-12 ${isLightBg ? 'text-gray-800' : 'text-white'}`}
        style={{ backgroundColor: formattedHeroBgColor }}
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