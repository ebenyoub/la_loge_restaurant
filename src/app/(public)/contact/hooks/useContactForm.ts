import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL } from "@/lib/api";
import { contactSchema, ContactFormData } from "@/lib/validation/contact";

export function useContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsLoading(true);
    setGlobalError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${API_BASE_URL}/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
          consent: data.consent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.code === "VALIDATION_ERROR" && result.error.fields) {
          const fields = result.error.fields;
          Object.keys(fields).forEach((key) => {
            setError(key as keyof ContactFormData, {
              type: "server",
              message: fields[key],
            });
          });
        } else {
          setGlobalError(result.error?.message || "Une erreur est survenue lors de l'envoi de votre message.");
        }
      } else {
        setSuccessMessage(result.data.message || "Votre message a bien été envoyé !");
        reset();
      }
    } catch {
      setGlobalError("Impossible de joindre le serveur. Veuillez vérifier votre connexion.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    errors,
    isLoading,
    globalError,
    successMessage,
    onSubmit: handleSubmit(onSubmit),
  };
}
