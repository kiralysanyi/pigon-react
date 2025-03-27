import { useEffect, useState } from "react";
import { Sidebar, SidebarGroup, SidebarItem, Spacer } from "./components/Sidebar";
import "./styles/settings.css";
import { BASEURL } from "./config";
import { changePfp, getExtraInfo, getUserInfo, postExtraInfo, registerPasskey, removeAllPasskeys } from "./utils/auth";
import { CgArrowLeft } from "react-icons/cg";
import { useNavigate } from "react-router";
import Confirm from "./components/Confirm";
import Alert from "./components/Alert";

const userInfo = (await getUserInfo())["data"];

//TODO: add option to change password

function Settings() {
    document.title = "Settings";
    const [selectedPage, setSelectedPage] = useState("profile");
    const [fullname, setFullname] = useState("");
    const [bio, setBio] = useState("");
    const navigate = useNavigate();

    const [confirmData, setConfirmData] = useState(null);

    const [alertData, setAlertData] = useState(null);

    useEffect(() => {
        getExtraInfo(userInfo.id)
            .then((result) => {
                setFullname(result.fullname);
                setBio(result.bio);
            })
            .catch((err) => console.error(err));
    }, []);

    const showConfirmDialog = (title, content, onConfirm) => {
        setConfirmData({ title, content, onConfirm });
    };

    const showAlertDialog = (title, content) => {
        setAlertData({ title, content });
    };

    const removePasskeysHandler = () => {
        showConfirmDialog(
            "Do you really want to remove all passkeys?",
            "This will invalidate all of your passkeys paired to this account. This is irreversible and may lock you out from your account if you don't know your password.",
            () => {
                removeAllPasskeys().then((result) => {
                    showAlertDialog(result.success ? "Info" : "Error", result.message);
                });
            }
        );
    };

    return (
        <>
            <Sidebar>
                <SidebarGroup className="horizontal">
                    <CgArrowLeft onClick={() => navigate("/app")} style={{ padding: "0.5rem", width: "1.5rem", height: "1.5rem" }} />
                    <h1>Settings</h1>
                </SidebarGroup>
                <Spacer />
                <SidebarGroup>
                    <SidebarItem onClick={() => setSelectedPage("profile")} className={`sidebar-settings-item ${selectedPage === "profile" ? "selected" : ""}`}>
                        Profile
                    </SidebarItem>
                    <SidebarItem onClick={() => setSelectedPage("webauthn")} className={`sidebar-settings-item ${selectedPage === "webauthn" ? "selected" : ""}`}>
                        Webauthn
                    </SidebarItem>
                </SidebarGroup>
            </Sidebar>

            <div className="settings-content">
                {selectedPage === "profile" && (
                    <div className="settings-section">
                        <h1>Profile picture</h1>
                        <img className="settings-pfp" src={`${BASEURL}/api/v1/auth/pfp?id=${userInfo.id}`} alt="Profile" />
                        <span style={{ alignSelf: "center" }}>{userInfo.username}</span>
                        <button onClick={changePfp} className="settings-btn">Change profile picture</button>

                        <form onSubmit={(e) => e.preventDefault()}>
                            <label htmlFor="fullname">Full Name</label>
                            <input value={fullname} onChange={(e) => setFullname(e.target.value)} type="text" name="fullname" id="fullname" style={{ width: "30vw" }} />
                            <label htmlFor="bio">Bio</label>
                            <textarea value={bio} onChange={(e) => setBio(e.target.value)} name="bio" id="bio" rows="20" style={{ width: "30vw" }}></textarea>
                        </form>
                        <button
                            className="settings-btn"
                            onClick={() => {
                                postExtraInfo(fullname, bio)
                                    .then(() => showAlertDialog("Success", "Updated information successfully"))
                                    .catch((err) => showAlertDialog("Error", err.toString()));
                            }}
                        >
                            Save Info
                        </button>
                    </div>
                )}

                {selectedPage === "webauthn" && (
                    <div className="settings-section">
                        <h1>Webauthn (passkey) settings</h1>
                        <p>Passkeys are great, you should use them. Why? Because you don't need to remember your password, only where your passkey is. And it's safe, very safe.</p>
                        <button onClick={() => registerPasskey(userInfo.username)} className="settings-btn">Add passkey</button>
                        <button className="settings-btn btn-danger" onClick={removePasskeysHandler}>Remove all passkeys</button>
                    </div>
                )}
            </div>

            {confirmData && <Confirm title={confirmData.title} content={confirmData.content} onCancel={() => setConfirmData(null)} onConfirm={() => { setConfirmData(null); confirmData.onConfirm(); }} />}
            {alertData && <Alert title={alertData.title} content={alertData.content} onClosed={() => setAlertData(null)} />}
        </>
    );
}

export default Settings;
