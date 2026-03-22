import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";
import logoCeec from "@/assets/logo-ceec.jpg";
import logoFeunstim from "@/assets/logo-feunstim.jpg";

const Footer = () => (
  <footer className="gradient-hero text-primary-foreground">
    <div className="container mx-auto px-3 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={logoCeec} alt="Logo CEEC" className="w-12 h-12 rounded-full object-cover" />
            <img src={logoFeunstim} alt="Logo FEUNSTIM" className="w-12 h-12 rounded-full object-cover" />
          </div>
          <h3 className="font-display text-xl font-bold mb-2">CEEC</h3>
          <p className="text-primary-foreground/70 text-sm leading-relaxed">
            Club d'Excellence et d'Étudiants Chercheurs — Promouvoir l'excellence, la recherche et l'innovation.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Navigation</h4>
          <div className="flex flex-col gap-1">
            {[
              { href: "/", label: "Accueil" },
              { href: "/a-propos", label: "À propos" },
              { href: "/evenements", label: "Événements" },
              { href: "/membres", label: "Membres" },
              { href: "/partenaires", label: "Partenaires" },
              { href: "/contact", label: "Contact" },
            ].map((link) => (
              <Link key={link.href} to={link.href} className="text-primary-foreground/70 hover:text-primary-foreground text-sm transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm">
            <a href="mailto:ceecfeunstim@gmail.com" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Mail size={16} /> ceecfeunstim@gmail.com
            </a>
            <a href="tel:+2290145776256" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Phone size={16} /> +229 01 45 77 62 56
            </a>
            <a href="tel:+22968226924" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Phone size={16} /> +229 68 22 69 24
            </a>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <MapPin size={16} /> UNSTIM, Bénin
            </div>
          </div>
        </div>

         {/* Don */}
        <div>
          <h4 className="font-display text-lg font-semibold mb-4">Don</h4>
          <div className="flex flex-col gap-3 text-sm">
            <p>Faire par Bénin Boost Digital Servic, IFU : 0202442835502</p>
            <a href="mailto:beninboostdigitalservice@gmail.com" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Mail size={16} /> beninboostdigitalservice@gmail.com
            </a>
            <a href="" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              <Phone size={16} /> +229 01 92 74 33 08, +229 01 45 77 62 56
            </a>
            <a href="https://beninboostdigitalservice.github.io/b-ninboost3/" className="flex items-center gap-2 text-primary-foreground/70 hover:text-primary-foreground transition-colors">
              https://beninboostdigitalservice.github.io/b-ninboost3/
            </a>
            <div className="flex items-center gap-2 text-primary-foreground/70">
              <MapPin size={16} /> Abomey / Zou / Bénin
            </div>
          </div>
        </div>
        
      </div>

      <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm text-primary-foreground/50">
        © {new Date().getFullYear()} CEEC — FEUNSTIM / UNSTIM. Tous droits réservés.
      </div>
    </div>
  </footer>
);

export default Footer;
