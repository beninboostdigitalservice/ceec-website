import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const AdminPartnerForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState({ nom: "", logo: "", description: "", site_web: "" });

  const { data: partner } = useQuery({
    queryKey: ["partner", id],
    queryFn: async () => { const { data } = await supabase.from("partners").select("*").eq("id", id!).single(); return data; },
    enabled: !isNew,
  });

  useEffect(() => {
    if (partner) setForm({ nom: partner.nom, logo: partner.logo || "", description: partner.description || "", site_web: partner.site_web || "" });
  }, [partner]);

  const save = useMutation({
    mutationFn: async () => {
      if (isNew) { const { error } = await supabase.from("partners").insert([form]); if (error) throw error; }
      else { const { error } = await supabase.from("partners").update(form).eq("id", id!); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-partners"] }); toast({ title: isNew ? "Partenaire ajouté" : "Partenaire mis à jour" }); navigate("/admin"); },
    onError: (e: any) => { toast({ title: "Erreur", description: e.message, variant: "destructive" }); },
  });

  const field = (label: string, key: string, multiline = false) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      {multiline ? (
        <textarea value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} rows={4} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none" />
      ) : (
        <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 flex items-center h-16 gap-4">
          <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></button>
          <h1 className="font-display font-bold text-lg text-foreground">{isNew ? "Nouveau partenaire" : "Modifier le partenaire"}</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-5 bg-card rounded-xl p-6 border border-border shadow-elegant">
          {field("Nom", "nom")}
          <ImageUpload
            bucket="partners"
            value={form.logo}
            onChange={(url) => setForm({ ...form, logo: url })}
            label="Logo"
          />
          {field("Description", "description", true)}
          {field("Site web", "site_web")}
          <button type="submit" disabled={save.isPending} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={18} /> {save.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminPartnerForm;
