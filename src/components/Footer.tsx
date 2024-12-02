import React from "react";

export const Footer = () => {
  // Log raw env values first
  console.log('Raw Footer env values:', {
    FOOTER_BG: import.meta.env.VITE_FOOTER_BG_COLOR
  });

  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const copyrightText = import.meta.env.VITE_COPYRIGHT_TEXT;
  const subscribeUrl = import.meta.env.VITE_SUBSCRIBE_URL;
  const unsubscribeUrl = import.meta.env.VITE_UNSUBSCRIBE_URL;
  const footerBgColor = import.meta.env.VITE_FOOTER_BG_COLOR;

  // Function to determine if a color is light
  const isLightColor = (color: string) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 155;
  };

  // Ensure the color starts with #
  const formattedFooterBgColor = footerBgColor?.startsWith('#') ? footerBgColor : `#${footerBgColor}`;
  const isLightBg = isLightColor(formattedFooterBgColor);

  console.log('Footer Background Color:', {
    original: footerBgColor,
    formatted: formattedFooterBgColor,
    style: { backgroundColor: formattedFooterBgColor }
  });

  return (
    <footer 
      className={`py-8 mt-12 ${isLightBg ? 'text-gray-800' : 'text-white'}`}
      style={{ backgroundColor: formattedFooterBgColor }}
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