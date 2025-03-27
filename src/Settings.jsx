import { useEffect, useState } from "react";
import { Sidebar, SidebarGroup, SidebarItem, Spacer } from "./components/Sidebar";
import "./styles/settings.css"
import { BASEURL } from "./config";
import { changePfp, getExtraInfo, getUserInfo, postExtraInfo } from "./utils/auth";
import { CgArrowLeft } from "react-icons/cg";
import { useNavigate } from "react-router";

const userInfo = (await getUserInfo())["data"];


function Settings() {
    const [selectedPage, setSelectedPage] = useState("profile");
    const [fullname, setFullname] = useState("");
    const [bio, setBio] = useState("")
    const navigate = useNavigate();

    useEffect(() => {
        getExtraInfo(userInfo.id).then((result) => {
            setFullname(result.fullname)
            setBio(result.bio)
        }).catch((err) => {
            console.error(err);
        })
    }, [])
    return <>
        <Sidebar>
            <SidebarGroup className="horizontal">
                <CgArrowLeft onClick={() => {navigate("/app")}} style={{padding: "0.5rem", width: "1.5rem", height: "1.5rem"}}/>
                <h1>Settings</h1>
            </SidebarGroup>
            <Spacer />
            <SidebarGroup>
                <SidebarItem onClick={() => { setSelectedPage("profile") }} className={`sidebar-settings-item ${selectedPage == "profile" ? "selected" : ""}`}>
                    Profile
                </SidebarItem>
                <SidebarItem onClick={() => { setSelectedPage("webauthn") }} className={`sidebar-settings-item ${selectedPage == "webauthn" ? "selected" : ""}`}>
                    Webauthn
                </SidebarItem>
            </SidebarGroup>
        </Sidebar>
        <div className="settings-content">
            {selectedPage == "profile" ? <div>
                <div className="settings-section">
                    <h1>Profile picture</h1>
                    <img className="settings-pfp" src={BASEURL + "/api/v1/auth/pfp?id=" + userInfo.id} />
                    <span style={{ alignSelf: "center" }}>{userInfo.username}</span>
                    <button onClick={changePfp} className="settings-btn">Change profile picture</button>

                    <form onSubmit={(e) => { e.preventDefault() }}>
                        <label htmlFor="fullname">Full Name</label>
                        <input value={fullname} onChange={(e) => { setFullname(e.target.value) }} type="text" name="fullname" id="fullname" style={{ width: "30vw" }} />
                        <label htmlFor="bio">Bio</label>
                        <textarea value={bio} onChange={(e) => { setBio(e.target.value) }} name="bio" id="bio" rows="20" style={{ width: "30vw" }}></textarea>
                    </form>
                    <button className="settings-btn" onClick={() => { postExtraInfo(fullname, bio).then(() => {window.alert("Updated information successfully")}).catch((err) => {window.alert(err)}) }}>Save Info</button>
                </div>
            </div> : ""}
        </div>
    </>
}

export default Settings;