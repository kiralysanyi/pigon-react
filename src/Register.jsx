import { useNavigate } from "react-router";
import { useState } from "react";
import "./styles/form.css"
import Alert from "./components/Alert";
import { register } from "./utils/auth";
let alertTitle = "";
let alertContent = "";

function Register() {
    document.title = "Pigon - Register"
    const [alertShown, setAlertShown] = useState(false)
    let navigate = useNavigate();

    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [username, setUsername] = useState("")


    const regHandler = () => {
        if (password !== password2) {
            alertTitle = "Password mismatch"
            alertContent = "The two passwords are not the same, please check again."
            setAlertShown(true);
            return;
        } else {
            //continue with registration
            register(username, password).then((response) => {
                console.log(response)
                if (response.success == true) {
                    alertContent = "Registered account successfully, you will be redirected to login page shortly"
                    alertTitle = "Info"
                    setAlertShown(true)
                    setTimeout(() => {
                        navigate("/login")
                    }, 1000);
                } else {
                    alertTitle = "Error";
                    alertContent = response.data.message;
                    setAlertShown(true)
                }
            })
        }
    }

    return <>
        <form className="form">
            <h1>Pigon Register</h1>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" value={username} onChange={(e) =>  {setUsername(e.target.value)}} />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" value={password} onChange={(e) => {setPassword(e.target.value)}} />
            </div>

            <div className="form-group">
                <label htmlFor="password2">Confirm password</label>
                <input type="password" name="password2" id="password2" value={password2} onChange={(e) => {setPassword2(e.target.value)}} />
            </div>


            <div className="form-group button-container">
                <input type="button" value="Register" onClick={regHandler} />
                <input type="button" className="secondary-btn" value="I already have an account" onClick={() => {navigate("/login")}} />
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

export default Register;