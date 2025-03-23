import { BASEURL } from "../config";
import messageProcessor from "../utils/chat/messageProcessor";

function Message({ type, content, senderName, senderId, date }) {
   
    if (type == "text") {
        content = messageProcessor(content)
        console.log(type, content)
        return <div className="msg">
            <img className="pfp" src={BASEURL + "/api/v1/auth/pfp?id=" + senderId + "&smol=true"} alt="msg-pfp" />
            <div className="msg-content">
                <span className="msg-username">{senderName}</span>
                <span className="msg-text">{content}</span>
            </div>
        </div>
    }

    if (type == "image") {
        console.log(type, content)
        return <div className="msg">
            <img className="pfp" src={BASEURL + "/api/v1/auth/pfp?id=" + senderId + "&smol=true"} alt="msg-pfp" />
            <div className="msg-content">
                <span className="msg-username">{senderName}</span>
                <img src={BASEURL + content} alt="msg-content" className="msg-image" />
            </div>
        </div>
    }

    if (type == "video") {
        console.log(type, content)
        return <div className="msg">
            <img className="pfp" src={BASEURL + "/api/v1/auth/pfp?id=" + senderId + "&smol=true"} alt="msg-pfp" />
            <div className="msg-content">
                <span className="msg-username">{senderName}</span>
                <video src={BASEURL + content} autoPlay muted className="msg-image" />
            </div>
        </div>
    }
    
}

export default Message;