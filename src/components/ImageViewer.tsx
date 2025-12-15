import { useEffect, useRef } from "react";

export const ImageViewer = ({
  file,
  onImageReady,
}: {
  file: File;
  onImageReady: (url: string, width: number, height: number) => void;
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const url = canvas.toDataURL("image/png");
      onImageReady(url, img.width, img.height);
    };

    img.src = URL.createObjectURL(file);
  }, [file]);

  return <canvas ref={canvasRef} className="border shadow bg-white" />;
};
