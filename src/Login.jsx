import { useState } from "react";
import "./styles/form.css"
import Alert from "./components/Alert";
import { useNavigate } from "react-router";
let alertTitle, alertContent;



function Login() {
    document.title = "Pigon - Login"
    const [alertShown, setAlertShown] = useState(false)
    let navigate = useNavigate();


    const loginHandler = (e) => {
        e.preventDefault();
        alertContent = "Kecske"
        alertTitle = "HEEEEE"
        setAlertShown(true);
    }

    return <>
        <form>
            <h1>Pigon Login</h1>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
            </div>

            <div className="form-group">
                <label htmlFor="device">Device name</label>
                <input type="text" name="device" id="device" />
            </div>


            <div className="form-group button-container">
                <input type="button" value="Login" onClick={loginHandler} />
                <input type="button" className="secondary-btn" value="I don't have an account" onClick={() => {navigate("/register")}} />
            </div>
        </form>
        {
            (() => {
                if (alertShown == true) {
                    return <Alert content={alertContent} title={alertTitle} onClosed={() => {setAlertShown(false)}}></Alert>
                }
            })()
        }
    </>
}

export default Login;