import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function OwnerDashboardLayout({ children }) {
  const user = await getCurrentUser();
  if (!user) redirect("/owner/login");
  if (user.role !== "owner" && user.role !== "admin") redirect("/owner/login");
  return children;
}
