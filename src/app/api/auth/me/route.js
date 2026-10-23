import { getCurrentUser } from "@/lib/auth";
import { ok, fail } from "@/lib/api-response";
export async function GET() {
  const user = await getCurrentUser();
  if (!user) return fail("Not authenticated", 401);
  return ok({ user: { id: user._id, name: user.name, email: user.email, role: user.role } });
}
