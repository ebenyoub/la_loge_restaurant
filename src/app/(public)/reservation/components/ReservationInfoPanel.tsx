import Link from "next/link";

interface ReservationInfoPanelProps {
  phoneText: string;
  emailText: string;
}

export function ReservationInfoPanel({ phoneText, emailText }: ReservationInfoPanelProps) {
  return (
    <div className="mt-12 pt-10 border-t border-[#c9a96e]/12 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/60 font-body mb-1">
          Besoin d&apos;une réponse urgente ?
        </p>
        <p className="text-[#f0e8d8]/45 text-sm font-body font-light">
          Tél : <a href={`tel:${phoneText.replace(/\s+/g, "")}`} className="hover:text-[#c9a96e] transition-colors">{phoneText}</a> · Email : <a href={`mailto:${emailText}`} className="hover:text-[#c9a96e] transition-colors">{emailText}</a>
        </p>
      </div>
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 px-6 py-3 border border-[#c9a96e]/35 text-[#c9a96e] text-xs uppercase tracking-wider font-body hover:bg-[#c9a96e] hover:text-[#0b0b09] transition-all"
      >
        Contact &amp; Accès
      </Link>
    </div>
  );
}
