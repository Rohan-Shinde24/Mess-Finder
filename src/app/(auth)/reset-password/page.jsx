export const metadata = {
  title: "Reset Your Password to Secure Your Account",
  description:
    "Choose a new password for your MessFinder account. Password resets are only accepted through a verified, expiring reset-token link.",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return (
    <section className="container max-w-md py-14">
      <div className="card">
        <h1 className="text-2xl font-extrabold">Reset password</h1>
        <p className="muted mt-3">
          This page becomes active after the secure email reset-token flow is
          configured. Do not accept password resets from an unverified URL
          parameter.
        </p>
      </div>
    </section>
  );
}
