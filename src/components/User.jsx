//simple component to display profile picture and username, used in search and sidebar

import "../styles/user.css"
import { BASEURL } from "../config";
import { MdPeopleAlt } from "react-icons/md";


function User({ id, username, className, onClick = () => { }, style }) {
    return <div className={`user ${className}`} style={style} onClick={onClick}>
        <img src={BASEURL + `/api/v1/auth/pfp?id=${id}&smol=true`}></img>
        <span>{username}</span>
    </div>
}

export default User;