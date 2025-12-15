import { useRef, useState } from "react";
import { PdfPageRenderer } from "../components/PdfPageRenderer";
import { ImageViewer } from "../components/ImageViewer";
import { SignerCanvas } from "../components/SignerCanvas";
import { PreviewWithOverlay } from "../components/PreviewWithOverlay";
import { useSignature } from "../context/SignatureContext";
import type { SignaturePlacement } from "../types";
import { Link } from "react-router-dom";

export const DocSigner = () => {
  const [file, setFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Page preview state
  const [currentPage, setCurrentPage] = useState(0);
  const [numPages, setNumPages] = useState(0);

  // Switch betweenPreview and Signing Mode
  const [isSigning, setIsSigning] = useState(false);

  // Canvas page URL + dimensions
  const [pageUrl, setPageUrl] = useState<string | null>(null);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);

  // One signature placement per page index
  const [placements, setPlacements] = useState<
    Record<number, SignaturePlacement>
  >({});

  const { signatureUrl } = useSignature();

  const handleFile = (f: File) => {
    setFile(f);
    setIsSigning(false);
    setPageUrl(null);
    setPlacements({});
    setCurrentPage(0);
  };

  // Page rendered callback (from PDF or Image renderer)
  const handlePageReady = (url: string, width: number, height: number) => {
    setPageUrl(url);
    setPageWidth(width);
    setPageHeight(height);
  };

  // Save signature placement from SignerCanvas
  const handleSavePlacement = (placement: SignaturePlacement) => {
    setPlacements((prev) => ({
      ...prev,
      [currentPage]: placement,
    }));
    setIsSigning(false);
  };

  const handleExport = async () => {
    if (!file || !pageUrl) return;
  
    // --- IMAGE EXPORT ---
    if (file.type.startsWith("image/")) {
      const img = new Image();
      img.src = pageUrl;
  
      await new Promise((res) => (img.onload = res));
  
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = pageWidth;
      exportCanvas.height = pageHeight;
  
      const ctx = exportCanvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
  
      // draw signature if exists
      const placement = placements[currentPage];
      if (placement && signatureUrl) {
        const sig = new Image();
        sig.src = signatureUrl;
        await new Promise((res) => (sig.onload = res));
        ctx.drawImage(sig, placement.x, placement.y, placement.width, placement.height);
      }
  
      const finalUrl = exportCanvas.toDataURL("image/png");
  
      const a = document.createElement("a");
      a.href = finalUrl;
      a.download = "signed_image.png";
      a.click();
  
      return;
    }
  
    // --- PDF EXPORT ---
    if (file.type === "application/pdf") {
      const bytes = await file.arrayBuffer();
      const { PDFDocument } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(bytes);
  
      const sigImageBytes = signatureUrl
        ? await fetch(signatureUrl).then((r) => r.arrayBuffer())
        : null;
  
      let sigPng;
      if (sigImageBytes) {
        sigPng = await pdfDoc.embedPng(sigImageBytes);
      }
  
      for (let i = 0; i < numPages; i++) {
        const placement = placements[i];
        if (!placement || !sigPng) continue;
  
        const page = pdfDoc.getPage(i);
        const { height } = page.getSize();
  
        // Convert HTML coordinates to PDF coordinates
        const pdfX = placement.x;
        const pdfY = height - placement.y - placement.height;
  
        page.drawImage(sigPng, {
          x: pdfX,
          y: pdfY,
          width: placement.width,
          height: placement.height,
        });
      }
  
      const pdfBytes = await pdfDoc.save();
  
      const arrayBuffer = pdfBytes.buffer.slice(
        pdfBytes.byteOffset,
        pdfBytes.byteOffset + pdfBytes.byteLength
      );
      
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement("a");
      a.href = url;
      a.download = "signed_document.pdf";
      a.click();
      
      URL.revokeObjectURL(url);
    }
  };
  

  return (
    <div className="p-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Document Signer</h1>

      {/* Upload Section */}
      <div className="flex justify-around w-full max-w-5xl items-center mb-6">
        <div className="space-x-2">
          <input
            type="file"
            accept="application/pdf, image/png, image/jpeg"
            ref={inputRef}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
            className="border rounded p-2"
          />
          <button
            className="border border-gray-200 rounded-lg p-2 mb-2 hover:bg-red-50 text-red-400 hover:text-red-600"
            onClick={() => {
              setFile(null);
              if(inputRef.current) {
                inputRef.current.value = '';
              }
            }}
          >Remove</button>
        </div>

        <span className="text-blue-600 font-semibold">
          {signatureUrl ? "Signature Loaded" : "No Signature Added"}
        </span>
      </div>

      {/* If nothing uploaded */}
      {!file &&
        <p className="text-gray-700 text-lg">Upload a document to continue.</p>
      }


      {/* Preview Mode */}
      {!isSigning && file && (
        <div className="space-y-4">

          {/* Background PDF page loader (hidden) */}
          {file.type === "application/pdf" && (
            <PdfPageRenderer
              file={file}
              pageIndex={currentPage}
              onPageRendered={handlePageReady}
              onTotalPages={(n) => setNumPages(n)}
            />
          )}

          {/* Background image loader (hidden) */}
          {file.type.startsWith("image/") && (
            <ImageViewer
              file={file}
              onImageReady={handlePageReady}
            />
          )}

          {/* Visible preview with overlays */}
          {pageUrl && (
            <PreviewWithOverlay
              pageUrl={pageUrl}
              pageWidth={pageWidth}
              pageHeight={pageHeight}
              signatureUrl={signatureUrl}
              placement={placements[currentPage]}
            />
          )}

          {/* Pagination */}
          {file.type === "application/pdf" && numPages > 1 && (
            <div className="flex gap-4 justify-center mt-2">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <button
                disabled={currentPage === numPages - 1}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}

          {/* Add Signature */}
          {signatureUrl ? (
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setIsSigning(true)}
            >
              Add Signature
            </button>
          ) : (
            <div>
              <p className="text-red-500 text-lg">You need to Create Signature first, to add on document</p>
              <Link to='/signature' className="text-blue-400 underline">Click here to create</Link>
            </div>
          )}

          {/* Export */}
          {pageUrl && (
            <button
              className="px-4 py-2 bg-green-500 text-white rounded"
              onClick={handleExport}
            >
              Export Signed Document
            </button>
          )}

        </div>
      )}


      {/* Signing Mode */}
      {isSigning && pageUrl && signatureUrl && (
        <SignerCanvas
          pageUrl={pageUrl}
          pageWidth={pageWidth}
          pageHeight={pageHeight}
          signatureUrl={signatureUrl}
          onSave={handleSavePlacement}
          onCancel={() => setIsSigning(false)}
        />
      )}
    </div>
  );
};
