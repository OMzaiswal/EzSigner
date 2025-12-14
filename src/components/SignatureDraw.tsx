import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import { DwonloadOptions } from "./DownloadOptions";


export const SignatureDraw = () => {

    const sigRef = useRef<any>(null);
    const [drawUrl, setDrawUrl] = useState<string | null>(null);

    const clear = () => {
        sigRef.current.clear();
        setDrawUrl(null);
    }

    const preview = () => {
        if (sigRef.current.isEmpty()) {
            alert('Please draw something first');
            return;
        }
        const rawCanvas = sigRef.current.getCanvas();
        console.log(rawCanvas)
        const url = rawCanvas.toDataURL('image/png');

        setDrawUrl(url);
    }

    const downloadSignature = (
        format: 'jpg' | 'png',
        width: number,
        height: number
    ) => {
        if (!drawUrl) {
            alert('Please review image first');
            return;
        }
        const img = new Image;
        img.src = drawUrl;

        img.onload = () => {
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = width;
            exportCanvas.height = height;

            const ctx = exportCanvas.getContext('2d')!;
            
            if (format === 'jpg') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height)
            }

            ctx.drawImage(img, 0, 0, width, height);
            const url = exportCanvas.toDataURL(`image/${format}`);

            const link = document.createElement('a');
            link.href = url;
            const time = Date.now();
            link.download = `signature_${width}x${height}_${time}.${format}`;
            link.click();
        }
    }

    return (
        <div className="space-y-4">
            <SignatureCanvas 
                ref={sigRef}
                penColor="black"
                canvasProps={{
                    width: 800,
                    height: 300,
                    className: 'rounded bg-white shadow'
                }}
            />
            <div className="space-x-4">
                <button
                    className="border border-gray-300 text-lg rounded-lg px-4 py-2 bg-red-100 text-red-500 hover:bg-red-400 hover:text-white"
                    onClick={clear}
                >
                    Clear
                </button>
                <button
                    className="border border-gray-300 text-lg rounded-lg px-4 py-2 bg-green-100 text-green-600 hover:bg-green-400 hover:text-white"
                    onClick={preview}
                >
                    Preview
                </button>
            </div>
            {drawUrl && (
               <div>
                    <img
                    src={drawUrl}
                    alt="Drawn Signature"
                    className="max-h-40 rounded shadow mt-4 bg-white"
                    />
                    <DwonloadOptions downloadSignature={downloadSignature} />
               </div>
            )}
        </div>
    )
}