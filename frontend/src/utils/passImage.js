// Draws the boarding pass on a <canvas> and downloads it as a PNG.
// No library: the drawing follows the same layout as the pass on the page,
// with the colours of the theme that is on (light or dark).

const W = 900; // size in CSS pixels; the image is drawn twice as big, so it stays sharp
const H = 360;
const STUB = 690; // where the line of holes is

function theme() {
  const css = getComputedStyle(document.documentElement);
  const get = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  return {
    paper: get("--paper", "#f4f0e7"),
    band: get("--cover", "#4a1c26"),
    bandText: get("--foil-text", "#e6cf9f"),
    title: get("--title-ink", "#5a1f2b"),
    ink: get("--ink", "#2b1814"),
    soft: get("--ink-soft", "#6b5a50"),
    faint: get("--text-faint", "#9b8b7e"),
    rule: get("--rule", "rgba(90,31,43,0.18)")
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// text cut with "…" so it fits in the given width
function fit(ctx, text, width) {
  if (ctx.measureText(text).width <= width) return text;
  let cut = text;
  while (cut.length > 1 && ctx.measureText(cut + "…").width > width) cut = cut.slice(0, -1);
  return cut + "…";
}

function field(ctx, c, x, y, label, value, width = 150) {
  ctx.fillStyle = c.faint;
  ctx.font = "700 10px Manrope, sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillText(label.toUpperCase(), x, y);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = c.ink;
  ctx.font = "800 15px Manrope, sans-serif";
  ctx.fillText(fit(ctx, value, width), x, y + 20);
}

// pass: everything printed on the ticket (see BoardingPass.jsx);
// pass.labels: the names of the fields in the chosen language (t.pass.fields + heading)
export async function downloadPassImage(pass) {
  // wait for the two fonts of the app, or the canvas would use the default ones
  await Promise.all([
    document.fonts.load('700 52px "Cormorant Garamond"'),
    document.fonts.load("800 15px Manrope")
  ]).catch(() => {});

  const c = theme();
  const label = pass.labels;
  const canvas = document.createElement("canvas");
  canvas.width = W * 2;
  canvas.height = H * 2;
  const ctx = canvas.getContext("2d");
  ctx.scale(2, 2);

  // the paper, with the two half circles cut out at the line of holes
  roundRect(ctx, 0, 0, W, H, 16);
  ctx.fillStyle = c.paper;
  ctx.fill();
  ctx.save();
  ctx.globalCompositeOperation = "destination-out";
  for (const y of [0, H]) {
    ctx.beginPath();
    ctx.arc(STUB, y, 14, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // the coloured band
  ctx.save();
  roundRect(ctx, 0, 0, W, H, 16);
  ctx.clip();
  ctx.fillStyle = c.band;
  ctx.fillRect(0, 0, STUB - 14, 46);
  ctx.restore();
  ctx.fillStyle = c.bandText;
  ctx.font = "800 12px Manrope, sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillText(label.heading.toUpperCase(), 30, 28);
  ctx.letterSpacing = "0px";
  ctx.font = '700 18px "Cormorant Garamond", serif';
  ctx.textAlign = "right";
  ctx.fillText("Passport Air", STUB - 34, 29);
  ctx.textAlign = "left";

  // OTP ---- plane ---- LIS
  ctx.fillStyle = c.title;
  ctx.font = '700 54px "Cormorant Garamond", serif';
  ctx.fillText(pass.fromCode, 30, 116);
  ctx.textAlign = "right";
  ctx.fillText(pass.toCode, STUB - 34, 116);
  ctx.textAlign = "left";
  ctx.fillStyle = c.soft;
  ctx.font = "600 13px Manrope, sans-serif";
  ctx.fillText(pass.fromCity, 32, 138);
  ctx.textAlign = "right";
  ctx.fillText(pass.toCity, STUB - 34, 138);
  ctx.font = "italic 500 13px Manrope, sans-serif";
  ctx.fillText(fit(ctx, pass.then, 400), STUB - 34, 162);
  ctx.textAlign = "left";

  ctx.strokeStyle = c.soft;
  ctx.setLineDash([2, 4]);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(170, 98);
  ctx.lineTo(STUB - 170, 98);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = c.paper;
  ctx.fillRect((STUB - 14) / 2 - 18, 84, 36, 28);
  ctx.fillStyle = c.title;
  ctx.font = "26px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("✈", (STUB - 14) / 2, 108);
  ctx.textAlign = "left";

  // the fields
  ctx.fillStyle = c.rule;
  ctx.fillRect(30, 180, STUB - 64, 1);
  const cols = [30, 186, 342, 498];
  field(ctx, c, cols[0], 206, label.passenger, pass.name);
  field(ctx, c, cols[1], 206, label.flight, pass.flight);
  field(ctx, c, cols[2], 206, label.date, pass.date);
  field(ctx, c, cols[3], 206, label.boarding, pass.boarding);
  field(ctx, c, cols[0], 252, label.gate, pass.gate);
  field(ctx, c, cols[1], 252, label.seat, pass.seat);
  field(ctx, c, cols[2], 252, label.class, pass.travelClass);
  field(ctx, c, cols[3], 252, label.trip, pass.trip);

  if (pass.why) {
    ctx.fillStyle = c.soft;
    ctx.font = 'italic 600 18px "Cormorant Garamond", serif';
    ctx.fillText(fit(ctx, pass.why, STUB - 64), 30, 322);
  }

  // the stub
  ctx.strokeStyle = c.rule;
  ctx.setLineDash([6, 5]);
  ctx.beginPath();
  ctx.moveTo(STUB, 18);
  ctx.lineTo(STUB, H - 18);
  ctx.stroke();
  ctx.setLineDash([]);
  const sx = STUB + 24;
  ctx.fillStyle = c.ink;
  ctx.font = "800 13px Manrope, sans-serif";
  ctx.fillText(fit(ctx, pass.name, W - sx - 20), sx, 64);
  ctx.fillStyle = c.title;
  ctx.font = '700 28px "Cormorant Garamond", serif';
  ctx.fillText(`${pass.fromCode} › ${pass.toCode}`, sx, 100);
  field(ctx, c, sx, 136, label.seat, pass.seat, 70);
  field(ctx, c, sx + 86, 136, label.gate, pass.gate, 70);

  // the barcode
  const total = pass.bars.reduce((sum, w) => sum + w + 1, 0);
  const scale = (W - sx - 22) / total;
  let x = sx;
  ctx.fillStyle = c.ink;
  for (const width of pass.bars) {
    ctx.fillRect(x, 228, width * scale, 92);
    x += (width + 1) * scale;
  }

  // save it
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `boarding-pass-${pass.fromCode}-${pass.toCode}.png`.toLowerCase();
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
