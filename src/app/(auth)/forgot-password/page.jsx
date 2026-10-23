export const metadata = {
  title: "Forgot Your Password? Recover Your Account Access",
  description:
    "Recover access to your MessFinder account. Password reset is handled through a secure, expiring email reset-token flow once it is enabled.",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordPage() {
  return (
    <section className="container max-w-md py-14">
      <div className="card">
        <h1 className="text-2xl font-extrabold">Forgot password</h1>
        <p className="muted mt-3">
          Password recovery needs an email delivery provider and a secure,
          expiring reset-token flow. Configure those before enabling this
          feature in production.
        </p>
        <p className="mt-4 text-sm">
          For now, use the account recovery process configured by your
          administrator.
        </p>
      </div>
    </section>
  );
}
