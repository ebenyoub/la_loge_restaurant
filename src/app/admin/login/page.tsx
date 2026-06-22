"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { API_BASE_URL } from "@/lib/api";
import { loginSchema, LoginFormData } from "@/lib/validation/login";
import { Input, Button, Alert } from "@/components/ui";

function GoldLine() {
  return (
    <div className="flex items-center gap-3 justify-center mb-6">
      <div className="h-px w-8 bg-[#c9a96e]/30" />
      <div className="w-1 h-1 rotate-45 bg-[#c9a96e]/50" />
      <div className="h-px w-8 bg-[#c9a96e]/30" />
    </div>
  );
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    const userStr = localStorage.getItem("admin_user");
    if (token && userStr) {
      router.push("/admin/reservations");
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("expired") === "true") {
        Promise.resolve().then(() => {
          setIsExpired(true);
        });
      }
    }
  }, [router]);

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    setIsExpired(false);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error?.message || "Identifiants de connexion invalides.");
      } else {
        const { token, admin } = result.data;
        // Store JWT securely in localStorage for API requests (admin dashboard needs client-side storage)
        localStorage.setItem("admin_token", token);
        localStorage.setItem("admin_user", JSON.stringify(admin));

        // Set a cookie so middleware or server components could potentially read it if needed later
        /* eslint-disable-next-line react-hooks/immutability */
        window.document.cookie = `admin_token=${token}; path=/; max-age=28800; SameSite=Strict; Secure`;

        // Redirect to admin reservation dashboard
        router.push("/admin/reservations");
      }
    } catch {
      setError("Impossible de contacter le serveur d'authentification.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b09] flex items-center justify-center px-6 py-12 text-[#f0e8d8] font-body">
      <section className="max-w-md w-full border border-[#c9a96e]/15 bg-[#141412] p-8 md:p-10" aria-labelledby="login-title">
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/70 font-body mb-2">Espace Administration</p>
          <h1 id="login-title" className="font-body font-medium text-3xl text-[#f0e8d8] mb-4">La Loge Bar &amp; Food</h1>
          <GoldLine />
        </div>

        {isExpired && !error && (
          <Alert variant="gold" layout="banner" className="mb-6">
            Votre session a expiré, veuillez vous reconnecter.
          </Alert>
        )}

        {error && (
          <Alert variant="error" layout="banner" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            id="email"
            type="email"
            label="Adresse e-mail"
            placeholder="admin@example.com"
            autoComplete="username"
            disabled={isLoading}
            error={errors.email?.message}
            {...register("email")}
          />

          <Input
            id="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            autoComplete="current-password"
            disabled={isLoading}
            error={errors.password?.message}
            {...register("password")}
          />

          <Button
            type="submit"
            isLoading={isLoading}
            fullWidth
          >
            Se connecter
          </Button>
        </form>
      </section>
    </div>
  );
}
