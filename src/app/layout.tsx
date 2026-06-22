import type { Metadata } from "next";
import { SettingsProvider } from "@/components/settings-context";
import "./globals.css";

export const metadata: Metadata = {
  title: "La Loge Bar & Food",
  description: "Projet de refonte du site de La Loge Bar & Food à Lyon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <SettingsProvider>
          {children}
        </SettingsProvider>
      </body>
    </html>
  );
}
