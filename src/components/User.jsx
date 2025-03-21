//simple component to display profile picture and username, used in search and sidebar

import "../styles/user.css"
import { BASEURL } from "../config";

function User({id, username, onClick = () => {}}) {
    return <div className="user" onClick={onClick}>
        <img src={BASEURL + `/api/v1/auth/pfp?id=${id}&smol=true`}></img>
        <span>{username}</span>
    </div>
}

export default User;