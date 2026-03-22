import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Calendar, MapPin, FlaskConical } from "lucide-react";

const filters = [
  { value: "tous", label: "Tous" },
  { value: "a_venir", label: "À venir" },
  { value: "en_cours", label: "En cours" },
  { value: "termine", label: "Terminés" },
];

const EventsPage = () => {
  const [filter, setFilter] = useState("tous");

  const { data: events } = useQuery({
    queryKey: ["events"],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").order("date_debut", { ascending: false });
      return data || [];
    },
  });

  const filtered = events?.filter((e) => filter === "tous" || e.statut === filter) || [];

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
      <section className="gradient-hero py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">Événements</h1>
          <p className="text-primary-foreground/70 text-lg">Concours, webinaires, formations et activités du CEEC.</p>
          <div className="mt-4 h-1 w-16 rounded-full gradient-gold mx-auto" />
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-12">
            {filters.map((f) => (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === f.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((event) => (
                <Link to={`/evenements/${event.id}`} key={event.id} className="bg-card rounded-xl overflow-hidden shadow-elegant hover:shadow-lg transition-all hover:-translate-y-1 border border-border">
                  {event.image_principale ? (
                    <img src={event.image_principale} alt={event.titre} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 gradient-hero flex items-center justify-center">
                      <FlaskConical size={48} className="text-primary-foreground/30" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statutColor(event.statut)}`}>{statutLabel(event.statut)}</span>
                      {event.type && <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">{event.type}</span>}
                    </div>
                    <h3 className="font-display font-semibold text-foreground mb-3">{event.titre}</h3>
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                      {event.date_debut && (
                        <span className="flex items-center gap-1.5">
                          <Calendar size={14} />
                          {new Date(event.date_debut).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          {event.date_fin && ` — ${new Date(event.date_fin).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`}
                        </span>
                      )}
                      {event.lieu && (
                        <span className="flex items-center gap-1.5">
                          <MapPin size={14} /> {event.lieu}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-12">Aucun événement trouvé.</p>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventsPage;
