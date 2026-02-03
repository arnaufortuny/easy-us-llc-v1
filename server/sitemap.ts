import type { Express } from "express";

const BASE_URL = "https://easyusllc.com";

const PUBLIC_ROUTES = [
  { path: "/", priority: 1.0, changefreq: "weekly" },
  { path: "/servicios", priority: 0.9, changefreq: "weekly" },
  { path: "/faq", priority: 0.8, changefreq: "monthly" },
  { path: "/contacto", priority: 0.7, changefreq: "monthly" },
  { path: "/llc/formation", priority: 0.9, changefreq: "weekly" },
  { path: "/llc/maintenance", priority: 0.8, changefreq: "weekly" },
  { path: "/legal/terminos", priority: 0.4, changefreq: "yearly" },
  { path: "/legal/privacidad", priority: 0.4, changefreq: "yearly" },
  { path: "/legal/reembolsos", priority: 0.4, changefreq: "yearly" },
  { path: "/legal/cookies", priority: 0.4, changefreq: "yearly" },
];

export function generateSitemap(): string {
  const today = new Date().toISOString().split("T")[0];
  
  const urls = PUBLIC_ROUTES.map(route => `
  <url>
    <loc>${BASE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority.toFixed(1)}</priority>
  </url>`).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function setupSitemapRoute(app: Express): void {
  app.get("/sitemap.xml", (req, res) => {
    res.header("Content-Type", "application/xml");
    res.header("Cache-Control", "public, max-age=3600");
    res.send(generateSitemap());
  });
  
  app.get("/robots.txt", (req, res) => {
    res.header("Content-Type", "text/plain");
    res.send(`User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /auth/

Sitemap: ${BASE_URL}/sitemap.xml`);
  });
}
