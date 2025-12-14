import type { SignaturePlacement } from "../types";

export async function exportSignedImage(
  file: File,
  placement: SignaturePlacement,
  signatureUrl: string
) {
  const img = new Image();
  img.src = URL.createObjectURL(file);

  const sig = new Image();
  sig.src = signatureUrl;

  await Promise.all([
    new Promise((res) => (img.onload = res)),
    new Promise((res) => (sig.onload = res)),
  ]);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0);
  ctx.drawImage(sig, placement.x, placement.y, placement.width, placement.height);

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "signed_image.png";
  link.click();
}
