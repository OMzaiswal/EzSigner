import { useEffect, useRef, useState } from "react";
import { DwonloadOptions } from "./DownloadOptions";
import { useSignature } from "../context/SignatureContext";

export const SignatureTyped = () => {

    const [textSign, setTextSign] = useState('');
    const [fontFamily, setFontFamily] = useState('Dancing Script');
    const [fontSize, setFontSize] = useState(50);
    const [fontWeight, setFontWeight] = useState('normal');
    const [color, setColor] = useState('black');

    const { setSignatureUrl } = useSignature();

    const fonts = [
        "Arial",
        "Great Vibes",
        "Pacifico",
        "Dancing Script",
        "Satisfy",
        "Courier New",
        "Roboto",
        "Georgia",
      ];

    useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = color;
    ctx.font = `${fontWeight} ${fontSize}px '${fontFamily}'`
    ctx.fillText(textSign, 40, 120);

    const url = canvas.toDataURL('image/png');
    setSignatureUrl(url);

    }, [textSign, fontFamily, fontSize, fontWeight, color])

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const downloadSignature = (
        format: 'png' | 'jpg',
        width: number,
        height: number
    ) => {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = width;
        exportCanvas.height = height;

        const ctx = exportCanvas.getContext('2d')!;

        if (format === 'jpg') {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, width, height);
        }

        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = `${fontWeight} ${fontSize}px '${fontFamily}'`
        ctx.fillText(textSign, width/2, height/2)

        const time = new Date().getTime();

        const dataUrl = exportCanvas.toDataURL(`image/${format}`);

        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `signature_${width}x${height}_${time}.${format}`
        link.click();
    };

    return (
        <div className="">
            <div className="flex gap-4 p-4 h-30">
                <div className="flex flex-col">
                    <label htmlFor="signText" className="text-sm text-gray-600">Signature Text</label>
                    <input 
                        type="text" 
                        id="signText"
                        placeholder="Type your signature"
                        value={textSign}
                        onChange={(e) => setTextSign(e.target.value)}
                        className="border border-gray-300 rounded-md p-2 w-full"
                    />
                    <canvas />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600">Font Family</label>
                    <select 
                        value={fontFamily}
                        onChange={e => setFontFamily(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        {fonts.map(font => (
                            <option key={font} value={font} style={{ fontFamily: font }}>{font}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600 mb-1">Font Size</label>
                    <input 
                        type="range" 
                        min='20'
                        max='120'
                        value={fontSize}
                        onChange={e => setFontSize(Number(e.target.value))}
                    />
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600">Font Weight</label>
                    <select
                        value={fontWeight}
                        onChange={(e) => setFontWeight(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                    >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        {/* <option value="600">Semi-bold</option>
                        <option value="300">Light</option> */}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label className="text-sm text-gray-600">Colour</label>
                    <input 
                        type="color" 
                        value={color}
                        onChange={e => setColor(e.target.value)} 
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                    />
                </div>
            </div>
            <canvas
                className="rounded-lg bg-white shadow"
                ref={canvasRef}
                width={800}
                height={300}
            />

            <DwonloadOptions downloadSignature={downloadSignature} />
        </div>
    )
}