import { useNavigate } from "react-router";
import { useState } from "react";
import "./styles/form.css"
import Alert from "./components/Alert";

function Register() {
    document.title = "Pigon - Register"
    const [alertShown, setAlertShown] = useState(false)
    let navigate = useNavigate();


    const regHandler = () => {

    }

    return <>
        <form>
            <h1>Pigon Register</h1>
            <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" name="username" id="username" />
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" id="password" />
            </div>

            <div className="form-group">
                <label htmlFor="password2">Confirm password</label>
                <input type="password" name="password2" id="password2" />
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