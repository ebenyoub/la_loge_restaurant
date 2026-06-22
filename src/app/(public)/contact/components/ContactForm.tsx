import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ContactFormData } from "@/lib/validation/contact";
import { Input, Textarea, Checkbox, Button, Alert } from "@/components/ui";

interface ContactFormProps {
  register: UseFormRegister<ContactFormData>;
  errors: FieldErrors<ContactFormData>;
  isLoading: boolean;
  globalError: string | null;
  successMessage: string | null;
  onSubmit: (e: React.FormEvent) => void;
  restaurantName: string;
}

export function ContactForm({
  register,
  errors,
  isLoading,
  globalError,
  successMessage,
  onSubmit,
  restaurantName,
}: ContactFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <fieldset disabled={isLoading} className="space-y-5">
        {successMessage && (
          <Alert variant="success" layout="banner">
            {successMessage}
          </Alert>
        )}

        {globalError && (
          <Alert variant="error" layout="banner">
            {globalError}
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="name"
            type="text"
            required
            label="Nom *"
            placeholder="Votre nom"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            id="email"
            type="email"
            required
            label="Email *"
            placeholder="vous@email.fr"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="phone"
            type="tel"
            label="Téléphone"
            placeholder="06 00 00 00 00 (facultatif)"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            id="subject"
            type="text"
            required
            label="Sujet *"
            placeholder="Demande d'information…"
            error={errors.subject?.message}
            {...register("subject")}
          />
        </div>
        <Textarea
          id="message"
          rows={5}
          required
          label="Message *"
          placeholder="Votre message…"
          error={errors.message?.message}
          {...register("message")}
        />

        <Checkbox
          id="consent"
          required
          label={
            <span>
              J&apos;accepte que mes informations soient collectées et utilisées par {restaurantName} pour traiter ma demande de contact conformément à la{" "}
              <a
                href="/mentions-legales#confidentialite"
                className="underline hover:text-[#c9a96e] transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                politique de confidentialité
              </a>
              . *
            </span>
          }
          error={errors.consent?.message}
          {...register("consent")}
        />

        <Button
          type="submit"
          isLoading={isLoading}
          fullWidth
        >
          Envoyer le message
        </Button>
      </fieldset>
    </form>
  );
}
