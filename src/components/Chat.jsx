
import "../styles/user.css"
import "../styles/unread.css"
import { BASEURL } from "../config";
import { MdPeopleAlt } from "react-icons/md";

function Chat({ pfpid, chatname, unread, className, onClick = () => { }, style, groupmode = 0 }) {
    return <div className={`user ${className} ${unread ? "unread" : ""}`} style={style} onClick={onClick}>
        {groupmode == 0 ? <img src={BASEURL + `/api/v1/auth/pfp?id=${pfpid}&smol=true`} ></img> : <MdPeopleAlt style={{ width: "56px", height: "56px" }} />}
        <span>{chatname}</span>
    </div>
}

export default Chat;