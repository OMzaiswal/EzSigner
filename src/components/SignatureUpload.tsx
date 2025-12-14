import { useRef, useState } from "react"
import { DwonloadOptions } from "./DownloadOptions";
import { useSignature } from "../context/SignatureContext";

export const SignatureUpload = () => {

    const [uploadUrl, setUploadUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const { setSignatureUrl } = useSignature();
 
    const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if(!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setUploadUrl(reader.result as string);
        }
        reader.readAsDataURL(file);
    }

    const downloadSignature = (
        format: 'png' | 'jpg',
        width: number,
        height: number
    ) => {

        if (!uploadUrl) {
            alert('Upload an Image first');
            return;
        }

        const img = new Image();
        img.src = uploadUrl;

        img.onload = () => {
            const exportCanvas = document.createElement('canvas');
            exportCanvas.width = width;
            exportCanvas.height = height;

            const ctx = exportCanvas.getContext('2d')!;

            if (format === 'jpg') {
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, width, height);
            }

            ctx.drawImage(img, 0, 0, width, height);
            const url = exportCanvas.toDataURL(`image/${format}`);
            setSignatureUrl(url);

            const time = Date.now();

            const link = document.createElement('a');
            link.href = url;
            link.download = `signature_${width}x${height}_${time}.${format}`;
            link.click()
        }
    }

    const clear = () => {
        setUploadUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-x-2">
                <label className="text-lg">Upload Sign</label>
                <input 
                    type="file"
                    accept="image/png, image/jpg, image/jpeg, image/svg+xml"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    className="border border-gray-300 rounded-md p-2 " 
                />
                <button
                    className="border border-gray-300 text-lg rounded-lg px-4 py-1 text-red-500 hover:bg-red-100 hover:text-red-600"
                    onClick={clear}
                >
                    Remove
                </button>
            </div>
            <div>
                {uploadUrl && (
                    <div>
                        <img 
                            src={uploadUrl} 
                            alt="Uploaded Image"
                            className="max-h-40 rounded bg-white shadow" 
                        />
                        <DwonloadOptions downloadSignature={downloadSignature} />
                    </div>
                )}
            </div>
        </div>
    )
}