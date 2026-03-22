import { MessageCircle } from "lucide-react";

const WhatsAppButton = () => (
  <a
    href="https://wa.me/2290145776256"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-110"
    aria-label="Contacter sur WhatsApp"
  >
    <MessageCircle size={28} />
  </a>
);

export default WhatsAppButton;
