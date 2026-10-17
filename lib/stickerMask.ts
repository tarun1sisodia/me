let mw = 0;
let mh = 0;
let mdata: Uint8ClampedArray | null = null;
let ready = false;

function build() {
  const img = new Image();
  img.src = "/photos/sticker-tarun.png";
  img.onload = () => {
    const W = 120;
    const H = Math.max(1, Math.round((W * img.naturalHeight) / img.naturalWidth));
    const c = document.createElement("canvas");
    c.width = W;
    c.height = H;
    const g = c.getContext("2d", { willReadFrequently: true });
    if (!g) return;
    g.drawImage(img, 0, 0, W, H);
    const SW = 30;
    const SH = Math.max(1, Math.round((SW * H) / W));
    const sc = document.createElement("canvas");
    sc.width = SW;
    sc.height = SH;
    const sg = sc.getContext("2d");
    if (!sg) return;
    sg.drawImage(c, 0, 0, SW, SH);
    g.clearRect(0, 0, W, H);
    g.imageSmoothingEnabled = true;
    g.drawImage(sc, 0, 0, W, H);
    const d = g.getImageData(0, 0, W, H);
    mw = W;
    mh = H;
    mdata = d.data;
    ready = true;
  };
}

if (typeof window !== "undefined") build();

export function maskReady() {
  return ready;
}

export function solidAt(u: number, v: number) {
  if (!mdata) return false;
  const dx = (u - 0.5) / 0.72;
  const dy = (v - 0.44) / 0.68;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const feather = dist <= 0.52 ? 1 : dist >= 0.79 ? 0 : (0.79 - dist) / 0.27;
  if (feather < 0.5) return false;
  const x = Math.max(0, Math.min(mw - 1, Math.round(u * (mw - 1))));
  const y = Math.max(0, Math.min(mh - 1, Math.round(v * (mh - 1))));
  return mdata[(y * mw + x) * 4 + 3] > 40;
}
