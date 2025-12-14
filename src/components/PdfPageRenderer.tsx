import { useEffect, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

type Props = {
  file: File;
  pageIndex: number;
  onPageRendered?: (canvas: HTMLCanvasElement) => void;
};

export const PdfPageRenderer = ({ file, pageIndex, onPageRendered }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const bytes = await file.arrayBuffer();
      const pdf = await (pdfjsLib as any).getDocument({ data: bytes }).promise;

      const page = await pdf.getPage(pageIndex + 1);

      const viewport = page.getViewport({ scale: 1.4 });

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: ctx, viewport }).promise;

      if (!cancelled && onPageRendered) {
        onPageRendered(canvas);
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
