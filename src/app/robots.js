export default function robots() {
  const base = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/owner", "/owner/", "/api/", "/support"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
