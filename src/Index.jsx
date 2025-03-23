//this is landing page basically, this will be shown when the user is not logged in

import { NavLink, useNavigate } from "react-router";
import { checkIfLoggedIn } from "./utils/auth";

function Index() {
    const navigate = useNavigate();
    checkIfLoggedIn().then((isLoggedIn) => {
        if (isLoggedIn) {
            navigate("/app")
        }
    })
    return <>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
    </>
}

export default Index;