import "./globals.css";
import SiteChrome from "../components/layout/SiteChrome";
import CookieConsent from "../components/layout/CookieConsent";
import ScrollReveal from "../components/layout/ScrollReveal";
import { SITE_URL, SITE_TITLE, SITE_DESCRIPTION, openGraph } from "../lib/seo";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s | MessFinder",
  },
  description: SITE_DESCRIPTION,
  applicationName: "MessFinder",
  generator: "Next.js",
  keywords: [
    "MessFinder",
    "mess near me",
    "tiffin service near me",
    "mess service",
    "monthly mess plan",
    "daily meal subscription",
    "home style food",
    "veg mess",
    "non veg mess",
    "PG mess",
    "meal plan near me",
  ],
  authors: [{ name: "MessFinder" }],
  creator: "MessFinder",
  publisher: "MessFinder",
  category: "Food & Dining",
  alternates: { canonical: "/" },
  openGraph: openGraph({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
  }),
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/og-cover.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&display=swap"
        />
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-screen flex-col">
        <SiteChrome>{children}</SiteChrome>
        <CookieConsent />
        <ScrollReveal />
      </body>
    </html>
  );
}
