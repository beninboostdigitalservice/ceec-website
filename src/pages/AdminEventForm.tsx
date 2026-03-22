import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import MultiFileUpload from "@/components/MultiFileUpload";

const AdminEventForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    titre: "", description: "", type: "", statut: "a_venir",
    date_debut: "", date_fin: "", lieu: "", image_principale: "",
    resultats: "",
    galerie_images: [] as string[],
    videos: [] as string[],
    documents: [] as string[],
  });

  const { data: event } = useQuery({
    queryKey: ["event", id],
    queryFn: async () => { const { data } = await supabase.from("events").select("*").eq("id", id!).single(); return data; },
    enabled: !isNew,
  });

  useEffect(() => {
    if (event) {
      setForm({
        titre: event.titre || "", description: event.description || "", type: event.type || "",
        statut: event.statut || "a_venir", date_debut: event.date_debut?.slice(0, 16) || "",
        date_fin: event.date_fin?.slice(0, 16) || "", lieu: event.lieu || "",
        image_principale: event.image_principale || "", resultats: event.resultats || "",
        galerie_images: event.galerie_images || [],
        videos: event.videos || [],
        documents: event.documents || [],
      });
    }
  }, [event]);

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        ...form,
        date_debut: form.date_debut ? new Date(form.date_debut).toISOString() : null,
        date_fin: form.date_fin ? new Date(form.date_fin).toISOString() : null,
      };
      if (isNew) {
        const { error } = await supabase.from("events").insert([payload]);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("events").update(payload).eq("id", id!);
        if (error) throw error;
      }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-events"] }); toast({ title: isNew ? "Événement créé" : "Événement mis à jour" }); navigate("/admin"); },
    onError: (e: any) => { toast({ title: "Erreur", description: e.message, variant: "destructive" }); },
  });

  const field = (label: string, key: string, type = "text", multiline = false) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      ) : (
        <input type={type} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 flex items-center h-16 gap-4">
          <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></button>
          <h1 className="font-display font-bold text-lg text-foreground">{isNew ? "Nouvel événement" : "Modifier l'événement"}</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-5 bg-card rounded-xl p-6 border border-border shadow-elegant">
          {field("Titre", "titre")}
          {field("Description", "description", "text", true)}
          {field("Type", "type")}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Statut</label>
            <select value={form.statut} onChange={(e) => setForm({ ...form, statut: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="a_venir">À venir</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>
          {field("Date début", "date_debut", "datetime-local")}
          {field("Date fin", "date_fin", "datetime-local")}
          {field("Lieu", "lieu")}
          <ImageUpload
            bucket="events"
            value={form.image_principale}
            onChange={(url) => setForm({ ...form, image_principale: url })}
            label="Image principale"
          />
          {field("Résultats", "resultats", "text", true)}

          <hr className="border-border" />
          <h3 className="font-display font-semibold text-foreground">Médias</h3>

          <MultiFileUpload
            bucket="events"
            values={form.galerie_images}
            onChange={(urls) => setForm({ ...form, galerie_images: urls })}
            label="Galerie d'images"
            accept="image/*"
            type="image"
          />
          <MultiFileUpload
            bucket="events"
            values={form.videos}
            onChange={(urls) => setForm({ ...form, videos: urls })}
            label="Vidéos"
            accept="video/*"
            type="video"
          />
          <MultiFileUpload
            bucket="events"
            values={form.documents}
            onChange={(urls) => setForm({ ...form, documents: urls })}
            label="Documents"
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            type="document"
          />

          <button type="submit" disabled={save.isPending} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={18} /> {save.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminEventForm;
