import mongoose from "mongoose";

const URI = process.env.MONGODB_URI;
if (!URI) throw new Error("Missing MONGODB_URI in .env.local");

let cached = globalThis.mongooseCache;
if (!cached) cached = globalThis.mongooseCache = { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(URI, { bufferCommands: false }).then((m) => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
