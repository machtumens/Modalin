import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.AUTH_URL ?? "http://localhost:3000";
  const routes = ["", "/marketplace", "/untuk-investor", "/untuk-umkm", "/mitra-bpr", "/tentang", "/faq", "/legal/risiko", "/legal/privasi", "/legal/tos"];
  return routes.map((r) => ({ url: `${base}${r}`, lastModified: new Date() }));
}
