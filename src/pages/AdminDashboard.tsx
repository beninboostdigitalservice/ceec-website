import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Plus, Trash2, Eye, Users, Calendar, Handshake, Mail } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;
type Member = Tables<"members">;
type Partner = Tables<"partners">;
type Message = Tables<"messages">;

type Tab = "events" | "members" | "partners" | "messages";

const AdminDashboard = () => {
  const [tab, setTab] = useState<Tab>("events");
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const qc = useQueryClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/admin/login");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session?.user) navigate("/admin/login");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

  const { data: events } = useQuery({ queryKey: ["admin-events"], queryFn: async () => { const { data } = await supabase.from("events").select("*").order("created_at", { ascending: false }); return data || []; }, enabled: !!user });
  const { data: members } = useQuery({ queryKey: ["admin-members"], queryFn: async () => { const { data } = await supabase.from("members").select("*").order("annee_academique", { ascending: false }); return data || []; }, enabled: !!user });
  const { data: partners } = useQuery({ queryKey: ["admin-partners"], queryFn: async () => { const { data } = await supabase.from("partners").select("*").order("nom"); return data || []; }, enabled: !!user });
  const { data: messages } = useQuery({ queryKey: ["admin-messages"], queryFn: async () => { const { data } = await supabase.from("messages").select("*").order("created_at", { ascending: false }); return data || []; }, enabled: !!user });

  const deleteEvent = useMutation({ mutationFn: async (id: string) => { await supabase.from("events").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-events"] }); toast({ title: "Événement supprimé" }); } });
  const deleteMember = useMutation({ mutationFn: async (id: string) => { await supabase.from("members").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-members"] }); toast({ title: "Membre supprimé" }); } });
  const deletePartner = useMutation({ mutationFn: async (id: string) => { await supabase.from("partners").delete().eq("id", id); }, onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-partners"] }); toast({ title: "Partenaire supprimé" }); } });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: "events", label: "Événements", icon: Calendar },
    { key: "members", label: "Membres", icon: Users },
    { key: "partners", label: "Partenaires", icon: Handshake },
    { key: "messages", label: "Messages", icon: Mail },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <h1 className="font-display font-bold text-lg text-foreground">CEEC — Administration</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={16} /> Déconnexion
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${tab === t.key ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground border border-border"}`}>
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        {/* Events */}
        {tab === "events" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Événements ({events?.length || 0})</h2>
              <button onClick={() => navigate("/admin/events/new")} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-gold-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {events?.map((e) => (
                <div key={e.id} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{e.titre}</h3>
                    <p className="text-sm text-muted-foreground">{e.type} • {e.statut === "a_venir" ? "À venir" : e.statut === "en_cours" ? "En cours" : "Terminé"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/admin/events/${e.id}`)} className="p-2 text-muted-foreground hover:text-foreground"><Eye size={16} /></button>
                    <button onClick={() => deleteEvent.mutate(e.id)} className="p-2 text-destructive hover:text-destructive/80"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {(!events || events.length === 0) && <p className="text-muted-foreground text-center py-8">Aucun événement.</p>}
            </div>
          </div>
        )}

        {/* Members */}
        {tab === "members" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Membres ({members?.length || 0})</h2>
              <button onClick={() => navigate("/admin/members/new")} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-gold-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {members?.map((m) => (
                <div key={m.id} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{m.prenom} {m.nom}</h3>
                    <p className="text-sm text-muted-foreground">{m.poste} • {m.annee_academique}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/admin/members/${m.id}`)} className="p-2 text-muted-foreground hover:text-foreground"><Eye size={16} /></button>
                    <button onClick={() => deleteMember.mutate(m.id)} className="p-2 text-destructive hover:text-destructive/80"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {(!members || members.length === 0) && <p className="text-muted-foreground text-center py-8">Aucun membre.</p>}
            </div>
          </div>
        )}

        {/* Partners */}
        {tab === "partners" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold text-foreground">Partenaires ({partners?.length || 0})</h2>
              <button onClick={() => navigate("/admin/partners/new")} className="flex items-center gap-2 px-4 py-2 rounded-lg gradient-gold text-gold-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                <Plus size={16} /> Ajouter
              </button>
            </div>
            <div className="space-y-3">
              {partners?.map((p) => (
                <div key={p.id} className="bg-card rounded-lg p-4 border border-border flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-foreground">{p.nom}</h3>
                    {p.site_web && <p className="text-sm text-muted-foreground">{p.site_web}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => navigate(`/admin/partners/${p.id}`)} className="p-2 text-muted-foreground hover:text-foreground"><Eye size={16} /></button>
                    <button onClick={() => deletePartner.mutate(p.id)} className="p-2 text-destructive hover:text-destructive/80"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
              {(!partners || partners.length === 0) && <p className="text-muted-foreground text-center py-8">Aucun partenaire.</p>}
            </div>
          </div>
        )}

        {/* Messages */}
        {tab === "messages" && (
          <div>
            <h2 className="font-display text-xl font-bold text-foreground mb-6">Messages ({messages?.length || 0})</h2>
            <div className="space-y-3">
              {messages?.map((m) => (
                <div key={m.id} className={`bg-card rounded-lg p-4 border ${m.lu ? "border-border" : "border-accent"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-semibold text-foreground">{m.nom}</span>
                      <span className="text-sm text-muted-foreground ml-2">{m.email}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{m.message}</p>
                </div>
              ))}
              {(!messages || messages.length === 0) && <p className="text-muted-foreground text-center py-8">Aucun message.</p>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
