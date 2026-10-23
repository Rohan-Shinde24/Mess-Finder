import sharp from "sharp";
import fs from "fs";

const SRC_ICON = "public/images/logo.jpg";
const SRC_WORDMARK = "public/images/weblogo.png";

fs.mkdirSync("public/icons", { recursive: true });

// ---- Browser favicon + iOS home-screen icon, from the square logo ----
const icon = sharp(SRC_ICON);
await icon.clone().resize(512, 512, { fit: "cover" }).png({ compressionLevel: 9 }).toFile("src/app/icon.png");
await icon.clone().resize(180, 180, { fit: "cover" }).png({ compressionLevel: 9 }).toFile("src/app/apple-icon.png");

// ---- PWA / manifest icons ----
await icon.clone().resize(192, 192, { fit: "cover" }).png({ compressionLevel: 9 }).toFile("public/icons/icon-192.png");
await icon.clone().resize(512, 512, { fit: "cover" }).png({ compressionLevel: 9 }).toFile("public/icons/icon-512.png");

// ---- Social share cover (1200x630) ----
const W = 1200;
const H = 630;

const wordmark = await sharp(SRC_WORDMARK).resize({ width: 620 }).png().toBuffer();
const wm = await sharp(wordmark).metadata();

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#f0fdf4"/>
      <stop offset="55%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#ecfdf5"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect x="0" y="0" width="${W}" height="12" fill="#16a34a"/>
  <circle cx="1105" cy="80" r="155" fill="#dcfce7" opacity="0.75"/>
  <circle cx="95" cy="575" r="185" fill="#d1fae5" opacity="0.6"/>
  <text x="600" y="452" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="600" fill="#334155">Find local mess &amp; tiffin services near you</text>
  <text x="600" y="516" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="25" font-weight="700" fill="#16a34a" letter-spacing="3">MESS \u2022 TIFFIN \u2022 DAILY MEAL PLANS</text>
</svg>`;

await sharp(Buffer.from(svg))
  .composite([{ input: wordmark, left: Math.round((W - wm.width) / 2), top: Math.round(235 - wm.height / 2) }])
  .png({ compressionLevel: 9 })
  .toFile("public/images/og-cover.png");

for (const f of [
  "src/app/icon.png",
  "src/app/apple-icon.png",
  "public/icons/icon-192.png",
  "public/icons/icon-512.png",
  "public/images/og-cover.png",
]) {
  const m = await sharp(f).metadata();
  console.log(`${f}: ${m.width}x${m.height} ${(fs.statSync(f).size / 1024).toFixed(1)}KB`);
}
