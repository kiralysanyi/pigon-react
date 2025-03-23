import { CgClose } from "react-icons/cg"
import "../styles/mediaviewer.css"

function MediaViewer({ type, url, onClose = () => { } }) {
    if (type == "image") {
        return <div className="mediaviewer">
            <div className="mediaviewer-header">
                <CgClose onClick={onClose} style={{ justifySelf: "end", width: "2rem", height: "2rem" }} />
                <h1 style={{ justifySelf: "start" }}>Pigon</h1>
            </div>
            <img src={url} alt="image" />
        </div>
    }

    if (type == "video") {
        return <div className="mediaviewer">
            <div className="mediaviewer-header">
                <CgClose onClick={onClose} style={{ justifySelf: "end", width: "2rem", height: "2rem" }} />
                <h1 style={{ justifySelf: "start" }}>Pigon</h1>
            </div>
            <video src={url} autoPlay controls></video>
        </div>
    }
}

export default MediaViewer