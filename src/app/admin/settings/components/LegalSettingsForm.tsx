"use client";

import { useLegalSettingsForm } from "../hooks/useLegalSettingsForm";
import { Input, Textarea, Button, Alert } from "@/components/ui";

export function LegalSettingsForm() {
  const {
    register,
    errors,
    isLoading,
    globalError,
    successMessage,
    onSubmit,
  } = useLegalSettingsForm();

  return (
    <div className="space-y-6">
      <div className="border border-[#c9a96e]/15 bg-[#141412] p-6 space-y-6">
        <h2 className="font-body font-medium text-xl text-[#f0e8d8] border-b border-[#c9a96e]/10 pb-2">
          Documents Légaux &amp; RGPD
        </h2>
        <p className="text-xs text-[#f0e8d8]/55 font-body">
          Modifiez le titre, le contenu et la version des mentions légales, politiques de confidentialité et cookies.
        </p>

        {globalError && (
          <Alert variant="error">
            {globalError}
          </Alert>
        )}
        {successMessage && (
          <Alert variant="success">
            {successMessage}
          </Alert>
        )}

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Card: Mentions Légales */}
          <div className="bg-[#1e1e1b]/30 border border-[#c9a96e]/10 p-5 space-y-4">
            <h3 className="font-body font-medium text-lg text-[#f0e8d8] border-b border-[#c9a96e]/5 pb-2">
              Mentions Légales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Titre du document *"
                  {...register("mentions_legales.title")}
                  error={errors.mentions_legales?.title?.message}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  label="Version *"
                  {...register("mentions_legales.version")}
                  error={errors.mentions_legales?.version?.message}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <Textarea
                label="Contenu *"
                {...register("mentions_legales.body")}
                error={errors.mentions_legales?.body?.message}
                disabled={isLoading}
                rows={10}
              />
            </div>
          </div>

          {/* Card: Politique de Confidentialité */}
          <div className="bg-[#1e1e1b]/30 border border-[#c9a96e]/10 p-5 space-y-4">
            <h3 className="font-body font-medium text-lg text-[#f0e8d8] border-b border-[#c9a96e]/5 pb-2">
              Politique de Confidentialité
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Titre du document *"
                  {...register("confidentialite.title")}
                  error={errors.confidentialite?.title?.message}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  label="Version *"
                  {...register("confidentialite.version")}
                  error={errors.confidentialite?.version?.message}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <Textarea
                label="Contenu *"
                {...register("confidentialite.body")}
                error={errors.confidentialite?.body?.message}
                disabled={isLoading}
                rows={8}
              />
            </div>
          </div>

          {/* Card: Gestion des Cookies */}
          <div className="bg-[#1e1e1b]/30 border border-[#c9a96e]/10 p-5 space-y-4">
            <h3 className="font-body font-medium text-lg text-[#f0e8d8] border-b border-[#c9a96e]/5 pb-2">
              Gestion des Cookies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Titre du document *"
                  {...register("cookies.title")}
                  error={errors.cookies?.title?.message}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Input
                  label="Version *"
                  {...register("cookies.version")}
                  error={errors.cookies?.version?.message}
                  disabled={isLoading}
                />
              </div>
            </div>
            <div>
              <Textarea
                label="Contenu *"
                {...register("cookies.body")}
                error={errors.cookies?.body?.message}
                disabled={isLoading}
                rows={8}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {isLoading ? "Enregistrement en cours..." : "Enregistrer les Documents Légaux"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
