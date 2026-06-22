interface ReservationDateFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  inputClass: string;
  labelClass: string;
}

export function ReservationDateField({
  value,
  onChange,
  error,
  inputClass,
  labelClass,
}: ReservationDateFieldProps) {
  return (
    <div>
      <label htmlFor="requestedDate" className={labelClass}>Date souhaitée *</label>
      <input
        id="requestedDate"
        name="requestedDate"
        type="date"
        required
        value={value}
        onChange={onChange}
        className={`${inputClass} [color-scheme:dark]`}
      />
      {error && <span className="text-red-400 text-[11px] font-body mt-1 block">{error}</span>}
    </div>
  );
}
