
import Link from "next/link";
import { openGraph } from "../../lib/seo";

export const metadata = {
  title: "Cookie Policy: How We Use Cookies and Storage",
  description:
    "Understand how MessFinder may use cookies, local storage and similar technologies, and how you can manage them through your browser settings.",
  keywords: [
    "messfinder cookie policy",
    "cookie policy",
    "website cookies",
    "browser cookies",
    "cookie consent",
    "local storage",
    "tracking technologies",
    "manage cookies",
  ],
  alternates: { canonical: "/cookie-policy" },
  openGraph: openGraph({
    title: "Cookie Policy: How We Use Cookies and Storage",
    description:
      "Understand how MessFinder may use cookies, local storage and similar technologies, and how you can manage them through your browser settings.",
    url: "/cookie-policy",
  }),
};

const cookieTypes = [
  {
    title: "Essential cookies and storage",
    label: "Core functionality",
    description:
      "These technologies may be needed for features such as account sessions, authentication, security, and remembering necessary application state. Disabling them may affect some features.",
  },
  {
    title: "Preference cookies",
    label: "Convenience",
    description:
      "If implemented, these technologies can remember choices such as language or other display preferences so you do not need to select them repeatedly.",
  },
  {
    title: "Analytics cookies",
    label: "Usage insights",
    description:
      "If analytics tools are enabled, they may collect information about page visits, navigation, and website performance to help us understand and improve the service.",
  },
  {
    title: "Advertising cookies",
    label: "Advertising",
    description:
      "If advertising services are enabled, they or their partners may use cookies or similar technologies to measure advertisements or personalize advertising, subject to applicable law and your choices.",
  },
];

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800">
      <header className="border-b border-emerald-100 bg-[#f3f7f0]">
        <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
          <p className="text-sm font-bold uppercase tracking-wider text-emerald-800">
            Website preferences
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-[#203126] sm:text-5xl">
            Cookie Policy
          </h1>
          <p className="mt-4 text-sm text-gray-600">
            Effective date: October 22, 2026
          </p>
          <p className="mt-5 max-w-2xl leading-7 text-gray-600">
            This page explains what cookies and similar technologies are, how
            they may be used on MessFinder, and the choices available to you.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <section>
          <h2 className="text-2xl font-bold text-[#203126]">
            What are cookies?
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
            Cookies are small text files that websites may store in your
            browser. Similar technologies, including local storage and session
            storage, can also store information on your device. They can help
            websites operate, remember preferences, improve security, and
            understand how people use a service.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#203126]">
            Types of cookies and technologies
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-600">
            The categories below describe technologies that may be used
            depending on the features enabled on the website. They are not a
            claim that every category is currently active.
          </p>

          <div className="mt-6 space-y-4">
            {cookieTypes.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-gray-200 p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-bold text-[#203126]">
                    {item.title}
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-900">
                    {item.label}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-7 text-gray-600">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#203126]">
            How to manage cookies
          </h2>
          <div className="mt-3 space-y-3 text-sm leading-7 text-gray-600 sm:text-base">
            <p>
              Most browsers allow you to view, delete, block, or restrict
              cookies through their privacy or security settings. The exact
              steps depend on your browser.
            </p>
            <p>
              Blocking all cookies may affect login sessions and other
              website functionality. Where required, non-essential cookies
              should only be activated in accordance with applicable consent
              requirements and your preferences.
            </p>
            <p>
              If a cookie preference or consent control is provided on
              MessFinder, you can use it to manage the options it supports.
              Browser settings alone may not control every form of tracking
              used by third-party services.
            </p>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#203126]">
            Third-party technologies
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
            Hosting providers, analytics services, embedded content, or
            advertising partners may use their own technologies if integrated
            into the website. Their use of information is governed by their
            respective policies and any applicable consent choices.
          </p>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-bold text-[#203126]">
            Updates and contact
          </h2>
          <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
            We may update this policy as the website changes. The current
            version will be available on this page. For more information
            about personal information, please read our{" "}
            <Link
              href="/privacy-policy"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              Privacy Policy
            </Link>
            , our{" "}
            <Link
              href="/terms"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              Terms &amp; Conditions
            </Link>
            , or you can learn more{" "}
            <Link
              href="/about"
              className="font-semibold text-emerald-800 underline underline-offset-4"
            >
              about MessFinder
            </Link>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
