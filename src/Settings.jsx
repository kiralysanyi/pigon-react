import { useEffect, useState } from "react";
import { Sidebar, SidebarGroup, SidebarItem, Spacer } from "./components/Sidebar";
import "./styles/settings.css";
import { BASEURL } from "./config";
import { changePfp, getExtraInfo, getUserInfo, postExtraInfo, registerPasskey, removeAllPasskeys } from "./utils/auth";
import { CgArrowLeft, CgMenu } from "react-icons/cg";
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
    const [hideSidebar, setHideSidebar] = useState(true)

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
            <button onClick={() => { setHideSidebar(!hideSidebar) }} className="block fixed top-0 left-0 w-16 h-16 z-49 bg-white dark:bg-black/40 backdrop-blur-lg dark:text-white lg:hidden">
                {/* open sidebar, only show in mobile view */}
                
                <CgMenu className="w-full h-full p-3" />
            </button>
            <Sidebar hide={hideSidebar}>
                <SidebarGroup className="horizontal">
                    <CgArrowLeft onClick={() => navigate("/app")} className="w-10 h-10 p-0" />
                    <h1 className="text-3xl">Settings</h1>
                </SidebarGroup>
                <Spacer />
                <SidebarGroup>
                    <SidebarItem onClick={() => {setSelectedPage("profile"); setHideSidebar(true)}} className={`sidebar-settings-item ${selectedPage === "profile" ? "selected" : ""}`}>
                        Profile
                    </SidebarItem>
                    <SidebarItem onClick={() => {setSelectedPage("webauthn"); setHideSidebar(true)}} className={`sidebar-settings-item ${selectedPage === "webauthn" ? "selected" : ""}`}>
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
                            <input className="input" value={fullname} onChange={(e) => setFullname(e.target.value)} type="text" name="fullname" id="fullname"  />
                            <label htmlFor="bio">Bio</label>
                            <textarea className="input" value={bio} onChange={(e) => setBio(e.target.value)} name="bio" id="bio" rows="20"></textarea>
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
