import { useState, useEffect, useCallback } from "react";
import { API_BASE_URL } from "@/lib/api";
import { SettingsData } from "@/components/settings-context";
import { ReservationFormData, FormErrors } from "../types";

export function useReservationForm(settings: SettingsData | null) {
  const [formData, setFormData] = useState<ReservationFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    requestedDate: "",
    requestedTime: "",
    guestCount: 2,
    occasion: "",
    message: "",
    consent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getAvailableTimeSlots = useCallback(() => {
    if (!formData.requestedDate || !settings?.openingHours) return [];
    
    const [year, month, day] = formData.requestedDate.split("-").map(Number);
    const dateObj = new Date(year, month - 1, day);
    const dayOfWeek = dateObj.getDay();

    const dayHours = settings.openingHours.find((oh) => oh.dayOfWeek === dayOfWeek);
    if (!dayHours || dayHours.isClosed || !dayHours.opensAt || !dayHours.closesAt) {
      return [];
    }

    const slots: string[] = [];
    const [openH, openM] = dayHours.opensAt.split(":").map(Number);
    const [closeH, closeM] = dayHours.closesAt.split(":").map(Number);

    const current = new Date(year, month - 1, day, openH, openM);
    const end = new Date(year, month - 1, day, closeH, closeM);

    while (current <= end) {
      const h = String(current.getHours()).padStart(2, "0");
      const m = String(current.getMinutes()).padStart(2, "0");
      slots.push(`${h}:${m}`);
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  }, [formData.requestedDate, settings]);

  const slots = getAvailableTimeSlots();

  useEffect(() => {
    if (formData.requestedDate && settings?.openingHours) {
      const validSlots = getAvailableTimeSlots();
      if (formData.requestedTime && !validSlots.includes(formData.requestedTime)) {
        Promise.resolve().then(() => {
          setFormData((prev) => ({
            ...prev,
            requestedTime: "",
          }));
        });
      }
    }
  }, [formData.requestedDate, settings, getAvailableTimeSlots, formData.requestedTime]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: val,
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage(null);

    const fieldsErrors: FormErrors = {};
    if (!formData.firstName.trim()) fieldsErrors.firstName = "Le prénom est requis.";
    if (!formData.lastName.trim()) fieldsErrors.lastName = "Le nom est requis.";
    if (!formData.phone.trim()) fieldsErrors.phone = "Le numéro de téléphone est requis.";
    if (!formData.email.trim()) fieldsErrors.email = "L'adresse e-mail est requise.";
    if (!formData.requestedDate) fieldsErrors.requestedDate = "La date est requise.";
    if (!formData.requestedTime) fieldsErrors.requestedTime = "L'heure est requise.";
    if (!formData.consent) fieldsErrors.consent = "Votre consentement est requis.";

    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      setIsLoading(false);
      return;
    }

    try {
      const occasionMapped = formData.occasion === "repas-pro" ? "repas_pro" : formData.occasion || null;

      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          requestedDate: formData.requestedDate,
          requestedTime: formData.requestedTime,
          guestCount: Number(formData.guestCount),
          occasion: occasionMapped,
          message: formData.message || null,
          consent: formData.consent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.code === "VALIDATION_ERROR" && result.error.fields) {
          setErrors(result.error.fields);
        } else {
          setErrors({
            global: result.error?.message || "Une erreur est survenue lors de l'envoi de votre demande.",
          });
        }
      } else {
        setSuccessMessage(result.data.message || "Votre demande de réservation a bien été envoyée !");
        setFormData({
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          requestedDate: "",
          requestedTime: "",
          guestCount: 2,
          occasion: "",
          message: "",
          consent: false,
        });
      }
    } catch {
      setErrors({
        global: "Impossible de joindre le serveur. Veuillez vérifier votre connexion.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    errors,
    successMessage,
    slots,
    handleChange,
    handleSubmit,
  };
}
