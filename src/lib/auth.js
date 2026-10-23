import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import User from "@/models/User";
import connectDB from "@/lib/mongodb";

const COOKIE_NAME = "messfinder_token";
function secret() {
  const value = process.env.JWT_SECRET;
  if (!value || value.length < 32) throw new Error("JWT_SECRET must be at least 32 characters");
  return new TextEncoder().encode(value);
}

export async function createToken(user) {
  return new SignJWT({ sub: String(user._id), role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
}

export async function setAuthCookie(token) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true, secure: process.env.NODE_ENV === "production",
    sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAuthCookie() {
  const jar = await cookies();
  jar.set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function getCurrentUser() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    await connectDB();
    const user = await User.findById(payload.sub).select("-password").lean();
    if (!user || user.isDeleted || user.status !== "active") return null;
    if (user.banUntil && new Date(user.banUntil) > new Date()) return null;
    return { ...user, _id: String(user._id) };
  } catch {
    return null;
  }
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) return { user: null, response: (await import("@/lib/api-response")).fail("Authentication required", 401) };
  return { user, response: null };
}

export async function requireOwner() {
  const result = await requireUser();
  if (result.response) return result;
  if (result.user.role !== "owner" && result.user.role !== "admin") {
    const { fail } = await import("@/lib/api-response");
    return { user: null, response: fail("Mess owner access required", 403) };
  }
  return result;
}

export async function requireAdmin() {
  const result = await requireUser();
  if (result.response) return result;
  if (result.user.role !== "admin") {
    const { fail } = await import("@/lib/api-response");
    return { user: null, response: fail("Administrator access required", 403) };
  }
  return result;
}
