import "../styles/loadingscreen.css"

function LoadingScreen({text = "Loading..."}) {
    return <div className="loadingscreen">
        <div className="spinner"></div>
        <h1>{text}</h1>
    </div>
}

export default LoadingScreen;