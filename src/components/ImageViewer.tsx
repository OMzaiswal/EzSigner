import { useEffect, useRef } from "react";

export const ImageViewer = ({ file }: { file: File }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
    };

    img.src = URL.createObjectURL(file);
  }, [file]);

  return <canvas ref={canvasRef} className="border shadow bg-white" />;
};
