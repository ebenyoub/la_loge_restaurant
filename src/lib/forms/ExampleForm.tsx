import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { exampleSchema, ExampleFormData } from "../validation/example";
import { Input, Textarea, Checkbox, Button } from "@/components/ui";

interface ExampleFormProps {
  onSubmitSuccess: (data: ExampleFormData) => void;
}

export function ExampleForm({ onSubmitSuccess }: ExampleFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ExampleFormData>({
    resolver: zodResolver(exampleSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      consent: false,
    },
  });

  const onSubmit = async (data: ExampleFormData) => {
    // Simuler un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000));
    onSubmitSuccess(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <fieldset disabled={isSubmitting} className="space-y-5">
        <Input
          label="Nom *"
          placeholder="Votre nom"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email *"
          type="email"
          placeholder="vous@email.fr"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Téléphone (facultatif)"
          type="tel"
          placeholder="06 00 00 00 00"
          error={errors.phone?.message}
          {...register("phone")}
        />

        <Textarea
          label="Message *"
          placeholder="Votre message…"
          error={errors.message?.message}
          {...register("message")}
        />

        <Checkbox
          label="J&apos;accepte le traitement de mes données conformément à la politique de confidentialité *"
          error={errors.consent?.message}
          {...register("consent")}
        />

        <Button type="submit" isLoading={isSubmitting} fullWidth>
          Envoyer l&apos;exemple
        </Button>
      </fieldset>
    </form>
  );
}
