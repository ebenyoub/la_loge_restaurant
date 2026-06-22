import { useState } from "react";
import { API_BASE_URL } from "@/lib/api";
import { ContactFormData, FormErrors } from "../types";

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    consent: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
    if (!formData.name.trim()) fieldsErrors.name = "Le nom est requis.";
    if (!formData.email.trim()) fieldsErrors.email = "L'adresse e-mail est requise.";
    if (!formData.subject.trim()) fieldsErrors.subject = "L'objet est requis.";
    if (!formData.message.trim()) fieldsErrors.message = "Le message est requis.";
    if (!formData.consent) fieldsErrors.consent = "Votre consentement est requis.";

    if (Object.keys(fieldsErrors).length > 0) {
      setErrors(fieldsErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject,
          message: formData.message,
          consent: formData.consent,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.error && result.error.code === "VALIDATION_ERROR" && result.error.fields) {
          setErrors(result.error.fields);
        } else {
          setErrors({
            global: result.error?.message || "Une erreur est survenue lors de l'envoi de votre message.",
          });
        }
      } else {
        setSuccessMessage(result.data.message || "Votre message a bien été envoyé !");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
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
    handleChange,
    handleSubmit,
  };
}
