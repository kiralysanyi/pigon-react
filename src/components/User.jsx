//simple component to display profile picture and username, used in search and sidebar

import "../styles/user.css"
import { BASEURL } from "../config";
import { MdPeopleAlt } from "react-icons/md";

//you may wonder what the heck is groupmode. I am too lazy to make an other component for displaying the chats itself so I just added a flag here so if we set this to 1 it will display an icon (because we cannot set pictures for groups xD)

function User({ id, username, className, onClick = () => { }, style, groupmode = 0 }) {
    return <div className={`user ${className}`} style={style} onClick={onClick}>
        {groupmode == 0 ? <img src={BASEURL + `/api/v1/auth/pfp?id=${id}&smol=true`}></img> : <MdPeopleAlt style={{width: "56px", height: "56px"}} />}
        <span>{username}</span>
    </div>
}

export default User;