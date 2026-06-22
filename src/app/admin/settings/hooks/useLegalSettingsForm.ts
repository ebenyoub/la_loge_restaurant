import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL } from "@/lib/api";
import { legalSettingsSchema, LegalSettingsFormData } from "@/lib/validation/legal";

export function useLegalSettingsForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LegalSettingsFormData>({
    resolver: zodResolver(legalSettingsSchema),
    defaultValues: {
      mentions_legales: { title: "", body: "", version: "" },
      confidentialite: { title: "", body: "", version: "" },
      cookies: { title: "", body: "", version: "" },
    },
  });

  const fetchLegalDocuments = useCallback(async () => {
    Promise.resolve().then(() => {
      setIsLoading(true);
      setGlobalError(null);
    });
    const token = localStorage.getItem("admin_token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/legal-documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const json = await res.json();
      if (!res.ok) {
        setGlobalError(json.error?.message || "Erreur de chargement des documents légaux.");
      } else {
        const docs = json.data || [];
        docs.forEach((doc: { documentKey: string; title: string; body: string; version: string }) => {
          if (doc.documentKey === "mentions_legales" || doc.documentKey === "confidentialite" || doc.documentKey === "cookies") {
            setValue(`${doc.documentKey}.title`, doc.title);
            setValue(`${doc.documentKey}.body`, doc.body);
            setValue(`${doc.documentKey}.version`, doc.version);
          }
        });
      }
    } catch {
      setGlobalError("Impossible de contacter le serveur.");
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchLegalDocuments();
    });
  }, [fetchLegalDocuments]);

  const onSubmit = async (data: LegalSettingsFormData) => {
    setIsLoading(true);
    setGlobalError(null);
    setSuccessMessage(null);
    const token = localStorage.getItem("admin_token");

    const payload = {
      documents: [
        {
          documentKey: "mentions_legales",
          title: data.mentions_legales.title,
          body: data.mentions_legales.body,
          version: data.mentions_legales.version,
        },
        {
          documentKey: "confidentialite",
          title: data.confidentialite.title,
          body: data.confidentialite.body,
          version: data.confidentialite.version,
        },
        {
          documentKey: "cookies",
          title: data.cookies.title,
          body: data.cookies.body,
          version: data.cookies.version,
        },
      ],
    };

    try {
      const res = await fetch(`${API_BASE_URL}/admin/legal-documents`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        if (json.error && json.error.code === "VALIDATION_ERROR" && json.error.fields) {
          const fields = json.error.fields;
          Object.keys(fields).forEach((key) => {
            setGlobalError(fields[key]);
          });
        } else {
          setGlobalError(json.error?.message || "Erreur lors de l'enregistrement.");
        }
      } else {
        setSuccessMessage("Documents légaux enregistrés avec succès.");
        fetchLegalDocuments();
      }
    } catch {
      setGlobalError("Erreur réseau lors de l'enregistrement.");
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
