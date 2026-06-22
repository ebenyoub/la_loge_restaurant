interface ReservationTimeFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  error?: string;
  slots: string[];
  hasDate: boolean;
  inputClass: string;
  labelClass: string;
}

export function ReservationTimeField({
  value,
  onChange,
  error,
  slots,
  hasDate,
  inputClass,
  labelClass,
}: ReservationTimeFieldProps) {
  return (
    <div>
      <label htmlFor="requestedTime" className={labelClass}>Heure *</label>
      <select
        id="requestedTime"
        name="requestedTime"
        required
        value={value}
        onChange={onChange}
        disabled={!hasDate || slots.length === 0}
        className={`${inputClass} appearance-none cursor-pointer bg-[#1e1e1b]`}
      >
        <option value="">
          {!hasDate
            ? "Choisir une date d'abord"
            : slots.length === 0
            ? "Fermé ce jour-là"
            : "-- Choisir une heure --"}
        </option>
        {slots.map((slot) => (
          <option key={slot} value={slot}>
            {slot}
          </option>
        ))}
      </select>
      {error && <span className="text-red-400 text-[11px] font-body mt-1 block">{error}</span>}
    </div>
  );
}
