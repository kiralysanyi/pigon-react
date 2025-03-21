//this is landing page basically, this will be shown when the user is not logged in

import { NavLink } from "react-router";

function Index() {
    return <>
        <NavLink to="/login">Login</NavLink>
        <NavLink to="/register">Register</NavLink>
    </>
}

export default Index;