import Layout from "@/components/Layout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Erreur de connexion", description: error.message, variant: "destructive" });
    } else {
      navigate("/admin");
    }
  };

  return (
    <Layout>
      <section className="min-h-[80vh] flex items-center justify-center bg-muted">
        <div className="w-full max-w-md mx-4">
          <div className="bg-card rounded-xl p-8 shadow-elegant border border-border">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto rounded-full gradient-hero flex items-center justify-center mb-4">
                <Lock size={28} className="text-primary-foreground" />
              </div>
              <h1 className="font-display text-2xl font-bold text-foreground">Administration</h1>
              <p className="text-sm text-muted-foreground mt-1">Connectez-vous pour accéder au tableau de bord.</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring" required />
              </div>
              <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminLogin;
