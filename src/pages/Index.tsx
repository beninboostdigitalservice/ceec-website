import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Award, Lightbulb, GraduationCap, FlaskConical } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-bg.jpg";
import logoCeec from "@/assets/logo-ceec.jpg";

const features = [
  { icon: Award, title: "Concours Académiques", desc: "Compétitions pluridisciplinaires : mathématiques, physique, informatique, mécanique, énergie, français, anglais." },
  { icon: BookOpen, title: "Webinaires & Formations", desc: "Sessions de formation et webinaires académiques pour approfondir les connaissances." },
  { icon: Users, title: "Accompagnement", desc: "Programme d'encadrement collaboratif entre étudiants pour améliorer les performances." },
  { icon: Lightbulb, title: "Innovation", desc: "Encourager la créativité et l'esprit d'innovation chez les étudiants chercheurs." },
];

const Index = () => {
  const { data: events } = useQuery({
    queryKey: ["events-recent"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("date_debut", { ascending: false }).limit(3);
      return data || [];
    },
  });

  const { data: members } = useQuery({
    queryKey: ["members-bureau"],
    queryFn: async () => {
      const { data } = await supabase.from("members").select("*").order("created_at", { ascending: false }).limit(6);
      return data || [];
    },
  });

  const { data: partners } = useQuery({
    queryKey: ["partners"],
    queryFn: async () => {
      const { data } = await supabase.from("partners").select("*");
      return data || [];
    },
  });

  const statutLabel = (s: string) => {
    if (s === "a_venir") return "À venir";
    if (s === "en_cours") return "En cours";
    return "Terminé";
  };

  const statutColor = (s: string) => {
    if (s === "a_venir") return "bg-accent text-accent-foreground";
    if (s === "en_cours") return "bg-primary text-primary-foreground";
    return "bg-muted text-muted-foreground";
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroBg} alt="Campus universitaire" className="w-full h-full object-cover" />
          <div className="absolute inset-0 gradient-hero opacity-80" />
        </div>
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="inline-block mb-6">
            <img src={logoCeec} alt="Logo CEEC" className="w-24 h-24 mx-auto rounded-full object-cover border-2 border-accent shadow-gold" />
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground mb-6 leading-tight">
            Club d'Excellence et<br />d'Étudiants Chercheurs
          </h1>
          <p className="text-xl md:text-2xl text-accent font-display font-semibold tracking-wider mb-8">
            Excellence — Recherche — Innovation
          </p>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Un cadre académique dédié à la promotion de l'excellence, de la recherche et de l'innovation au sein de la FEUNSTIM / UNSTIM.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/a-propos" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg gradient-gold text-gold-foreground font-semibold hover:opacity-90 transition-opacity shadow-gold">
              Découvrir le CEEC <ArrowRight size={18} />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg border border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <SectionHeading title="Nos Activités" subtitle="Le CEEC propose un éventail d'activités académiques pour stimuler l'excellence." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-elegant hover:shadow-lg transition-shadow border border-border group" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <f.icon size={24} className="text-gold-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <SectionHeading title="Événements Récents" subtitle="Restez informés des dernières activités du CEEC." />
          {events && events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((event) => (
                <Link to={`/evenements/${event.id}`} key={event.id} className="bg-card rounded-xl overflow-hidden shadow-elegant hover:shadow-lg transition-all hover:-translate-y-1 border border-border">
                  {event.image_principale && (
                    <img src={event.image_principale} alt={event.titre} className="w-full h-48 object-cover" />
                  )}
                  {!event.image_principale && (
                    <div className="w-full h-48 gradient-hero flex items-center justify-center">
                      <FlaskConical size={48} className="text-primary-foreground/30" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statutColor(event.statut)}`}>{statutLabel(event.statut)}</span>
                      {event.type && <span className="text-xs text-muted-foreground">{event.type}</span>}
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-2">{event.titre}</h3>
                    {event.date_debut && <p className="text-sm text-muted-foreground">{new Date(event.date_debut).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">Aucun événement pour le moment.</p>
          )}
          <div className="text-center mt-8">
            <Link to="/evenements" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
              Voir tous les événements <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Bureau Members */}
      {members && members.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <SectionHeading title="Bureau Actuel" subtitle="Les membres qui dirigent le CEEC." />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {members.map((m) => (
                <div key={m.id} className="text-center group">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden mb-3 border-2 border-accent shadow-gold">
                    {m.photo ? (
                      <img src={m.photo} alt={`${m.prenom} ${m.nom}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full gradient-hero flex items-center justify-center text-primary-foreground font-display font-bold text-lg">
                        {m.prenom?.[0]}{m.nom?.[0]}
                      </div>
                    )}
                  </div>
                  <h4 className="font-display font-semibold text-sm text-foreground">{m.prenom} {m.nom}</h4>
                  {m.poste && <p className="text-xs text-accent font-semibold">{m.poste}</p>}
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/membres" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
                Voir tous les membres <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Partners */}
      {partners && partners.length > 0 && (
        <section className="py-20 bg-muted">
          <div className="container mx-auto px-4">
            <SectionHeading title="Nos Partenaires" />
            <div className="flex flex-wrap justify-center gap-12 items-center">
              {partners.map((p) => (
                <div key={p.id} className="text-center">
                  {p.logo ? (
                    <img src={p.logo} alt={p.nom} className="h-16 object-contain mx-auto" />
                  ) : (
                    <span className="font-display font-bold text-lg text-muted-foreground">{p.nom}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">Rejoignez l'excellence</h2>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
            Faites partie d'une communauté d'étudiants passionnés par la recherche et l'innovation.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-3 rounded-lg gradient-gold text-gold-foreground font-semibold hover:opacity-90 transition-opacity shadow-gold">
            Contactez-nous <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
