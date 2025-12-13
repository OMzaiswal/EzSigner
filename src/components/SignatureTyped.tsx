
export const SignatureTyped = ({
    textSign,
    setTextSign,
    fontSize,
    setFontSize,
    fontFamily,
    setFontFamily,
    fontWeight,
    setFontWeight,
    color,
    setColor

}: any ) => {

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

    return (
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
    )
}