import { Link } from "react-router-dom"

export const Home = () => {

    return (
        <div className="flex gap-8 justify-center h-screen mt-40">
            <Link to='/signature'>
                <div className="flex justify-start p-4 lg:p-6 flex-col w-full max-w-[359px] h-auto min-h-[200px] lg:h-[258px] gap-4 lg:gap-7 border border-[#FFFFFF1C] rounded-3xl bg-[#295F92] cursor-pointer" 
                    // style="opacity: 1; transform: none;"
                >
                    <div 
                        className="h-12 lg:h-16 w-12 lg:w-16 rounded-full flex justify-center items-center bg-white">
                        <img src="/up.png" className="size-5 lg:size-7" alt="Upload or Create" />
                    </div>
                    <div>
                        <div className="text-white text-lg lg:text-2xl font-bold font-dm-sans"> Create Signature</div>
                        <div className="text-white text-sm lg:text-base font-light mt-2 font-dm-sans">
                            Easily text, draw or upload Signatures and download them in jpg or png.
                        </div>
                    </div>
                </div>
            </Link>
            <Link to='/sign-document'>
                <div className="flex justify-start p-4 lg:p-6 flex-col w-full max-w-[359px] h-auto min-h-[200px] lg:h-[258px] gap-4 lg:gap-7 border border-[#FFFFFF1C] rounded-3xl bg-[#295F92] cursor-pointer" 
                    // style="opacity: 1; transform: none;"
                >
                    <div className="h-12 lg:h-16 w-12 lg:w-16 rounded-full flex justify-center items-center bg-white">
                        <img src="/sign.png" className="size-5 lg:size-7" alt="Sign &amp; Send" />
                    </div>
                    <div>
                        <div className="text-white text-lg lg:text-2xl font-bold font-dm-sans">Upload &amp; Sign</div>
                        <div className="text-white text-sm lg:text-base font-light mt-2 font-dm-sans">
                            Easily upload PDF and Images. Review, Sign and Export all documents. 
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}