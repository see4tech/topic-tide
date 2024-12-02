import React, { useEffect, useState } from "react";

export const Footer = () => {
  const [error, setError] = useState<string | null>(null);
  
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const copyrightText = import.meta.env.VITE_COPYRIGHT_TEXT;
  const subscribeUrl = import.meta.env.VITE_SUBSCRIBE_URL;
  const unsubscribeUrl = import.meta.env.VITE_UNSUBSCRIBE_URL;
  const footerBgColor = import.meta.env.VITE_FOOTER_BG_COLOR;
  const footerFontColor = import.meta.env.VITE_FOOTER_FONT_COLOR;

  console.log('Environment variables in Footer:', {
    FOOTER_BG: footerBgColor,
    FOOTER_FONT: footerFontColor,
    ENV: import.meta.env
  });

  useEffect(() => {
    try {
      if (!footerBgColor) throw new Error('VITE_FOOTER_BG_COLOR must be defined in .env');
      if (!footerFontColor) throw new Error('VITE_FOOTER_FONT_COLOR must be defined in .env');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [footerBgColor, footerFontColor]);

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <footer 
      className="py-8 mt-12"
      style={{ backgroundColor: footerBgColor, color: footerFontColor }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold mb-4">Contacto</h3>
            <p>
              <a href={`mailto:${contactEmail}`} className="hover:underline">
                {contactEmail}
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <div className="space-x-4">
              <a 
                href={subscribeUrl} 
                className="hover:underline"
              >
                Suscribirse
              </a>
              <a 
                href={unsubscribeUrl} 
                className="hover:underline"
              >
                Desuscribirse
              </a>
            </div>
          </div>
          <div>
            <p className="text-sm mt-4">{copyrightText}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};