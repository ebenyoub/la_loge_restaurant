import type { Metadata } from "next";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
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
          <Header />
          <main>{children}</main>
          <Footer />
        </SettingsProvider>
      </body>
    </html>
  );
}
