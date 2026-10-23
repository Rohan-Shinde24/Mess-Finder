import Link from "next/link";
export default function NotFound() {
  return <div className="container py-20 text-center"><h1 className="text-3xl font-bold">Page not found</h1><p className="muted my-3">This page may have moved or is unavailable.</p><Link className="btn" href="/">Go home</Link></div>;
}
