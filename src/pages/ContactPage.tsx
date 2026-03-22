import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { z } from "zod";

const contactSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  message: z.string().trim().min(1, "Le message est requis").max(2000),
});

const ContactPage = () => {
  const [form, setForm] = useState({ nom: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      toast({ title: "Erreur", description: result.error.errors[0]?.message, variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("messages").insert([{ nom: result.data.nom, email: result.data.email, message: result.data.message }]);
    setLoading(false);
    if (error) {
      toast({ title: "Erreur", description: "Impossible d'envoyer le message.", variant: "destructive" });
    } else {
      toast({ title: "Message envoyé", description: "Nous vous répondrons bientôt !" });
      setForm({ nom: "", email: "", message: "" });
    }
  };

  return (
    <Layout>
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Contact</h1>
          <p className="text-primary-foreground/70 text-lg">N'hésitez pas à nous écrire.</p>
          <div className="mt-4 h-1 w-16 rounded-full gradient-gold mx-auto" />
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <SectionHeading title="Nos Coordonnées" centered={false} />
              <div className="space-y-6">
                <a href="mailto:ceecfeunstim@gmail.com" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <Mail size={20} className="text-gold-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Email</p>
                    <p className="text-sm">ceecfeunstim@gmail.com</p>
                  </div>
                </a>
                <a href="tel:+2290145776256" className="flex items-center gap-4 text-muted-foreground hover:text-foreground transition-colors">
                  <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <Phone size={20} className="text-gold-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Téléphone</p>
                    <p className="text-sm">+229 01 45 77 62 56</p>
                    <p className="text-sm">+229 68 22 69 24</p>
                  </div>
                </a>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                    <MapPin size={20} className="text-gold-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground text-sm">Adresse</p>
                    <p className="text-sm">UNSTIM, Bénin</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              <SectionHeading title="Envoyez-nous un message" centered={false} />
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={form.nom}
                    onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Votre nom"
                    required
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="votre@email.com"
                    required
                    maxLength={255}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    placeholder="Votre message..."
                    required
                    maxLength={2000}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg gradient-gold text-gold-foreground font-semibold hover:opacity-90 transition-opacity shadow-gold flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={18} /> {loading ? "Envoi en cours..." : "Envoyer"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
