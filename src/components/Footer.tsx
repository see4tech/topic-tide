import React from "react";

export const Footer = () => {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const copyrightText = import.meta.env.VITE_COPYRIGHT_TEXT;
  const footerBgColor = import.meta.env.VITE_FOOTER_BG_COLOR;
  const footerFontColor = import.meta.env.VITE_FOOTER_FONT_COLOR;

  console.log('Raw environment variables in Footer:', {
    VITE_FOOTER_BG_COLOR: import.meta.env.VITE_FOOTER_BG_COLOR,
    VITE_FOOTER_FONT_COLOR: import.meta.env.VITE_FOOTER_FONT_COLOR
  });

  console.log('Processed footer color variables:', {
    footerBgColor,
    footerFontColor,
    allEnvVars: import.meta.env
  });

  return (
    <footer 
      style={{ 
        backgroundColor: footerBgColor,
        color: footerFontColor
      }}
      className="py-8 mt-12"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-bold mb-4">Contacto</h3>
            <p>
              <a href={`mailto:${contactEmail}`} className="hover:underline">
                {contactEmail}
              </a>
            </p>
          </div>
          <div>
            <p className="text-sm mt-4">{copyrightText}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};