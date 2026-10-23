import MessCardSkeleton from "../../components/mess/MessCardSkeleton";

export default function PublicLoading() {
  return (
    <main className="min-h-screen bg-[#f7fbf8]" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading mess listings…</span>

      <section className="mx-auto max-w-7xl px-4 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-6 lg:px-8">
        {/* Advert banner */}
        <div className="h-[140px] w-full animate-pulse rounded-2xl bg-slate-200/70 sm:h-[170px] lg:h-[200px]" />

        {/* Search panel */}
        <section className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="h-10 w-10 shrink-0 animate-pulse rounded-xl bg-slate-100" />
            <div className="w-full space-y-2">
              <div className="h-4 w-44 max-w-full animate-pulse rounded-full bg-slate-100" />
              <div className="h-3 w-60 max-w-full animate-pulse rounded-full bg-slate-100" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.25fr_1fr_1fr_1fr_auto]">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="space-y-1.5">
                <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
                <div className="h-[46px] w-full animate-pulse rounded-xl bg-slate-100" />
              </div>
            ))}
            <div className="flex items-end">
              <div className="h-[46px] w-full animate-pulse rounded-xl bg-slate-200 sm:w-32" />
            </div>
          </div>
        </section>

        {/* Results heading */}
        <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="h-4 w-40 animate-pulse rounded-full bg-slate-200" />
            <div className="h-3 w-24 animate-pulse rounded-full bg-slate-100" />
          </div>
          <div className="h-11 w-44 animate-pulse rounded-xl bg-slate-100" />
        </div>

        {/* Card grid */}
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <MessCardSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
