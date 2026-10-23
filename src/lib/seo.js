export const SITE_NAME = "MessFinder";

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");

export const SITE_TITLE = "MessFinder — Find Mess & Tiffin Services Near You";

export const SITE_DESCRIPTION =
  "MessFinder helps you discover and compare mess and tiffin services in your city. Browse weekly menus, monthly meal plans and veg or non-veg home style food near you.";

export const OG_IMAGE = {
  url: "/images/og-cover.png",
  width: 1200,
  height: 630,
  alt: "MessFinder — find mess and tiffin services near you",
};

// Shared OpenGraph defaults so every page keeps the site name and share image.
export function openGraph({ title, description, url }) {
  return {
    type: "website",
    siteName: SITE_NAME,
    title,
    description,
    url,
    locale: "en_IN",
    images: [OG_IMAGE],
  };
}
