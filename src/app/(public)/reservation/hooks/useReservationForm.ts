import { useState, useEffect, useCallback } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL } from "@/lib/api";
import { SettingsData } from "@/components/settings-context";
import { reservationSchema, ReservationFormData } from "@/lib/validation/reservation";

export function useReservationForm(settings: SettingsData | null) {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    setError,
    formState: { errors },
  } = useForm<ReservationFormData>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
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
    },
  });

  const requestedDate = useWatch({ control, name: "requestedDate" });
  const requestedTime = useWatch({ control, name: "requestedTime" });

  const getAvailableTimeSlots = useCallback(() => {
    if (!requestedDate || !settings?.openingHours) return [];
    
    const [year, month, day] = requestedDate.split("-").map(Number);
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
  }, [requestedDate, settings]);

  const slots = getAvailableTimeSlots();

  useEffect(() => {
    if (requestedDate && settings?.openingHours) {
      const validSlots = getAvailableTimeSlots();
      if (requestedTime && !validSlots.includes(requestedTime)) {
        setValue("requestedTime", "");
      }
    }
  }, [requestedDate, settings, getAvailableTimeSlots, requestedTime, setValue]);

  const onSubmit = async (data: ReservationFormData) => {
    setIsLoading(true);
    setGlobalError(null);
    setSuccessMessage(null);

    try {
      const occasionMapped = data.occasion === "repas-pro" ? "repas_pro" : data.occasion || null;

      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          requestedDate: data.requestedDate,
          requestedTime: data.requestedTime,
          guestCount: Number(data.guestCount),
          occasion: occasionMapped,
          message: data.message || null,
          consent: data.consent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.code === "VALIDATION_ERROR" && result.error.fields) {
          const fields = result.error.fields;
          Object.keys(fields).forEach((key) => {
            setError(key as keyof ReservationFormData, {
              type: "server",
              message: fields[key],
            });
          });
        } else {
          setGlobalError(result.error?.message || "Une erreur est survenue lors de l'envoi de votre demande.");
        }
      } else {
        setSuccessMessage(result.data.message || "Votre demande de réservation a bien été envoyée !");
        reset({
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
      setGlobalError("Impossible de joindre le serveur. Veuillez vérifier votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    requestedDate,
    errors,
    isLoading,
    globalError,
    successMessage,
    slots,
    onSubmit: handleSubmit(onSubmit),
  };
}
