import { useEffect, useRef } from "react";
import type { SignaturePlacement } from "../types";

type Props = {
  pageUrl: string;
  pageWidth: number;
  pageHeight: number;
  signatureUrl: string | null;
  placement?: SignaturePlacement; // placement for this page
};

export const PreviewWithOverlay = ({
  pageUrl,
  pageWidth,
  pageHeight,
  signatureUrl,
  placement,
}: Props) => {
  const overlayRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!placement || !signatureUrl) return;

    const canvas = overlayRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = pageWidth;
    canvas.height = pageHeight;

    ctx.clearRect(0, 0, pageWidth, pageHeight);

    const img = new Image();
    img.src = signatureUrl;

    img.onload = () => {
      ctx.drawImage(img, placement.x, placement.y, placement.width, placement.height);
    };
  }, [placement, signatureUrl, pageWidth, pageHeight]);

  return (
    <div className="relative inline-block">
      {/* Underlying PDF/image page */}
      <img src={pageUrl} width={pageWidth} height={pageHeight} />

      {/* Overlay canvas */}
      <canvas
        ref={overlayRef}
        className="absolute top-0 left-0 pointer-events-none"
      />
    </div>
  );
};
