export default function MessDetailsLoading() {
  return (
    <div className="container py-10" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading mess details…</span>

      <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          {/* Photo gallery */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-56 w-full animate-pulse rounded-2xl bg-slate-200 sm:col-span-2 sm:h-72" />
            <div className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />
            <div className="h-40 w-full animate-pulse rounded-2xl bg-slate-100" />
          </div>

          {/* Badges */}
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
            <div className="h-7 w-32 animate-pulse rounded-full bg-slate-100" />
          </div>

          {/* Title + location */}
          <div className="mt-4 h-9 w-3/4 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-slate-100" />
          <div className="mt-4 h-6 w-32 animate-pulse rounded-full bg-slate-100" />

          {/* Description */}
          <div className="mt-5 space-y-3">
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
            <div className="h-4 w-4/5 animate-pulse rounded-full bg-slate-100" />
          </div>

          {/* Meal plans */}
          <div className="mt-12">
            <div className="h-7 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="h-5 w-1/2 animate-pulse rounded-full bg-slate-100" />
                  <div className="mt-3 h-7 w-24 animate-pulse rounded-full bg-slate-100" />
                  <div className="mt-3 h-4 w-20 animate-pulse rounded-full bg-slate-100" />
                  <div className="mt-3 h-4 w-full animate-pulse rounded-full bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aside */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-3 h-10 w-32 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-3 h-4 w-32 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-5 grid gap-3">
              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
              <div className="h-11 w-full animate-pulse rounded-xl bg-slate-100" />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
