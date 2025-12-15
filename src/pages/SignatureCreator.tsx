import { useState } from "react"
import { SignatureTyped } from "../components/SignatureTyped"
import { SignatureDraw } from "../components/SignatureDraw";
import { SignatureUpload } from "../components/SignatureUpload";

export const SignatureCreator = () => {

    const [mode, setMode] = useState<'typed' | 'draw' | 'upload'>('typed');

    return (
        <div className="m-8 borde flex gap-40">
            {/* SideBar */}
            <div className="w-60 h-60 p-4 bg-gray-200 rounded-lg flex justify-center items-center">
                <ul className="space-y-4 text-lg">
                    <li>
                        <button
                            className={`px-3 py-2 rounded hover:bg-blue-200 text-center ${mode === 'typed' ? 'bg-blue-300 text-blue-800' : ''}`}
                            onClick={() => setMode('typed')}
                        >
                            Type Signature
                        </button>
                    </li>
                    <li>
                        <button
                            className={`px-3 py-2 rounded hover:bg-blue-200 text-center ${mode === 'draw' ? 'bg-blue-300 text-blue-800' : ''}`}
                            onClick={() => setMode('draw')}
                        >
                            Draw Signature
                        </button>
                    </li>
                    <li>
                        <button
                            className={`px-3 py-2 rounded hover:bg-blue-200 text-center ${mode === 'upload' ? 'bg-blue-300 text-blue-800' : ''}`}
                            onClick={() => setMode('upload')}
                        >
                            Upload Signature
                        </button>
                    </li>
                </ul>
            </div>
            <div className="flex flex-col justify-center items-center">
                {mode === 'typed' && <SignatureTyped />}

                {mode === 'draw' && <SignatureDraw  />}

                {mode === 'upload' && <SignatureUpload />}

                
            </div>
        </div>

    )
}