import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata = {
  title: "Register Your Mess and Start Listing It Today",
  description:
    "Create a MessFinder owner account to list your mess, add your weekly menu and meal plans, and reach people searching for food nearby.",
  robots: { index: false, follow: false },
};

export default function OwnerRegisterPage() {
  return (
    <AuthShell variant="owner" mode="register">
      <RegisterForm
        role="owner"
        redirectHref="/owner/login?registered=1"
        title="Register your mess"
        subtitle="Create an owner account to list your mess, publish your menu and manage meal plans."
        nameLabel="Your name"
        submitLabel="Create owner account"
      />

      <p className="mt-5 text-center text-sm text-slate-600">
        Already listing with us?{" "}
        <Link href="/owner/login" className="font-bold text-green-600 hover:text-green-700">
          Log in
        </Link>
      </p>

      <p className="mt-3 text-center text-sm text-slate-500">
        Just here to eat?{" "}
        <Link href="/register" className="font-semibold text-slate-700 hover:text-green-600">
          Create a customer account
        </Link>
      </p>
    </AuthShell>
  );
}
