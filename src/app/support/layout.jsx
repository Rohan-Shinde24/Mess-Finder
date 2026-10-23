import { openGraph } from "../../lib/seo";

export const metadata = {
  title: "Support: Get Help with Your MessFinder Account",
  description:
    "Contact MessFinder support for help with your account, a mess listing, reviews, technical issues or advertising. Create a support ticket and track it.",
  keywords: [
    "messfinder support",
    "contact messfinder",
    "help center",
    "report a listing",
    "account help",
    "support ticket",
    "mess listing help",
    "advertising support",
  ],
  alternates: { canonical: "/support" },
  openGraph: openGraph({
    title: "Support: Get Help with Your MessFinder Account",
    description:
      "Contact MessFinder support for help with your account, a mess listing, reviews, technical issues or advertising. Create a support ticket and track it.",
    url: "/support",
  }),
};

export default function SupportLayout({ children }) {
  return children;
}
