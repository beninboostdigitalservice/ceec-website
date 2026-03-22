import Layout from "@/components/Layout";
import SectionHeading from "@/components/SectionHeading";
import { BookOpen, Target, Award, Users, Lightbulb, GraduationCap } from "lucide-react";
import logoCeec from "@/assets/logo-ceec.jpg";
import logoFeunstim from "@/assets/logo-feunstim.jpg";

const objectifs = [
  { icon: Award, text: "Stimuler l'excellence intellectuelle" },
  { icon: BookOpen, text: "Renforcer la maîtrise des connaissances fondamentales" },
  { icon: Lightbulb, text: "Développer l'esprit d'analyse" },
  { icon: Target, text: "Encourager la rigueur scientifique" },
];

const disciplines = ["Mathématiques", "Physique", "Informatique", "Mécanique", "Énergie", "Français", "Anglais"];

const AboutPage = () => (
  <Layout>
    {/* Hero */}
    <section className="gradient-hero py-24">
      <div className="container mx-auto px-4 text-center">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">À propos du CEEC</h1>
        <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
          Découvrez notre mission, nos objectifs et nos activités.
        </p>
        <div className="mt-4 h-1 w-16 rounded-full gradient-gold mx-auto" />
      </div>
    </section>

    {/* Présentation */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Présentation" />
        <div className="prose max-w-none text-muted-foreground leading-relaxed space-y-4">
          <p>
            Le <strong className="text-foreground">Club d'Excellence et d'Étudiants Chercheurs (CEEC)</strong> est une institution spécialisée de la Fédération des Étudiants de l'Université Nationale des Sciences, Technologies, Ingénierie et Mathématiques (FEUNSTIM) de l'<strong className="text-foreground">UNSTIM</strong>.
          </p>
          <p>
            Le CEEC est un cadre académique dédié à la promotion de l'excellence, de la recherche et de l'innovation chez les étudiants.
          </p>
        </div>
      </div>
    </section>

    {/* Mission */}
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Notre Mission" />
        <div className="bg-card rounded-xl p-8 shadow-elegant border border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
              <GraduationCap size={24} className="text-gold-foreground" />
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Promouvoir l'excellence académique, la recherche scientifique et l'innovation au sein de la communauté étudiante de l'UNSTIM, en offrant un cadre propice au développement intellectuel et à l'entraide entre étudiants.
            </p>
          </div>
        </div>
      </div>
    </section>

    {/* Objectifs */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Objectifs" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {objectifs.map((obj, i) => (
            <div key={i} className="flex items-start gap-4 bg-card rounded-xl p-6 shadow-elegant border border-border">
              <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shrink-0">
                <obj.icon size={20} className="text-gold-foreground" />
              </div>
              <p className="text-foreground font-medium">{obj.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Activités */}
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Nos Activités" />
        <div className="space-y-8">
          {/* Concours */}
          <div className="bg-card rounded-xl p-8 shadow-elegant border border-border">
            <h3 className="font-display text-xl font-semibold text-foreground mb-4">Concours Académiques Pluridisciplinaires</h3>
            <p className="text-muted-foreground mb-4">Des compétitions stimulantes dans plusieurs domaines :</p>
            <div className="flex flex-wrap gap-2">
              {disciplines.map((d) => (
                <span key={d} className="px-3 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium">{d}</span>
              ))}
            </div>
          </div>

          {/* Autres */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Webinaires Académiques", desc: "Sessions en ligne avec des experts et des chercheurs." },
              { title: "Formations", desc: "Ateliers pratiques pour développer de nouvelles compétences." },
              { title: "Activités Scientifiques", desc: "Projets de recherche et expérimentations collaboratives." },
            ].map((a, i) => (
              <div key={i} className="bg-card rounded-xl p-6 shadow-elegant border border-border">
                <h4 className="font-display font-semibold text-foreground mb-2">{a.title}</h4>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Programme d'accompagnement */}
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Programme d'Accompagnement Académique" />
        <div className="bg-card rounded-xl p-8 shadow-elegant border border-border">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-lg gradient-gold flex items-center justify-center shrink-0">
              <Users size={24} className="text-gold-foreground" />
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Ce programme permet aux étudiants de bénéficier d'un encadrement collaboratif où les étudiants plus avancés aident leurs camarades à comprendre les cours, résoudre des exercices et réaliser des projets académiques.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Entraide", desc: "Solidarité entre étudiants de tous niveaux." },
              { title: "Cohésion", desc: "Renforcement des liens au sein de la communauté." },
              { title: "Performance", desc: "Amélioration des résultats académiques." },
            ].map((item, i) => (
              <div key={i} className="bg-muted rounded-lg p-4 text-center">
                <h4 className="font-display font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>

    {/* Logos */}
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-4 max-w-4xl">
        <SectionHeading title="Nos Institutions" />
        <div className="flex flex-wrap justify-center items-center gap-12">
          <div className="text-center">
            <img src={logoCeec} alt="Logo CEEC" className="w-28 h-28 rounded-full object-cover mx-auto mb-3 shadow-elegant border-2 border-accent" />
            <p className="font-display font-semibold text-foreground">CEEC</p>
          </div>
          <div className="text-center">
            <img src={logoFeunstim} alt="Logo FEUNSTIM" className="w-28 h-28 rounded-full object-cover mx-auto mb-3 shadow-elegant border-2 border-accent" />
            <p className="font-display font-semibold text-foreground">FEUNSTIM</p>
          </div>
        </div>
      </div>
    </section>
  </Layout>
);

export default AboutPage;
