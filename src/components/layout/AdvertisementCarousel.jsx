
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const SLOT_COUNT = 4;
const AUTOPLAY_MS = 5000;

export function PlaceholderSlide() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-green-50 via-white to-amber-50 px-3">
      <Link href="/advertise" className="text-center">
        <p className="text-sm font-bold text-slate-800 sm:text-base">
          Advertise Your Business Here
        </p>
        <p className="mt-1 text-xs text-slate-500">
          Promote your mess for just ₹500
        </p>
        <span className="mt-2 inline-flex rounded-full bg-green-700 px-3 py-1 text-xs font-semibold text-white">
          Click to Contact →
        </span>
      </Link>
    </div>
  );
}

function AdSkeleton() {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center overflow-hidden bg-slate-100"
      aria-hidden="true"
    >
      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-100 via-slate-50 to-slate-100" />
      <span className="relative text-xs font-medium text-slate-400">
        Loading sponsored slots…
      </span>
    </div>
  );
}

function AdSlide({ ad, active }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (!ad.imageUrl || error) return <PlaceholderSlide />;

  const external =
    typeof ad.destinationUrl === "string" &&
    /^https?:\/\//i.test(ad.destinationUrl);

  const imageContent = (
    <>
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
          <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-green-700" />
        </div>
      )}

      <img
        src={ad.imageUrl}
        alt={ad.title || "Sponsored advertisement"}
        loading={active ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`h-full w-full object-cover transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {loaded && (
        <span className="absolute right-2 top-2 rounded bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600">
          Sponsored
        </span>
      )}
    </>
  );

  const className = "relative block h-full w-full overflow-hidden bg-white";

  return external ? (
    <a
      href={ad.destinationUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ad.title || "Sponsored advertisement"}
      className={className}
    >
      {imageContent}
    </a>
  ) : (
    <Link
      href={ad.destinationUrl || "/advertise"}
      aria-label={ad.title || "Sponsored advertisement"}
      className={className}
    >
      {imageContent}
    </Link>
  );
}

export default function AdvertisementCarousel({ initialAds = null }) {
  // When the server already sent the ads, even an empty list is final — no refetch.
  const seeded = Array.isArray(initialAds);
  const seed = seeded ? initialAds : [];

  const [ads, setAds] = useState(seed);
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(!seeded);
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    if (seeded) return;

    const controller = new AbortController();

    async function fetchAds() {
      try {
        const response = await fetch("/api/ads", {
          signal: controller.signal,
        });

        if (!response.ok) throw new Error("Failed to load ads");

        const data = await response.json();

        if (data?.success && Array.isArray(data.ads)) {
          setAds(data.ads);
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          console.error("Failed to load advertisements:", error);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchAds();
    return () => controller.abort();
  }, [seeded]);

  const slides = useMemo(() => {
    const slots = new Map();

    for (const ad of ads) {
      const slot = Number(ad?.slot);

      if (
        Number.isInteger(slot) &&
        slot >= 1 &&
        slot <= SLOT_COUNT &&
        !slots.has(slot) &&
        ad.imageUrl
      ) {
        slots.set(slot, ad);
      }
    }

    return Array.from(
      { length: SLOT_COUNT },
      (_, index) => slots.get(index + 1) || null
    );
  }, [ads]);

  useEffect(() => {
    if (loading || !slides.some(Boolean)) return;

    const timer = setInterval(() => {
      setActive((index) => (index + 1) % SLOT_COUNT);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [loading, slides]);

  // Observe the banner's original position, not the fixed banner.
  useEffect(() => {
    const marker = document.getElementById("ad-sticky-marker");
    if (!marker) return;

    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);

      frame = requestAnimationFrame(() => {
        const markerTop = marker.getBoundingClientRect().top;
        setSticky(markerTop <= 72);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      {/* This marker preserves the original banner position. */}
      <div
        id="ad-sticky-marker"
        className="pointer-events-none absolute h-px w-px"
        aria-hidden="true"
      />

      {/* Reserved space prevents page content from jumping. */}
      <div className="relative h-[140px] w-full overflow-hidden rounded-2xl sm:h-[170px] lg:h-[200px]">
        <section aria-label="Advertisements" aria-busy={loading}>
          {loading && <AdSkeleton />}

          <div
            className={`flex h-full transition-transform duration-500 ease-in-out ${
              loading ? "invisible" : "visible"
            }`}
            style={{
              transform: `translateX(-${active * 100}%)`,
            }}
          >
            {slides.map((ad, index) => (
              <div
                key={index}
                className="h-full w-full shrink-0 basis-full"
              >
                {ad ? (
                  <AdSlide ad={ad} active={index === active} />
                ) : (
                  <PlaceholderSlide />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
