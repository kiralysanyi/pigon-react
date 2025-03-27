import { useState } from "react";
import "./styles/form.css"
import Alert from "./components/Alert";
import { useNavigate } from "react-router";
import { checkIfLoggedIn, login, passkeyAuth } from "./utils/auth";

let alertTitle, alertContent;



function Login() {
    document.title = "Pigon - Login"
    const [alertShown, setAlertShown] = useState(false)
    let navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [deviceName, setDeviceName] = useState("")

    const [usePasskey, setUsePasskey] = useState(false);


    const loginHandler = async (e) => {
        if (!usePasskey) {
            let data = await login(username, password, deviceName)
            console.log("kecske", data);
            if (data.success) {
                setTimeout(() => {
                    navigate("/app");
                    location.reload()
                }, 1000);
            }
        }

        if (usePasskey) {
            if (deviceName == "") {
                console.log("Device name empty")
                return;
            }
            passkeyAuth(deviceName);
        }
    }

    return <>
        <form className="form">
            <h1>Pigon Login</h1>

            {!usePasskey ? <>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
                </div>
            </> : ""}

            <div className="form-group">
                <label htmlFor="device">Device name</label>
                <input type="text" name="device" id="device" value={deviceName} onChange={(e) => { setDeviceName(e.target.value) }} />
            </div>


            <div className="form-group button-container">
                {!usePasskey ? <input type="button" onClick={() => { setUsePasskey(true) }} value="Use passkey" /> : <input onClick={() => { setUsePasskey(false) }} type="button" value="Use password" />}
                <input type="button" value="Login" onClick={loginHandler} />
                <input type="button" className="secondary-btn" value="I don't have an account" onClick={() => { navigate("/register") }} />
            </div>
        </form>
        {
            (() => {
                if (alertShown == true) {
                    return <Alert content={alertContent} title={alertTitle} onClosed={() => { setAlertShown(false) }}></Alert>
                }
            })()
        }
    </>
}

export default Login;