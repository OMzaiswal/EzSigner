import { useEffect, useRef } from "react";

export const ImagePageRenderer = ({
  file,
  onRendered,
}: {
  file: File;
  onRendered?: (canvas: HTMLCanvasElement) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      onRendered?.(canvas);
    };
  }, [file]);

  return (
    <canvas ref={canvasRef} className="border rounded shadow bg-white" />
  );
};
