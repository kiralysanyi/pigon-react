import { BASEURL } from "../config";
import { getUserInfo } from "../utils/auth";
import messageProcessor from "../utils/chat/messageProcessor";

const userInfo = (await getUserInfo())["data"];

function Message({ type, content, senderName, senderId, date }) {
    console.log(senderId, userInfo.id)
    if (type == "text") {
        content = messageProcessor(content)
        return <div className={`msg ${userInfo.id == senderId ? "msg-self" : ""}`}>
            <img className="pfp" src={BASEURL + "/api/v1/auth/pfp?id=" + senderId + "&smol=true"} alt="msg-pfp" />
            <div className="msg-content">
                <span className="msg-username">{senderName}</span>
                <span className="msg-text">{content}</span>
                <span className="msg-date">{new Date(date).toLocaleString()}</span>
            </div>
        </div>
    }

    if (type == "image") {
        return <div className={`msg ${userInfo.id == senderId ? "msg-self" : ""}`}>
            <img className="pfp" src={BASEURL + "/api/v1/auth/pfp?id=" + senderId + "&smol=true"} alt="msg-pfp" />
            <div className="msg-content">
                <span className="msg-username">{senderName}</span>
                <img src={BASEURL + content} alt="msg-content" className="msg-image" />
                <span className="msg-date">{new Date(date).toLocaleString()}</span>
            </div>
        </div>
    }

    if (type == "video") {
        return <div className={`msg ${userInfo.id == senderId ? "msg-self" : ""}`}>
            <img className="pfp" src={BASEURL + "/api/v1/auth/pfp?id=" + senderId + "&smol=true"} alt="msg-pfp" />
            <div className="msg-content">
                <span className="msg-username">{senderName}</span>
                <video src={BASEURL + content} autoPlay muted className="msg-image" />
                <span className="msg-date">{new Date(date).toLocaleString()}</span>
            </div>
        </div>
    }

}

export default Message;