import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { checkEmailExists, createSubscriber } from "@/lib/airtable";

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsletterModal({ open, onOpenChange }: NewsletterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Starting subscription process...', { name, email });
      
      if (!email) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Por favor ingresa un correo electrónico válido.",
        });
        return;
      }

      // Check if email already exists
      console.log('Checking if email exists...');
      const emailExists = await checkEmailExists(email);
      console.log('Email exists check result:', emailExists);
      
      if (emailExists) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Este correo electrónico ya está suscrito.",
        });
        return;
      }

      // Create subscriber in Airtable
      console.log('Creating subscriber...');
      await createSubscriber(name, email);
      console.log('Subscriber created in Airtable successfully');

      // Commented out n8n webhook call
      /*
      const listid = 2;
      const sender = "noticias@see4.tech";

      console.log('Making webhook call to n8n...');
      const response = await fetch("https://n8n.see4.tech/webhook/1b2667ae-be75-4e1a-999b-d384001d0ab3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, listid, sender }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Webhook response:', responseData);
      */

      toast({
        variant: "success",
        title: "¡Gracias por suscribirte!",
        description: "Recibirás nuestras actualizaciones pronto.",
        className: "bg-[#216A67] text-white border-[#E7EF62]",
      });
      
      // Reset form
      setName("");
      setEmail("");
      onOpenChange(false);
      
    } catch (error) {
      console.error("Error details:", error);
      
      let errorMessage = "Ocurrió un error inesperado. Por favor, inténtalo más tarde.";
      
      if (error instanceof Error) {
        console.error("Error type:", error.name);
        console.error("Error message:", error.message);
        
        if (error.message.includes('Network') || error.message.includes('CORS')) {
          errorMessage = "Error de conexión. Por favor, verifica tu conexión a internet.";
        } else if (error.message.includes('Invalid API key')) {
          errorMessage = "Error de autenticación con Airtable. Por favor, contacta al administrador.";
        } else if (error.message.includes('Table not found')) {
          errorMessage = "Error de configuración. Por favor, contacta al administrador.";
        }
      }
      
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-b from-[#0e0e0e] to-[#1a1a1a] text-white border-none">
        <div className="container text-center p-6">
          <div className="logo mb-6">
            <img 
              src="https://i.ibb.co/CvDD4tT/Transparent-Logo.png" 
              alt="See4Tech Logo"
              className="max-w-[150px] mx-auto"
            />
          </div>

          <h1 className="text-2xl font-bold mb-2">Suscríbete a nuestro Newsletter</h1>
          <p className="text-sm text-[#cccccc] mb-6">
            Recibe actualizaciones futuristas directamente en tu bandeja de entrada.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              placeholder="Ingresa tu nombre (opcional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#1a1a1a] border-[#444] text-white placeholder:text-[#777] focus:border-[#E7EF62] focus:ring-[#E7EF62]"
              disabled={isSubmitting}
            />
            <Input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1a1a1a] border-[#444] text-white placeholder:text-[#777] focus:border-[#E7EF62] focus:ring-[#E7EF62]"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              className="bg-[#E7EF62] text-[#216A67] border-2 border-[#E7EF62] rounded-full font-bold uppercase px-6 py-3 text-base hover:bg-[#216A67] hover:text-[#333] hover:border-[#216A67] transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Procesando..." : "Suscribirme"}
            </Button>
          </form>

          <div className="mt-6 text-xs text-[#cccccc]">
            <p>
              Visita{" "}
              <a 
                href="https://www.see4.tech/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#E7EF62] hover:underline"
              >
                See4Tech
              </a>{" "}
              para más información.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}