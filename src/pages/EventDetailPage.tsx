import Layout from "@/components/Layout";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, MapPin, ArrowLeft, FileText, Trophy } from "lucide-react";

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => {
      const { data } = await supabase.from("events").select("*").eq("id", id!).single();
      return data;
    },
    enabled: !!id,
  });

  const statutLabel = (s: string) => {
    if (s === "a_venir") return "À venir";
    if (s === "en_cours") return "En cours";
    return "Terminé";
  };

  if (isLoading) return <Layout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Chargement...</p></div></Layout>;
  if (!event) return <Layout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Événement introuvable.</p></div></Layout>;

  const laureats = Array.isArray(event.laureats) ? event.laureats as Array<Record<string, string>> : [];
  const classement = Array.isArray(event.classement) ? event.classement as Array<Record<string, string>> : [];
  const galerie = event.galerie_images || [];
  const videos = event.videos || [];
  const documents = event.documents || [];

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-hero py-16">
        <div className="container mx-auto px-4">
          <Link to="/evenements" className="inline-flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground mb-6 transition-colors">
            <ArrowLeft size={16} /> Retour aux événements
          </Link>
          <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4">{event.titre}</h1>
          <div className="flex flex-wrap gap-4 text-primary-foreground/80 text-sm">
            <span className="px-3 py-1 rounded-full bg-primary-foreground/10 backdrop-blur-sm">{statutLabel(event.statut)}</span>
            {event.type && <span className="px-3 py-1 rounded-full bg-primary-foreground/10 backdrop-blur-sm">{event.type}</span>}
            {event.date_debut && (
              <span className="flex items-center gap-1.5">
                <Calendar size={14} />
                {new Date(event.date_debut).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                {event.date_fin && ` — ${new Date(event.date_fin).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}`}
              </span>
            )}
            {event.lieu && <span className="flex items-center gap-1.5"><MapPin size={14} /> {event.lieu}</span>}
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-4xl space-y-12">
          {/* Image */}
          {event.image_principale && (
            <img src={event.image_principale} alt={event.titre} className="w-full rounded-xl shadow-elegant" />
          )}

          {/* Description */}
          {event.description && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Description</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{event.description}</p>
            </div>
          )}

          {/* Gallery */}
          {galerie.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Galerie</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {galerie.map((img, i) => (
                  <img key={i} src={img} alt={`Galerie ${i + 1}`} className="w-full h-48 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {/* Videos */}
          {videos.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Vidéos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {videos.map((v, i) => (
                  <video key={i} src={v} controls className="w-full rounded-lg" />
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {documents.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-4">Documents</h2>
              <div className="space-y-2">
                {documents.map((d, i) => {
                  const fileName = d.split("/").pop()?.replace(/^\d+-/, "") || `Document ${i + 1}`;
                  return (
                    <a key={i} href={d} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                      <FileText size={16} /> {fileName}
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Results (for finished events) */}
          {event.statut === "termine" && (
            <>
              {event.resultats && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2"><Trophy size={24} className="text-accent" /> Résultats</h2>
                  <p className="text-muted-foreground whitespace-pre-line">{event.resultats}</p>
                </div>
              )}

              {laureats.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Lauréats</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {laureats.map((l, i) => (
                      <div key={i} className="bg-card rounded-lg p-4 border border-border shadow-elegant">
                        <p className="font-semibold text-foreground">{l.nom || `Lauréat ${i + 1}`}</p>
                        {l.prix && <p className="text-sm text-accent font-medium">{l.prix}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {classement.length > 0 && (
                <div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-4">Classement</h2>
                  <div className="bg-card rounded-xl border border-border overflow-hidden">
                    {classement.map((c, i) => (
                      <div key={i} className={`flex items-center gap-4 px-6 py-3 ${i > 0 ? "border-t border-border" : ""}`}>
                        <span className="w-8 h-8 rounded-full gradient-gold flex items-center justify-center text-gold-foreground font-bold text-sm">{i + 1}</span>
                        <span className="text-foreground font-medium">{c.nom || `Position ${i + 1}`}</span>
                        {c.score && <span className="ml-auto text-sm text-muted-foreground">{c.score}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default EventDetailPage;
