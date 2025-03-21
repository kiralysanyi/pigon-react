//window.alert replacement thing
import "../styles/form.css"
import "../styles/alert.css"

function Alert({ title, content, onClosed = () => { } }) {
    return <>
        <div className="dialog-container">
            <div className="alert-dialog">
                <h1>{title}</h1>
                <p>{content}</p>
                <input type="button" value="OK" onClick={onClosed} />
            </div>
        </div>
    </>
}

export default Alert;