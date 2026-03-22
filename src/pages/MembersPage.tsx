import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const MembersPage = () => {
  const { data: members } = useQuery({
    queryKey: ["members"],
    queryFn: async () => {
      const { data } = await supabase.from("members").select("*").order("annee_academique", { ascending: false });
      return data || [];
    },
  });

  // Group by année académique
  const grouped = (members || []).reduce<Record<string, typeof members>>((acc, m) => {
    const key = m.annee_academique;
    if (!acc[key]) acc[key] = [];
    acc[key]!.push(m);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort().reverse();

  return (
    <Layout>
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Membres du Bureau</h1>
          <p className="text-primary-foreground/70 text-lg">Les membres qui font vivre le CEEC.</p>
          <div className="mt-4 h-1 w-16 rounded-full gradient-gold mx-auto" />
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {years.length > 0 ? (
            years.map((year) => (
              <div key={year} className="mb-16 last:mb-0">
                <SectionHeading title={`Année ${year}`} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {grouped[year]?.map((m) => (
                    <div key={m.id} className="bg-card rounded-xl overflow-hidden shadow-elegant border border-border hover:shadow-lg transition-shadow group">
                      <div className="aspect-square overflow-hidden">
                        {m.photo ? (
                          <img src={m.photo} alt={`${m.prenom} ${m.nom}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <div className="w-full h-full gradient-hero flex items-center justify-center">
                            <span className="text-primary-foreground font-display font-bold text-4xl">{m.prenom?.[0]}{m.nom?.[0]}</span>
                          </div>
                        )}
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="font-display font-semibold text-foreground">{m.prenom} {m.nom}</h3>
                        {m.poste && <p className="text-sm text-accent font-semibold mt-1">{m.poste}</p>}
                        {m.profession && <p className="text-xs text-muted-foreground mt-1">{m.profession}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-12">Aucun membre enregistré pour le moment.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MembersPage;
