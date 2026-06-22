import React from "react";
import { ContactFormData, FormErrors } from "../types";
import { Input, Textarea, Checkbox, Button, Alert } from "@/components/ui";

interface ContactFormProps {
  formData: ContactFormData;
  isLoading: boolean;
  errors: FormErrors;
  successMessage: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  restaurantName: string;
}

export function ContactForm({
  formData,
  isLoading,
  errors,
  successMessage,
  handleChange,
  handleSubmit,
  restaurantName,
}: ContactFormProps) {
  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <fieldset disabled={isLoading} className="space-y-5">
        {successMessage && (
          <Alert variant="success" layout="banner">
            {successMessage}
          </Alert>
        )}

        {errors.global && (
          <Alert variant="error" layout="banner">
            {errors.global}
          </Alert>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="name"
            name="name"
            type="text"
            required
            label="Nom *"
            value={formData.name}
            onChange={handleChange}
            placeholder="Votre nom"
            error={errors.name}
          />
          <Input
            id="email"
            name="email"
            type="email"
            required
            label="Email *"
            value={formData.email}
            onChange={handleChange}
            placeholder="vous@email.fr"
            error={errors.email}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Input
            id="phone"
            name="phone"
            type="tel"
            label="Téléphone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="06 00 00 00 00 (facultatif)"
            error={errors.phone}
          />
          <Input
            id="subject"
            name="subject"
            type="text"
            required
            label="Sujet *"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Demande d'information…"
            error={errors.subject}
          />
        </div>
        <Textarea
          id="message"
          name="message"
          rows={5}
          required
          label="Message *"
          value={formData.message}
          onChange={handleChange}
          placeholder="Votre message…"
          error={errors.message}
        />

        <Checkbox
          id="consent"
          name="consent"
          checked={formData.consent}
          onChange={handleChange}
          required
          label={`J'accepte que mes informations soient collectées et utilisées par ${restaurantName} pour traiter ma demande de contact conformément à la politique de confidentialité. *`}
          error={errors.consent}
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
