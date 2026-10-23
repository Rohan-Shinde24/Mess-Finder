import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminLayout({ children }) {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") redirect("/admin/login");
  return <AdminShell>{children}</AdminShell>;
}
