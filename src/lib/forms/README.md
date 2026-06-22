# Standards de Formulaires — React Hook Form + Zod

Ce dossier définit les conventions et l'outillage pour la gestion et la validation des formulaires du projet.

## 1. Conventions de nommage

- **Fichiers de validation :** Placer les règles de validation dans `src/lib/validation/` (ex. `reservation.ts`) ou dans le dossier local de la feature s'il est spécifique.
- **Schémas Zod :** Le schéma de validation exporté doit être suffixé par `Schema` (ex: `contactSchema`, `loginSchema`).
- **Types TypeScript :** Les types TypeScript associés doivent être directement dérivés du schéma à l'aide de `z.infer` et suffixés par `FormData` (ex: `ContactFormData`).

Exemple :
```typescript
import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(1, "Requis"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
```

## 2. Intégration RHF + Zod

- Toujours initialiser `useForm` avec le résolveur Zod et définir explicitement des `defaultValues` pour chaque champ afin d'éviter les comportements instables de composants non contrôlés.
- Utiliser les composants réutilisables typés de `src/components/ui/` (`Input`, `Select`, `Textarea`, `Checkbox`, `Button`).
- Connecter les inputs à RHF via la déstructuration de la méthode `register` (qui transmet automatiquement `name`, `onChange`, `onBlur`, et la `ref` grâce à `React.forwardRef`).

Exemple d'utilisation :
```tsx
const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
  resolver: zodResolver(contactSchema),
  defaultValues: { name: "" }
});

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <Input
      label="Nom"
      error={errors.name?.message}
      {...register("name")}
    />
  </form>
);
```
