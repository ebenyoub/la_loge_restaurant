interface ReservationConsentFieldProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  restaurantName: string;
}

export function ReservationConsentField({
  checked,
  onChange,
  error,
  restaurantName,
}: ReservationConsentFieldProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-3 py-2">
        <input
          id="consent"
          name="consent"
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required
          className="mt-1 h-4 w-4 bg-[#1e1e1b] border border-[#c9a96e]/20 text-[#c9a96e] focus:ring-[#c9a96e]/50 focus:ring-opacity-25 shrink-0"
        />
        <label htmlFor="consent" className="text-xs text-[#f0e8d8]/60 leading-tight select-none">
          J&apos;accepte que mes coordonnées soient utilisées par {restaurantName} pour traiter ma demande de réservation. *
        </label>
      </div>
      {error && <span className="text-red-400 text-[11px] font-body block">{error}</span>}
    </div>
  );
}
