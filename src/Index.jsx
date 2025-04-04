//this is landing page basically, this will be shown when the user is not logged in

import { NavLink, useNavigate } from "react-router";
import { checkIfLoggedIn } from "./utils/auth";

function Index() {
    document.title = "Welcome to pigon"
    const navigate = useNavigate();
    checkIfLoggedIn().then((isLoggedIn) => {
        if (isLoggedIn) {
            navigate("/app")
        }
    })
    return <>
        <div className="container p-2.5 mx-auto max-w-3xl h-dvh flex flex-col justify-center items-center bg-zinc-200/70 backdrop-blur-lg gap-4">
            <h1 className="text-4xl">Welcome to pigon!</h1>
            <h2 className="text-2xl">The worlds 4700th messaging app thing.</h2>
            <NavLink className="btn" to="/login">Login</NavLink>
            <NavLink className="btn" to="/register">Register</NavLink>
        </div>
    </>
}

export default Index;