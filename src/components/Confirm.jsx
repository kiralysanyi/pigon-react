import "../styles/alert.css"

function Confirm({ title, content, onCancel = () => { }, onConfirm = () => {} }) {
    return <>
        <div className="dialog-container">
            <div className="alert-dialog">
                <h1>{title}</h1>
                <p>{content}</p>
                <input type="button" value="Cancel" onClick={onCancel} />
                <input type="button" className="btn-danger" value="Confirm" onClick={onConfirm} />
            </div>
        </div>
    </>
}

export default Confirm;