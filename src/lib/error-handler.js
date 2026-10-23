import { fail } from "@/lib/api-response";
export function handleError(error) {
  console.error("API error:", error?.message || error);
  if (error?.isJoi) return fail(error.details?.[0]?.message || "Invalid input", 400);
  if (error?.code === 11000) return fail("A record with this value already exists", 409);
  if (error?.name === "ValidationError") return fail("Validation failed", 400);
  return fail("An unexpected server error occurred", 500);
}
