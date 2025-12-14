import { useState } from "react";
import { useSignature } from "../context/SignatureContext";
import { PdfPageRenderer } from "../components/PdfPageRenderer";
import { ImagePageRenderer } from "../components/ImagePageRenderer";
import { SignerCanvas } from "../components/SignerCanvas";
import { exportSignedPdf } from "../utils/exportPdf";
import { exportSignedImage } from "../utils/exportImage";
import type { SignaturePlacement } from "../types";

export const DocSigner = () => {
  const { signatureUrl } = useSignature();

  const [file, setFile] = useState<File | null>(null);
  const [pageCanvasUrl, setPageCanvasUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(0);

  const [mode, setMode] = useState<"preview" | "sign">("preview");

  const [placements, setPlacements] = useState<
    Record<number, SignaturePlacement>
  >({});

  const handleFileSelect = async (e: any) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setFile(f);
    setCurrentPage(0);
    setPlacements({});
  };

  const handlePageRendered = (canvas: HTMLCanvasElement) => {
    setPageCanvasUrl(canvas.toDataURL("image/png"));
  };

  const handleSavePlacement = (placement: SignaturePlacement) => {
    setPlacements((prev) => ({
      ...prev,
      [currentPage]: placement,
    }));
    setMode("preview");
  };

  const exportDocument = async () => {
    if (!file || !signatureUrl) return;

    if (file.type === "application/pdf") {
      await exportSignedPdf(file, placements, signatureUrl);
    } else {
      const placement = placements[currentPage];
      if (!placement) alert("No signature placement!");
      else await exportSignedImage(file, placement, signatureUrl);
    }
  };

  return (
    <div className="p-8 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold">Document Signer</h1>

      <div className="flex gap-4 items-center">
        <input
          type="file"
          accept="application/pdf, image/*"
          onChange={handleFileSelect}
          className="border p-2 rounded"
        />

        <span className="text-lg">
          {signatureUrl ? "Signature Ready" : "No Signature Yet"}
        </span>
      </div>

      {file && mode === "preview" && (
        <div className="flex flex-col items-center gap-4">
          {file.type === "application/pdf" ? (
            <PdfPageRenderer
              file={file}
              pageIndex={currentPage}
              onPageRendered={handlePageRendered}
            />
          ) : (
            <ImagePageRenderer file={file} onRendered={handlePageRendered} />
          )}

          <div className="flex gap-4 mt-2">
            <button
              disabled={currentPage === 0}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Prev
            </button>

            <button
              onClick={() => {
                if (!signatureUrl) return alert("No signature available!");
                setMode("sign");
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Signature
            </button>

            <button
              onClick={exportDocument}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              Export
            </button>

            <button
              disabled={
                file.type === "application/pdf"
                  ? currentPage === numPages - 1
                  : true
              }
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {file && mode === "sign" && pageCanvasUrl && signatureUrl && (
        <SignerCanvas
          pageUrl={pageCanvasUrl}
          signatureUrl={signatureUrl}
          width={800}
          height={1000}
          onSave={handleSavePlacement}
          onCancel={() => setMode("preview")}
        />
      )}
    </div>
  );
};
