import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ExternalLink } from "lucide-react";

const PartnersPage = () => {
  const { data: partners } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data } = await supabase.from("partners").select("*").order("nom");
      return data || [];
    },
  });

  return (
    <Layout>
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Nos Partenaires</h1>
          <p className="text-primary-foreground/70 text-lg">Institutions et organisations qui soutiennent le CEEC.</p>
          <div className="mt-4 h-1 w-16 rounded-full gradient-gold mx-auto" />
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {partners && partners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {partners.map((p) => (
                <div key={p.id} className="bg-card rounded-xl p-6 shadow-elegant border border-border hover:shadow-lg transition-shadow text-center">
                  {p.logo ? (
                    <img src={p.logo} alt={p.nom} className="h-20 object-contain mx-auto mb-4" />
                  ) : (
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full gradient-hero flex items-center justify-center">
                      <span className="text-primary-foreground font-display font-bold text-xl">{p.nom?.[0]}</span>
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-lg text-foreground mb-2">{p.nom}</h3>
                  {p.description && <p className="text-sm text-muted-foreground mb-4">{p.description}</p>}
                  {p.site_web && (
                    <a href={p.site_web} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      Visiter le site <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">Aucun partenaire enregistré pour le moment.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default PartnersPage;
