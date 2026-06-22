import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.lalogelyon.fr";

  const routes = ["", "/carte", "/reservation", "/contact", "/mentions-legales"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/carte" ? "weekly" : "monthly",
    priority: route === "" ? 1.0 : route === "/mentions-legales" ? 0.3 : 0.8,
  }));
}
