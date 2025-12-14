import { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?url";

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfjsWorker;

type Props = {
    file: File;
    onCanvasReady?: (pageIndex: number, canvas: HTMLCanvasElement) => void;
  };
  

export const PdfViewer = ({ file, onCanvasReady }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [pdf, setPdf] = useState<any>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    if (!file) return;

    (async () => {
      const bytes = await file.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: bytes });
      const pdfDoc = await loadingTask.promise;

      setPdf(pdfDoc);
      setNumPages(pdfDoc.numPages);
      setPageNumber(1);
    })();
  }, [file]);

  useEffect(() => {
    if (!pdf) return;

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ 
        scale: 1.4,
        rotation: page.rotate ?? 0,
    });

      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      await page.render({ canvasContext: ctx, viewport }).promise;

      onCanvasReady?.(pageNumber - 1, canvas);
    };

    renderPage();
  }, [pdf, pageNumber]);

  const goNext = () => {
    if (pageNumber < numPages) setPageNumber(pageNumber + 1);
  };

  const goPrev = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };

  return (
    <div className="space-y-4">

      <canvas ref={canvasRef} className="border shadow bg-white" />

      <div className="flex items-center justify-center gap-6">
        
        <button 
          onClick={goPrev}
          disabled={pageNumber === 1}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
        >
          Prev
        </button>

        <span>
          Page <b>{pageNumber}</b> of <b>{numPages}</b>
        </span>

        <button 
          onClick={goNext}
          disabled={pageNumber === numPages}
          className="px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-40"
        >
          Next
        </button>

      </div>

    </div>
  );
};
