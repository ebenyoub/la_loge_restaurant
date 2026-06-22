"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/lib/api";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExpired, setIsExpired] = useState(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setIsExpired(false);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
        document.cookie = `admin_token=${token}; path=/; max-age=28800; SameSite=Strict; Secure`;

        // Redirect to admin reservation dashboard
        router.push("/admin/reservations");
      }
    } catch {
      setError("Impossible de contacter le serveur d'authentification.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full bg-[#1e1e1b] border border-[#c9a96e]/15 text-[#f0e8d8] px-4 py-3 text-sm font-body font-light placeholder:text-[#f0e8d8]/25 focus:outline-none focus:border-[#c9a96e]/50 transition-colors";
  const labelClass = "block text-[10px] tracking-[0.3em] uppercase font-body text-[#c9a96e]/70 mb-2";

  return (
    <div className="min-h-screen bg-[#0b0b09] flex items-center justify-center px-6 py-12 text-[#f0e8d8] font-body">
      <section className="max-w-md w-full border border-[#c9a96e]/15 bg-[#141412] p-8 md:p-10" aria-labelledby="login-title">
        <div className="text-center mb-8">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#c9a96e]/70 font-body mb-2">Espace Administration</p>
          <h1 id="login-title" className="font-body font-medium text-3xl text-[#f0e8d8] mb-4">La Loge Bar &amp; Food</h1>
          <GoldLine />
        </div>

        {isExpired && !error && (
          <div className="p-4 mb-6 bg-[#c9a96e]/10 border border-[#c9a96e]/20 text-[#c9a96e] text-xs font-body" role="status">
            <p>Votre session a expiré, veuillez vous reconnecter.</p>
          </div>
        )}

        {error && (
          <div className="p-4 mb-6 bg-red-500/10 border-l-4 border-red-500 text-red-400 text-sm font-body" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className={labelClass}>Adresse e-mail</label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoComplete="username"
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>Mot de passe</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              disabled={isLoading}
              className={inputClass}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-[#c9a96e] text-[#0b0b09] text-[11px] tracking-[0.3em] uppercase font-body font-semibold hover:bg-[#dbbe86] active:bg-[#b8924a] transition-all cursor-pointer border-0"
          >
            {isLoading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>
      </section>
    </div>
  );
}
