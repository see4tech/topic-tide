import { NewsList } from "@/components/NewsList";
import { StoryIndex } from "@/components/StoryIndex";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [showIndex, setShowIndex] = useState(false);
  const logoUrl = import.meta.env.VITE_LOGO_URL;
  const tagline = import.meta.env.VITE_SITE_TAGLINE;
  const heroBgColor = import.meta.env.VITE_HERO_BG_COLOR;
  const bodyBgColor = import.meta.env.VITE_BODY_BG_COLOR;
  const heroFontColor = import.meta.env.VITE_HERO_FONT_COLOR;

  return (
    <div 
      style={{ 
        backgroundColor: bodyBgColor
      }} 
      className="min-h-screen flex flex-col"
    >
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

      <div className="container mx-auto px-4 py-4">
        <Button
          onClick={() => setShowIndex(!showIndex)}
          className="mb-4"
          variant="outline"
        >
          {showIndex ? "Ver noticias" : "Ver índice de historias"}
        </Button>
      </div>

      <main className="container mx-auto px-4 py-8 flex-grow text-gray-900">
        {showIndex ? <StoryIndex /> : <NewsList />}
      </main>

      <Footer />
    </div>
  );
};

export default Index;