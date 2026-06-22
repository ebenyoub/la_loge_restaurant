interface ReservationGuestCountFieldProps {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  inputClass: string;
  labelClass: string;
}

export function ReservationGuestCountField({
  value,
  onChange,
  error,
  inputClass,
  labelClass,
}: ReservationGuestCountFieldProps) {
  return (
    <div>
      <label htmlFor="guestCount" className={labelClass}>Personnes *</label>
      <select
        id="guestCount"
        name="guestCount"
        required
        value={value}
        onChange={onChange}
        className={`${inputClass} appearance-none cursor-pointer bg-[#1e1e1b]`}
      >
        {Array.from({ length: 14 }, (_, i) => i + 2).map((num) => (
          <option key={num} value={num}>
            {num} personne{num > 1 ? "s" : ""}
          </option>
        ))}
      </select>
      {error && <span className="text-red-400 text-[11px] font-body mt-1 block">{error}</span>}
    </div>
  );
}
