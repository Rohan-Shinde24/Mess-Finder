
import Link from "next/link";
import {
  Utensils,
  ArrowRight,
  MapPin,
  Heart,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

const exploreLinks = [
  { href: "/", label: "Home" },
  { href: "/list-your-mess", label: "List your mess" },
  { href: "/support", label: "Customer support" },
];

const informationLinks = [
  { href: "/privacy-policy", label: "Privacy policy" },
  { href: "/terms", label: "Terms & conditions" },
  { href: "/cookie-policy", label: "Cookie policy" },
];

const aboutus =[
   { href: "/about", label: "About us" },
]

const linkClass =
  "group inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors duration-200 hover:text-green-600";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      {/* Main footer */}
      <div className="mx-auto max-w-7xl px-5 pb-6 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              aria-label="MessFinder home"
              className="group inline-flex items-center gap-3"
            >
        

              <span className="text-2xl font-black tracking-tight text-slate-950">
                Mess<span className="text-green-600">Finder</span>
              </span>
            </Link>

            <p className="mt-5 max-w-xs text-sm text-slate-500">
              Find food that feels like home. Discover local mess services,
              explore meal plans, and find everyday food options near you.
            </p>
          </div>

          {/* Explore */}
          <nav aria-label="Explore">
            <h2 className="text-sm font-extrabold text-slate-900">
              Explore
            </h2>

            <ul className="mt-5 space-y-1">
              {exploreLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 transition group-hover:text-green-500"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Information */}
          <nav aria-label="Information">
            <h2 className="text-sm font-extrabold text-slate-900">
              Information
            </h2>

            <ul className="mt-5 space-y-3.1">
              {informationLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 transition group-hover:text-green-500"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
             <nav aria-label="about">

            <ul className="mt-5 space-y-1">
              {aboutus.map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className={linkClass}>
                    <ChevronRight
                      size={14}
                      className="text-slate-300 transition group-hover:text-green-500"
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Mess owner CTA */}
         
        </div>

        {/* Trust strip */}
        <div className="mt-10 flex flex-col gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-green-600 shadow-sm">
              <ShieldCheck size={19} />
            </span>

            <div>
              <p className="text-xs font-bold text-slate-800">
                Better food discovery, made simple
              </p>
              <p className="mt-0.5 text-xs leading-5 text-slate-500">
                Explore local food options in one place.
              </p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 self-start text-sm font-bold text-green-700 transition hover:text-green-800 sm:self-center"
          >
            Explore mess listings
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Bottom bar */}
        <div className="mt-7 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-slate-400">
            © {new Date().getFullYear()} MessFinder. All rights reserved.
          </p>

          <p className="inline-flex items-center gap-1.5 text-xs text-slate-400">
            Made with
            <Heart
              size={13}
              className="fill-green-500 text-green-500"
            />
            to make everyday food discovery easier.
          </p>
        </div>
      </div>
    </footer>
  );
}
