import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { registerSchema } from "@/lib/validators/auth";
import { ok, fail } from "@/lib/api-response";
import { handleError } from "@/lib/error-handler";

export async function POST(request) {
  try {
    const body = await request.json();
    const { error, value } = registerSchema.validate(body, { abortEarly: true, stripUnknown: true });
    if (error) return fail(error.details[0].message, 400);
    await connectDB();
    const email = value.email.toLowerCase().trim();
    const exists = await User.findOne({ email });
    if (exists) return fail("An account with this email already exists", 409);
    const password = await bcrypt.hash(value.password, 12);
    const user = await User.create({ name: value.name, email, password, role: value.role });
    return ok({ message: "Registration successful. You can now log in.", user: { id: String(user._id), name: user.name, email: user.email, role: user.role } }, 201);
  } catch (error) { return handleError(error); }
}
