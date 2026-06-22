import { ReservationFormData, FormErrors } from "../types";

interface ReservationContactFieldsProps {
  formData: ReservationFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors: FormErrors;
  inputClass: string;
  labelClass: string;
}

export function ReservationContactFields({
  formData,
  handleChange,
  errors,
  inputClass,
  labelClass,
}: ReservationContactFieldsProps) {
  return (
    <div className="border border-[#c9a96e]/10 p-4 sm:p-6 bg-[#141412]/30 space-y-5">
      <p className="text-[10px] tracking-[0.3em] uppercase text-[#c9a96e]/80 font-body border-b border-[#c9a96e]/10 pb-2">
        Vos coordonnées
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="lastName" className={labelClass}>Nom *</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Dupont"
            className={inputClass}
          />
          {errors.lastName && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.lastName}</span>}
        </div>
        <div>
          <label htmlFor="firstName" className={labelClass}>Prénom *</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Marie"
            className={inputClass}
          />
          {errors.firstName && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.firstName}</span>}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="phone" className={labelClass}>Téléphone *</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            value={formData.phone}
            onChange={handleChange}
            placeholder="06 00 00 00 00"
            className={inputClass}
          />
          {errors.phone && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.phone}</span>}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email *</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="marie@email.fr"
            className={inputClass}
          />
          {errors.email && <span className="text-red-400 text-[11px] font-body mt-1 block">{errors.email}</span>}
        </div>
      </div>
    </div>
  );
}
