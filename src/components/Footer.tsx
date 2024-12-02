import React from "react";

export const Footer = () => {
  const contactEmail = import.meta.env.VITE_CONTACT_EMAIL;
  const copyrightText = import.meta.env.VITE_COPYRIGHT_TEXT;
  const subscribeUrl = import.meta.env.VITE_SUBSCRIBE_URL;
  const unsubscribeUrl = import.meta.env.VITE_UNSUBSCRIBE_URL;

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
          <div>
            <h3 className="font-bold mb-4">Newsletter</h3>
            <div className="space-x-4">
              <a 
                href={subscribeUrl} 
                className="text-white hover:underline"
              >
                Suscribirse
              </a>
              <a 
                href={unsubscribeUrl} 
                className="text-white hover:underline"
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