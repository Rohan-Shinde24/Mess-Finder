import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { loginSchema } from "@/lib/validators/auth";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";
import { createToken, setAuthCookie } from "@/lib/auth";

const roleMismatch = {
  admin: "This account does not have administrator access.",
  owner: "This account is not registered as a mess owner.",
  user: "This is a mess owner account. Please use the owner login.",
};

async function loginEnvAdmin(email, password) {
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (!adminEmail || !adminPassword) return null;
  if (email !== adminEmail || password !== adminPassword) return null;

  let admin = await User.findOne({ email: adminEmail }).select("+password");
  if (!admin) {
    await User.create({
      name: "Administrator",
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 12),
      role: "admin",
    });
    admin = await User.findOne({ email: adminEmail }).select("+password");
  } else if (admin.role !== "admin" || admin.status !== "active" || admin.isDeleted) {
    admin.role = "admin";
    admin.status = "active";
    admin.isDeleted = false;
    admin.banUntil = null;
    admin.banReason = "";
    await admin.save();
  }

  const token = await createToken(admin);
  await setAuthCookie(token);
  return ok({
    message: "Login successful",
    user: { id: String(admin._id), name: admin.name, email: admin.email, role: admin.role },
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { error, value } = loginSchema.validate(body, { abortEarly: true, stripUnknown: true });
    if (error) return fail("Enter a valid email and password", 400);
    await connectDB();
    const email = value.email.toLowerCase().trim();

    if (value.role === "admin") {
      const envLogin = await loginEnvAdmin(email, value.password);
      if (envLogin) return envLogin;
    }

    const user = await User.findOne({ email, isDeleted: false }).select("+password");
    if (!user || !(await bcrypt.compare(value.password, user.password))) return fail("Invalid email or password", 401);
    if (value.role && user.role !== value.role) return fail(roleMismatch[value.role], 403);
    if (user.status !== "active" || (user.banUntil && user.banUntil > new Date())) return fail("This account is currently suspended", 403);
    const token = await createToken(user);
    await setAuthCookie(token);
    return ok({ message: "Login successful", user: { id: String(user._id), name: user.name, email: user.email, role: user.role } });
  } catch (error) { return handleError(error); }
}
