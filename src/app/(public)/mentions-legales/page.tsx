import Link from "next/link";

function GoldLine() {
  return (
    <div className="flex items-center gap-4 justify-center">
      <div className="h-px flex-1 max-w-16 bg-[#c9a96e]/40" />
      <div className="w-1.5 h-1.5 rotate-45 bg-[#c9a96e]/60" />
      <div className="h-px flex-1 max-w-16 bg-[#c9a96e]/40" />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-10">
      <GoldLine />
      <span className="text-[10px] tracking-[0.5em] uppercase text-[#c9a96e] font-body">
        {children}
      </span>
    </div>
  );
}

export default function MentionsLegalesPage() {
  const sections = [
    {
      id: "editeur",
      title: "Éditeur du site",
      content: "La dénomination sociale, la forme juridique, l'adresse du siège, le SIREN ou SIRET, le capital social le cas échéant et les coordonnées de l'éditeur doivent être confirmés avant publication."
    },
    {
      id: "publication",
      title: "Responsable de publication",
      content: "L'identité et les coordonnées du responsable de publication seront indiquées après validation par le restaurant."
    },
    {
      id: "hebergement",
      title: "Hébergement",
      content: "Le nom, l'adresse et les coordonnées de l'hébergeur seront ajoutés une fois le prestataire technique définitivement retenu."
    },
    {
      id: "propriete",
      title: "Propriété intellectuelle",
      content: "Les règles applicables aux textes, photographies, éléments graphiques et contenus du site seront publiées après confirmation de leurs titulaires et de leurs droits d'utilisation."
    },
    {
      id: "confidentialite",
      title: "Confidentialité",
      content: "La politique de confidentialité précisera les données collectées, leur finalité, leur durée de conservation, les destinataires et les droits des personnes. Elle doit être validée avant l'activation des formulaires de contact ou de réservation."
    },
    {
      id: "cookies",
      title: "Cookies",
      content: "La politique relative aux cookies et, si nécessaire, le mécanisme de consentement seront définis avant l'ajout de services nécessitant un dépôt ou une lecture de cookies non essentiels."
    },
    {
      id: "contact",
      title: "Contact",
      content: "L'adresse e-mail légale et les modalités de contact de l'éditeur doivent être confirmées. Les informations pratiques du restaurant sont présentées sur la page Contact & accès après validation."
    }
  ];

  return (
    <div className="min-h-screen pt-[72px] bg-[#0b0b09] text-[#f0e8d8] font-body">
      {/* Introduction Header */}
      <div className="relative py-20 lg:py-28 px-6 text-center bg-[#0e0e0c]">
        <div className="relative z-10 max-w-2xl mx-auto">
          <SectionLabel>Informations légales</SectionLabel>
          <h1 className="font-body font-light tracking-[-0.04em] text-[clamp(2.5rem,6vw,4rem)] text-[#f0e8d8]">
            Mentions légales
          </h1>
          <p className="mt-4 text-[#f0e8d8]/35 text-xs tracking-wide">
            Dernière mise à jour : juin 2025
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        {/* Breadcrumb */}
        <nav className="mb-10 text-xs text-[#f0e8d8]/40 font-body flex items-center gap-2" aria-label="Fil d’Ariane">
          <Link href="/" className="hover:text-[#c9a96e] transition-colors">Accueil</Link>
          <span aria-hidden="true" className="text-[#c9a96e]/30">/</span>
          <span aria-current="page" className="text-[#f0e8d8]/80">Mentions légales</span>
        </nav>

        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
          {/* Sidebar Navigation */}
          <nav aria-label="Navigation mentions légales" className="hidden lg:block">
            <div className="sticky top-24 space-y-1">
              {sections.map(({ id, title }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="block text-[10px] tracking-[0.3em] uppercase font-body text-[#f0e8d8]/35 hover:text-[#c9a96e] transition-colors py-2 border-l-2 border-transparent hover:border-[#c9a96e]/40 pl-4"
                >
                  {title}
                </a>
              ))}
            </div>
          </nav>

          {/* Legal Content */}
          <div className="space-y-14">
            {sections.map(({ id, title, content }) => (
              <section key={id} id={id} className="scroll-mt-24">
                <div className="mb-5">
                  <div className="w-8 h-px bg-[#c9a96e]/50 mb-4" />
                  <span className="text-[10px] uppercase tracking-widest text-[#c9a96e]/60 font-body block mb-1">
                    À valider
                  </span>
                  <h2 className="font-body font-medium tracking-[-0.02em] text-xl md:text-2xl text-[#f0e8d8]">
                    {title}
                  </h2>
                </div>
                <p className="text-[#f0e8d8]/50 text-sm font-body font-light leading-relaxed">
                  {content}
                </p>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
