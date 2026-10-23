
import Link from "next/link";
import { openGraph } from "../../lib/seo";

export const metadata = {
  title: "Terms & Conditions for Customers and Mess Owners",
  description:
    "Read the MessFinder Terms and Conditions covering accounts, mess listings, reviews, acceptable use and the rules for mess owners and customers.",
  keywords: [
    "messfinder terms",
    "terms and conditions",
    "user agreement",
    "mess listing rules",
    "account terms",
    "review policy",
    "mess owner terms",
    "website terms india",
  ],
  alternates: { canonical: "/terms" },
  openGraph: openGraph({
    title: "Terms & Conditions for Customers and Mess Owners",
    description:
      "Read the MessFinder Terms and Conditions covering accounts, mess listings, reviews, acceptable use and the rules for mess owners and customers.",
    url: "/terms",
  }),
};

const sections = [
  {
    title: "1. About these terms",
    content: [
      "These Terms and Conditions explain the rules for using MessFinder. By browsing the website, creating an account, or listing a mess you confirm that you have read and accepted them.",
      "If you do not agree with these terms, please do not use the service.",
    ],
  },
  {
    title: "2. Who can use MessFinder",
    content: [
      "You must be able to form a binding agreement under the laws that apply to you. Where local law requires supervision by a parent or guardian, you may only use MessFinder with that supervision.",
      "You agree to provide accurate information when you register and to keep your account details up to date.",
    ],
  },
  {
    title: "3. Accounts and security",
    content: [
      "You are responsible for the activity that happens through your account and for keeping your password confidential.",
      "There are three kinds of accounts: customer accounts for browsing, rating and reviewing messes; mess owner accounts for creating and managing listings; and administrator accounts used by our team for moderation.",
      "Contact us immediately if you believe your account has been accessed without your permission.",
    ],
  },
  {
    title: "4. Mess listings and owner responsibilities",
    content: [
      "Mess owners are responsible for the accuracy of everything they publish, including the mess name, address, contact details, weekly menu, meal plans and prices.",
      "New and edited listings are reviewed before or after publication and may be approved, rejected, suspended or removed if they break these terms or appear misleading.",
      "Owners must hold any licences or permits required to prepare and sell food in their area, and must follow applicable food safety and hygiene rules.",
    ],
  },
  {
    title: "5. Reviews, ratings and user content",
    content: [
      "Reviews and ratings must reflect your genuine experience as a customer. Fake, paid for, copied, abusive or defamatory reviews are not allowed.",
      "By submitting content you give us permission to display it on MessFinder. We may moderate, hide or remove content that breaks these terms.",
      "Do not post personal information about other people, and do not upload images you do not have the right to use.",
    ],
  },
  {
    title: "6. Acceptable use",
    content: [
      "Do not use MessFinder to break the law, mislead other users, scrape or copy data at scale, attempt to gain unauthorised access, or interfere with the normal operation of the website.",
      "We may suspend or close accounts that we reasonably believe are being misused.",
    ],
  },
  {
    title: "7. Prices and arrangements between users",
    content: [
      "Prices, menus and meal plans are set by mess owners, not by MessFinder. We display the information that owners publish.",
      "Any arrangement you make with a mess, including payment, delivery, portion size and quality, is between you and that mess. Please confirm details directly before paying.",
    ],
  },
  {
    title: "8. Intellectual property",
    content: [
      "The MessFinder name, design, text and software are owned by us or our licensors and may not be copied or reused without permission.",
      "You keep ownership of the content you upload, and you are responsible for making sure you have the right to share it.",
    ],
  },
  {
    title: "9. Third-party links and services",
    content: [
      "The website may link to third-party websites or services. Those services are governed by their own terms and policies, and we are not responsible for them.",
    ],
  },
  {
    title: "10. Availability and disclaimers",
    content: [
      "MessFinder is provided on an \"as is\" and \"as available\" basis. We work to keep listings accurate and the website running, but we do not guarantee uninterrupted availability or that every listing is complete or error free.",
      "To the extent permitted by law, we are not liable for indirect or consequential losses arising from your use of the website or from dealings between users and mess owners.",
    ],
  },
  {
    title: "11. Changes to these terms",
    content: [
      "We may update these terms when our services or legal obligations change. The updated version will be published on this page with a revised effective date, and continued use of MessFinder means you accept the updated terms.",
    ],
  },
  {
    title: "12. Contact us",
    content: [
      "If you have questions about these terms, or want to report a listing or a review, please reach us through the support page.",
    ],
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <header className="border-b border-emerald-100 bg-[#f3f7f0]">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-800">Legal</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#203126] sm:text-5xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-4 text-sm text-gray-600">Effective date: October 22, 2026</p>
          <p className="mt-5 max-w-2xl leading-7 text-gray-600">
            These terms apply when you visit MessFinder, create an account, review a mess, or
            publish a mess listing.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-[#203126]">{section.title}</h2>
              <div className="mt-3 space-y-3">
                {section.content.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-gray-600 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-sm leading-7 text-gray-600">
            For related information, read our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            ,{" "}
            <Link
              href="/cookie-policy"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              Cookie Policy
            </Link>{" "}
            or{" "}
            <Link
              href="/support"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              contact support
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
