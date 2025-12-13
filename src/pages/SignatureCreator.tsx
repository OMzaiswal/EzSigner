import { useEffect, useRef, useState } from "react"
import { SignatureTyped } from "../components/SignatureTyped"

export const SignatureCreator = () => {

    const [textSign, setTextSign] = useState('');
    const [fontFamily, setFontFamily] = useState('Arial');
    const [fontSize, setFontSize] = useState(50);
    const [fontWeight, setFontWeight] = useState('normal');
    const [color, setColor] = useState('black');

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d')!;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = color;
        ctx.font = `${fontWeight} ${fontSize}px '${fontFamily}'`
        ctx.fillText(textSign, 40, 120);



    }, [textSign, fontFamily, fontSize, fontWeight, color])

    const dowloadSignature = (
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
        <div className="flex flex-col justify-center items-center">
            <SignatureTyped 
                textSign = {textSign}
                setTextSign={setTextSign}
                fontSize={fontSize}
                setFontSize={setFontSize}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
                fontWeight={fontWeight}
                setFontWeight={setFontWeight}
                color={color}
                setColor={setColor}
            />

            <canvas
                className="border border-gray-300 rounded-lg bg-white"
                ref={canvasRef}
                width={800}
                height={300}
            />

            <div className="flex flex-col gap-4 mt-6">
                <p className="font-semibold text-xl">Download Signature</p>
                <div className="flex gap-4">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => dowloadSignature('png', 300, 100)}
                    >
                        PNG 300x100
                    </button>
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => dowloadSignature('png', 600, 200)}
                    >
                        PNG 600x200
                    </button>
                </div>
                <div className="flex gap-4">
                <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => dowloadSignature('jpg', 300, 100)}
                    >
                        JPG 300x100
                    </button>
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => dowloadSignature('jpg', 600, 200)}
                    >
                        JPG 600x200
                    </button>
                </div>
            </div>
        </div>

    )
}