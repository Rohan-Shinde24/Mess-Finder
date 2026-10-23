
import Link from "next/link";
import { openGraph } from "../../lib/seo";

export const metadata = {
  title: "Privacy Policy: How We Collect and Protect Data",
  description:
    "Read the MessFinder Privacy Policy to learn what information may be collected, how it is used and protected, and the choices available to you.",
  keywords: [
    "messfinder privacy policy",
    "privacy policy",
    "personal data protection",
    "user data policy",
    "account privacy",
    "cookies and data",
    "data usage policy",
    "privacy rights india",
  ],
  alternates: { canonical: "/privacy-policy" },
  openGraph: openGraph({
    title: "Privacy Policy: How We Collect and Protect Data",
    description:
      "Read the MessFinder Privacy Policy to learn what information may be collected, how it is used and protected, and the choices available to you.",
    url: "/privacy-policy",
  }),
};

const sections = [
  {
    title: "1. Information we may collect",
    content: [
      "Depending on the features you use, MessFinder may collect information you provide, such as your name, email address, phone number, account details, profile information, and information submitted when creating or managing a mess listing.",
      "If you contact us, we may retain your message and the contact details needed to respond.",
      "Our systems and hosting providers may also process technical information such as IP address, browser type, device information, access times, and error logs for security and operation.",
    ],
  },
  {
    title: "2. How we use information",
    content: [
      "We may use information to create and manage accounts, display and maintain listings, provide requested features, respond to enquiries, protect the platform, troubleshoot issues, and improve the user experience.",
      "We may also use information where reasonably necessary to comply with applicable legal obligations or address misuse of the service.",
    ],
  },
  {
    title: "3. Public listings and user content",
    content: [
      "Information you submit for a public mess listing or public profile may be visible to other visitors. Do not include private or sensitive information in content intended to be public.",
      "Please review listing details before submitting them and contact us if publicly displayed information needs correction or removal.",
    ],
  },
  {
    title: "4. Sharing of information",
    content: [
      "We do not intend to sell personal information to third parties.",
      "Information may be processed by service providers that help operate the website, such as hosting, database, security, email, or analytics providers, where those services are actually used.",
      "We may also disclose information when required by law, to protect users or the platform, or in connection with a legitimate business transfer where permitted by applicable law.",
    ],
  },
  {
    title: "5. Cookies and similar technologies",
    content: [
      "The website or its service providers may use cookies or similar technologies to support essential functionality, maintain sessions, remember preferences, improve security, or measure website usage if analytics are enabled.",
      "The technologies actually used depend on the features and third-party services enabled on the website. Read our Cookie Policy for more information.",
    ],
  },
  {
    title: "6. Data retention and security",
    content: [
      "We retain information for as long as reasonably necessary to provide the service, maintain legitimate business records, resolve disputes, enforce our terms, or meet legal requirements.",
      "We use reasonable safeguards intended to protect information. However, no website, storage system, or internet transmission can be guaranteed to be completely secure.",
    ],
  },
  {
    title: "7. Your choices and rights",
    content: [
      "Depending on applicable law, you may have rights to request access to, correction of, or deletion of personal information, or to object to or restrict certain processing.",
      "You may also be able to update your account details through available account settings. To submit a privacy request, contact us through the official contact details published on this website.",
      "We may need to verify your identity before acting on a request and may retain certain information where the law permits or requires it.",
    ],
  },
  {
    title: "8. Children's privacy",
    content: [
      "MessFinder is not intended for children to use without appropriate supervision where required by law. We do not knowingly seek to collect children's personal information in violation of applicable law. If you believe a child has provided personal information improperly, contact us.",
    ],
  },
  {
    title: "9. Third-party services and links",
    content: [
      "The website may link to third-party websites or use third-party services. Their privacy practices are governed by their own policies, not this policy. Please review those policies before sharing information with them.",
    ],
  },
  {
    title: "10. Changes to this policy",
    content: [
      "We may update this Privacy Policy when our services, practices, or legal obligations change. The updated version will be published on this page with a revised effective date.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <header className="border-b border-emerald-100 bg-[#f3f7f0]">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-800">
            Legal
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#203126] sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Effective date: October 22, 2026
          </p>
          <p className="mt-5 max-w-2xl leading-7 text-gray-600">
            This policy explains how MessFinder may collect, use, disclose, and
            protect information when you visit or use our website.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <div className="mb-8 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-950">
          This policy describes how MessFinder handles information. Have a question about it? Reach
          us through the support page.
        </div>

        <div className="space-y-9">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-xl font-bold text-[#203126]">
                {section.title}
              </h2>
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
              href="/cookie-policy"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              Cookie Policy
            </Link>{" "}
            or our{" "}
            <Link
              href="/terms"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
