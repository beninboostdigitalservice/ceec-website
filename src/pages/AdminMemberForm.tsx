import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";

const AdminMemberForm = () => {
  const { id } = useParams();
  const isNew = !id || id === "new";
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  const [form, setForm] = useState({
    annee_academique: "2024-2025", nom: "", prenom: "", photo: "", poste: "", profession: "",
  });

  const { data: member } = useQuery({
    queryKey: ["member", id],
    queryFn: async () => { const { data } = await supabase.from("members").select("*").eq("id", id!).single(); return data; },
    enabled: !isNew,
  });

  useEffect(() => {
    if (member) setForm({ annee_academique: member.annee_academique, nom: member.nom, prenom: member.prenom, photo: member.photo || "", poste: member.poste || "", profession: member.profession || "" });
  }, [member]);

  const save = useMutation({
    mutationFn: async () => {
      if (isNew) { const { error } = await supabase.from("members").insert([form]); if (error) throw error; }
      else { const { error } = await supabase.from("members").update(form).eq("id", id!); if (error) throw error; }
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-members"] }); toast({ title: isNew ? "Membre ajouté" : "Membre mis à jour" }); navigate("/admin"); },
    onError: (e: any) => { toast({ title: "Erreur", description: e.message, variant: "destructive" }); },
  });

  const field = (label: string, key: string) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <input type="text" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
    </div>
  );

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 flex items-center h-16 gap-4">
          <button onClick={() => navigate("/admin")} className="text-muted-foreground hover:text-foreground"><ArrowLeft size={20} /></button>
          <h1 className="font-display font-bold text-lg text-foreground">{isNew ? "Nouveau membre" : "Modifier le membre"}</h1>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="space-y-5 bg-card rounded-xl p-6 border border-border shadow-elegant">
          {field("Année académique", "annee_academique")}
          {field("Nom", "nom")}
          {field("Prénom", "prenom")}
          <ImageUpload
            bucket="members"
            value={form.photo}
            onChange={(url) => setForm({ ...form, photo: url })}
            label="Photo"
          />
          {field("Poste", "poste")}
          {field("Profession", "profession")}
          <button type="submit" disabled={save.isPending} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
            <Save size={18} /> {save.isPending ? "Enregistrement..." : "Enregistrer"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMemberForm;
