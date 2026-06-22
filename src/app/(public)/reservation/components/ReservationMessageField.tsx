interface ReservationMessageFieldProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  error?: string;
  inputClass: string;
  labelClass: string;
}

export function ReservationMessageField({
  value,
  onChange,
  error,
  inputClass,
  labelClass,
}: ReservationMessageFieldProps) {
  return (
    <div>
      <label htmlFor="message" className={labelClass}>Message particulier (facultatif)</label>
      <textarea
        id="message"
        name="message"
        rows={4}
        value={value}
        onChange={onChange}
        placeholder="Allergies, spécificités, table calme..."
        className={`${inputClass} resize-none`}
      />
      {error && <span className="text-red-400 text-[11px] font-body mt-1 block">{error}</span>}
    </div>
  );
}
