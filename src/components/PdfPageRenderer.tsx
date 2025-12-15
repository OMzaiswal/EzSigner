import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

type Props = {
  file: File;
  pageIndex: number;
  onPageRendered?: (url: string, width: number, height: number) => void;
  onTotalPages?: (n: number) => void;
};

export const PdfPageRenderer = ({
  file,
  pageIndex,
  onPageRendered,
  onTotalPages,
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const bytes = await file.arrayBuffer();
      const pdf = await (pdfjsLib as any).getDocument({ 
        data: bytes,
        disableAutoRotate: true 
      }).promise;

      if (onTotalPages) onTotalPages(pdf.numPages);

      const page = await pdf.getPage(pageIndex + 1);

      // 🔥 REAL FIX: Use internal PDF metadata too.
      const autoRotate = page.rotate || 0;
      const metaRotate = page._pageInfo?.rotate || 0;

      const rotation = autoRotate + metaRotate;

      const viewport = page.getViewport({
        scale: 1.5, // You can change scaling freely
        rotation,
      });

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      if (!cancelled && onPageRendered) {
        const dataUrl = canvas.toDataURL("image/png");
        onPageRendered(dataUrl, viewport.width, viewport.height);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [file, pageIndex]);

  return (
    <canvas
      ref={canvasRef}
      className="border rounded shadow max-w-full bg-white"
    />
  );
};
