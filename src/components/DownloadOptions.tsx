
type Props = {
    downloadSignature: (format: 'png' | 'jpg', width: number, height: number) => void
}

export const DwonloadOptions = ({ downloadSignature }: Props) => {
    return (
        <div className="flex flex-col gap-4 mt-6">
                <p className="font-semibold text-xl">Download Signature</p>
                <div className="flex gap-4">
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => downloadSignature('png', 300, 100)}
                    >
                        PNG 300x100
                    </button>
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => downloadSignature('png', 600, 200)}
                    >
                        PNG 600x200
                    </button>
                </div>
                <div className="flex gap-4">
                <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => downloadSignature('jpg', 300, 100)}
                    >
                        JPG 300x100
                    </button>
                    <button 
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={() => downloadSignature('jpg', 600, 200)}
                    >
                        JPG 600x200
                    </button>
                </div>
            </div>
    )
}