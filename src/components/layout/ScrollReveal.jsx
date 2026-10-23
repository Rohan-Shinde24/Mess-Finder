"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Reveals every element tagged with `data-reveal` as it scrolls into view.
 * Uses IntersectionObserver only (no scroll listener) so it stays cheap.
 * Optional `data-reveal-delay="120"` staggers the animation.
 */
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!targets.length) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      targets.forEach((element) => element.classList.add("is-revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;

          const element = entry.target;
          const delay = Number(element.dataset.revealDelay || 0);
          if (delay > 0) element.style.transitionDelay = `${delay}ms`;

          element.classList.add("is-revealed");
          observer.unobserve(element);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
