import React, { useState } from "react";

export const Footer = () => {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const copyrightText = import.meta.env.VITE_COPYRIGHT_TEXT;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <footer className="bg-[#216B67] text-white py-8 mt-12">
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
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <h3 className="font-bold mb-4">Newsletter</h3>
            {isHovered && (
              <div className="space-x-4 animate-fade-in">
                <a href="#" className="text-white hover:underline">
                  Suscribirse
                </a>
                <a href="#" className="text-white hover:underline">
                  Desuscribirse
                </a>
              </div>
            )}
          </div>
          <div>
            <p className="text-sm mt-4">{copyrightText}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};