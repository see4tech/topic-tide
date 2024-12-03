import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface NewsletterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewsletterModal({ open, onOpenChange }: NewsletterModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    const listid = 2;
    const sender = "noticias@see4.tech";

    try {
      const response = await fetch("https://n8n.see4.tech/webhook/1b2667ae-be75-4e1a-999b-d384001d0ab3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, listid, sender }),
      });

      if (response.ok) {
        window.location.href = "https://n8n.see4.tech/webhook/2235c3f1-5b0a-489e-a284-c8c962d8c555?subscribir=false";
        toast({
          title: "¡Gracias por suscribirte!",
          description: "Recibirás nuestras actualizaciones pronto.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "No se pudo completar la suscripción. Inténtalo más tarde.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error inesperado. Por favor, inténtalo más tarde.",
      });
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
            />
            <Input
              type="email"
              placeholder="Ingresa tu correo electrónico"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#1a1a1a] border-[#444] text-white placeholder:text-[#777] focus:border-[#E7EF62] focus:ring-[#E7EF62]"
            />
            <Button
              type="submit"
              className="bg-[#E7EF62] text-[#216A67] border-2 border-[#E7EF62] rounded-full font-bold uppercase px-6 py-3 text-base hover:bg-[#216A67] hover:text-[#333] hover:border-[#216A67] transition-colors"
            >
              Suscribirme
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