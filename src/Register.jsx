import { useNavigate } from "react-router";
import { useState } from "react";
import "./styles/form.css"
import Alert from "./components/Alert";
import { register } from "./utils/auth";
import LoadingScreen from "./components/LoadingScreen";
let alertTitle = "";
let alertContent = "";
let loaderText = "";


function Register() {
    document.title = "Pigon - Register"
    const [alertShown, setAlertShown] = useState(false)
    let navigate = useNavigate();

    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [username, setUsername] = useState("")

    const [showLoading, setShowLoading] = useState(false);


    const regHandler = () => {
        loaderText = "Processing request...";
        setShowLoading(true);
        if (password !== password2) {
            alertTitle = "Password mismatch"
            alertContent = "The two passwords are not the same, please check again."
            setShowLoading(false);
            setAlertShown(true);
            return;
        } else {
            //continue with registration
            register(username, password).then((response) => {
                console.log(response)
                if (response.success == true) {
                    setShowLoading(false);
                    loaderText = "Registered account successfully, you will be redirected to login page shortly"
                    setShowLoading(true);
                    setTimeout(() => {
                        navigate("/login")
                    }, 1000);
                } else {
                    setShowLoading(false);
                    alertTitle = "Error";
                    alertContent = response.data.message;
                    setAlertShown(true)
                }
            })
        }
    }

    return <div className="flex flex-col items-center justify-center h-dvh">
        <form className="form">
            <h1>Pigon Register</h1>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
            </div>

            <div className="form-group">
                <label htmlFor="password2">Confirm password</label>
                <input type="password" name="password2" id="password2" value={password2} onChange={(e) => { setPassword2(e.target.value) }} />
            </div>


            <div className="form-group button-container">
                <input type="button" value="Register" onClick={regHandler} />
                <input type="button" className="secondary-btn" value="I already have an account" onClick={() => { navigate("/login") }} />
            </div>
        </form>
        {
            (() => {
                if (alertShown == true) {
                    return <Alert content={alertContent} title={alertTitle} onClosed={() => { setAlertShown(false) }}></Alert>
                }
            })()
        }

        {showLoading ? <LoadingScreen text={loaderText} /> : ""}
    </div>
}

export default Register;