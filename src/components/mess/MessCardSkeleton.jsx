export default function MessCardSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm sm:rounded-3xl"
      aria-hidden="true"
    >
      <div className="h-44 animate-pulse bg-slate-100 sm:h-48" />

      <div className="space-y-3 p-4 sm:p-5">
        <div className="h-5 w-3/4 animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-1/2 animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded-full bg-slate-100" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />

        <div className="flex items-center justify-between pt-2">
          <div className="h-9 w-20 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-11 w-28 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
