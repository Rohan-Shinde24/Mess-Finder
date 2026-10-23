import { NextResponse } from "next/server";
export function ok(data, status = 200) {
  return NextResponse.json({ success: true, ...data }, { status });
}
export function fail(message, status = 400, details) {
  return NextResponse.json({ success: false, message, ...(details ? { details } : {}) }, { status });
}
