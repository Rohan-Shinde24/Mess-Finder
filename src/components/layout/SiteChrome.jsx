"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";

const BARE_ROUTES = ["/login", "/register", "/owner", "/admin"];

function isBare(pathname) {
  return BARE_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export default function SiteChrome({ children }) {
  const pathname = usePathname() || "/";

  if (isBare(pathname)) return <div className="flex-1">{children}</div>;

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
