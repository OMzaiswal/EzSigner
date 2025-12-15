import { Link } from "react-router-dom"

export const Navbar = () => {

    return (
        <div className="flex justify-around py-6 bg-gray-200">
            <div>
                <Link to='/' className="text-2xl text-blue-600">EzSigner</Link>
            </div>
            <div className="flex gap-4">
                <Link to='/signature' className="border border-gray-400 rounded p-2 hover:bg-gray-500 hover:text-white">Create Signature</Link>
                <Link to='/sign-document' className="border border-gray-400 rounded p-2 hover:bg-gray-500 hover:text-white">Sign Document</Link>
            </div>
        </div>
    )
}