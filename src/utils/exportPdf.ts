import { PDFDocument } from "pdf-lib";
import type { SignaturePlacement } from "../types";

export async function exportSignedPdf(
  file: File,
  placements: Record<number, SignaturePlacement>,
  signatureUrl: string
) {
  const pdfBytes = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();

  const sigBytes = await fetch(signatureUrl).then((r) => r.arrayBuffer());
  const pngImage = await pdfDoc.embedPng(sigBytes);

  for (const pageIndex in placements) {
    const place = placements[pageIndex];
    const page = pages[Number(pageIndex)];

    page.drawImage(pngImage, {
      x: place.x,
      y: page.getHeight() - place.y - place.height,
      width: place.width,
      height: place.height,
    });
  }

  const finalBytes = await pdfDoc.save();
  const blob = new Blob([finalBytes], { type: "application/pdf" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "signed_document.pdf";
  link.click();
}
