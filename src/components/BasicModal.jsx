import { CgClose } from "react-icons/cg";
import "../styles/modal.css"

function BasicModal({title, children, style, onClose = () => {}}) {
    return <>
        <div className="modal-container">
            <div className="modal" style={style}>
                <div className="modal-header">
                    <h1>{title}</h1>
                    <CgClose className="modal-close" onClick={onClose} />
                </div>
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    </>
}

export default BasicModal;