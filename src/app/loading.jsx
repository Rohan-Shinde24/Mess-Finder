export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-5 py-16"
      aria-busy="true"
      aria-live="polite"
    >
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-green-700" />
      <p className="text-sm font-medium text-slate-500">Loading MessFinder…</p>
    </div>
  );
}
