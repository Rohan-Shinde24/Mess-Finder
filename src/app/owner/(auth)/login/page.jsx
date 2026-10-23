import { Suspense } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Mess Owner Log in to Manage Your Listing",
  description:
    "Log in to your MessFinder owner dashboard to manage your mess listing, update your weekly menu and publish meal plans and prices.",
  robots: { index: false, follow: false },
};

export default function OwnerLoginPage() {
  return (
    <AuthShell variant="owner" mode="login">
      <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
        <LoginForm
          role="owner"
          redirectTo="/owner/dashboard"
          title="Owner log in"
          subtitle="Access your dashboard to manage your mess listing, menu and meal plans."
          successMessage="Owner account created. Log in to set up your listing."
          footer={
            <span>
              Want to list a mess?{" "}
              <Link href="/owner/register" className="font-bold text-green-600 hover:text-green-700">
                Create an owner account
              </Link>
            </span>
          }
        />
      </Suspense>
    </AuthShell>
  );
}
