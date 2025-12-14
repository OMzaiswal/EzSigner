import { Link } from "react-router-dom"

export const Navbar = () => {

    return (
        <div>
            <Link to='/signature'>Create Signature</Link>
            <Link to='/sign-document'>Sign Document</Link>
        </div>
    )
}