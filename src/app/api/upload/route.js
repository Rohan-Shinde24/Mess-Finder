import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";
import { requireOwner } from "@/lib/auth";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;
// Longest edge kept on disk; larger photos are scaled down before saving.
const MAX_DIMENSION = 2000;

const FORMATS = {
  "image/jpeg": { extension: "jpg", encode: (pipeline) => pipeline.jpeg({ quality: 80, mozjpeg: true }) },
  "image/png": { extension: "png", encode: (pipeline) => pipeline.png({ compressionLevel: 9, palette: true, quality: 82 }) },
  "image/webp": { extension: "webp", encode: (pipeline) => pipeline.webp({ quality: 80 }) },
  "image/avif": { extension: "avif", encode: (pipeline) => pipeline.avif({ quality: 55 }) },
  "image/gif": { extension: "gif", encode: (pipeline) => pipeline.gif() },
};

export async function POST(request) {
  try {
    const { response } = await requireOwner();
    if (response) return response;

    const formData = await request.formData();
    const file = formData.get("file");
    if (!file || typeof file === "string") {
      return NextResponse.json({ success: false, message: "Choose an image to upload" }, { status: 400 });
    }

    const format = FORMATS[file.type];
    if (!format) {
      return NextResponse.json(
        { success: false, message: "Only JPG, PNG, WEBP, GIF or AVIF images are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ success: false, message: "Image must be smaller than 5 MB" }, { status: 400 });
    }

    const input = Buffer.from(await file.arrayBuffer());

    let compressed;
    try {
      const pipeline = sharp(input, { animated: file.type === "image/gif" })
        .rotate()
        .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: "inside", withoutEnlargement: true });
      compressed = await format.encode(pipeline).toBuffer();
    } catch {
      return NextResponse.json({ success: false, message: "That image could not be processed" }, { status: 400 });
    }

    const directory = path.join(process.cwd(), "public", "uploads");
    await mkdir(directory, { recursive: true });

    const filename = `${Date.now()}-${randomUUID().slice(0, 8)}.${format.extension}`;
    await writeFile(path.join(directory, filename), compressed);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` }, { status: 201 });
  } catch (error) {
    console.error("Upload failed:", error?.message || error);
    return NextResponse.json({ success: false, message: "Could not upload the image" }, { status: 500 });
  }
}
