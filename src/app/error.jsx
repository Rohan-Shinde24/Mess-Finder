"use client";
export default function ErrorPage({ reset }) {
  return (
    <div className="container py-16 text-center">
      <h2 className="text-2xl font-bold">Something went wrong</h2>
      <p className="muted my-3">Please try again.</p>
      <button className="btn" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
