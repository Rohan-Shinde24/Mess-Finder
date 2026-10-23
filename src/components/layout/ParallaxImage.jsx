"use client";

import { useEffect, useRef } from "react";

/**
 * Background image that drifts as the page scrolls, giving the section a
 * slow parallax feel. Transform-only updates driven by requestAnimationFrame,
 * so it stays smooth and never blocks scrolling.
 */
export default function ParallaxImage({
  src,
  speed = 0.26,
  scale = 1.16,
  className = "",
  style,
  priority = false,
}) {
  const imageRef = useRef(null);

  useEffect(() => {
    const node = imageRef.current;
    if (!node) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.style.transform = `scale(${scale})`;
      return;
    }

    let frame = 0;

    const paint = () => {
      frame = 0;
      const travelled = Math.min(window.scrollY, window.innerHeight);
      const offset = (travelled * speed).toFixed(1);
      node.style.transform = `translate3d(0, ${offset}px, 0) scale(${scale})`;
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [speed, scale]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={imageRef}
      src={src}
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={`parallax-layer ${className}`}
      style={style}
    />
  );
}
