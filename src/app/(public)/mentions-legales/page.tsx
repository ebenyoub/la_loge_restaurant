"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

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

interface LegalDocument {
  id: string;
  documentKey: string;
  title: string;
  body: string;
  version: string;
  updatedAt: string;
}

export default function MentionsLegalesPage() {
  const [documents, setDocuments] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDocs() {
      try {
        const res = await fetch(`${API_BASE_URL}/public/legal-documents`);
        const json = await res.json();
        if (res.ok && json.data) {
          setDocuments(json.data);
        }
      } catch (err) {
        console.error("Failed to load legal documents", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDocs();
  }, []);

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
            Dernière mise à jour : juin 2026
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

        {isLoading ? (
          <div className="text-center py-12 text-[#f0e8d8]/45">Chargement...</div>
        ) : (
          <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-16">
            {/* Sidebar Navigation */}
            <nav aria-label="Navigation mentions légales" className="hidden lg:block">
              <div className="sticky top-24 space-y-1">
                {documents.map((doc) => (
                  <a
                    key={doc.documentKey}
                    href={`#${doc.documentKey}`}
                    className="block text-[10px] tracking-[0.3em] uppercase font-body text-[#f0e8d8]/35 hover:text-[#c9a96e] transition-colors py-2 border-l-2 border-transparent hover:border-[#c9a96e]/40 pl-4"
                  >
                    {doc.title}
                  </a>
                ))}
              </div>
            </nav>

            {/* Legal Content */}
            <div className="space-y-14">
              {documents.map((doc) => (
                <section key={doc.documentKey} id={doc.documentKey} className="scroll-mt-24">
                  <div className="mb-5">
                    <div className="w-8 h-px bg-[#c9a96e]/50 mb-4" />
                    <span className="text-[10px] uppercase tracking-widest text-[#c9a96e]/60 font-body block mb-1">
                      Version {doc.version}
                    </span>
                    <h2 className="font-body font-medium tracking-[-0.02em] text-xl md:text-2xl text-[#f0e8d8]">
                      {doc.title}
                    </h2>
                  </div>
                  <div className="text-[#f0e8d8]/50 text-sm font-body font-light leading-relaxed whitespace-pre-wrap">
                    {doc.body}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
