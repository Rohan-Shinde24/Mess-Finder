import sharp from "sharp";
import fs from "fs";

for (const f of ["public/images/logo.jpg", "public/images/weblogo.png", "public/images/homescreenbg.png"]) {
  if (!fs.existsSync(f)) {
    console.log(`${f}: MISSING`);
    continue;
  }
  const m = await sharp(f).metadata();
  console.log(
    `${f}: ${m.width}x${m.height} format=${m.format} alpha=${m.hasAlpha} size=${(fs.statSync(f).size / 1024).toFixed(0)}KB`
  );
}
