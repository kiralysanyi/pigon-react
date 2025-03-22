import { useState } from "react";
import { Sidebar, SidebarGroup, SidebarItem, Spacer } from "./components/Sidebar";
import { CgAdd, CgLaptop, CgLogOut } from "react-icons/cg"
import NewChatModal from "./components/NewChatModal";
import { checkIfLoggedIn, getUserInfo, logout } from "./utils/auth";
import { useNavigate } from "react-router";
import { addPrivateChat, getChats } from "./utils/chat/chat";
import User from "./components/User";
import removeFromArray from "./utils/removeFromArray";
import { RiSendPlane2Fill } from "react-icons/ri";
import "./styles/app.css"

const userInfo = (await getUserInfo())["data"];
let checkedLogin = false;

function App() {
    const navigate = useNavigate();
    if (!checkedLogin) {
        checkIfLoggedIn().then((isLoggedIn) => {
            if (!isLoggedIn) {
                navigate("/login")
            } else {
                checkedLogin = true;
            }
        })
    }



    document.title = "Pigon"
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [chatList, setChatList] = useState(null);
    const [message, setMessage] = useState("");
    const [selectedChat, setSelectedChat] = useState(null)

    const updateChatList = () => {
        getChats().then((response) => {
            if (response.success) {
                setChatList(response.data);
                console.log(response.data);
            } else {
                //show error message or do whatever
            }
        })
    }

    if (chatList == null) {
        updateChatList();
    }

    const handleCreateChat = (data) => {
        setShowNewChatModal(false);
        console.log(data);
        addPrivateChat(data.id).then(() => {
            updateChatList();
        })
    }

    const logoutHandler = () => {
        logout().then(() => {
            navigate("/")
        })
    }

    const sendMessageHandler = (e) => {
        e.preventDefault();
        console.log(message)
        setMessage("");
    }

    return <>
        <Sidebar>
            <SidebarGroup>
                <h1>Pigon</h1>
            </SidebarGroup>
            <Spacer />
            <SidebarGroup style={{ flexGrow: 1, gap: "1rem", overflow: "auto" }}>
                {/* Chat list */}
                <h1>Chats</h1>
                <input style={{ width: "auto" }} type="text" placeholder="Search chats" />
                {chatList ? chatList.map(chat => <User onClick={() => { setSelectedChat(chat); setMessage("") }} key={chat.id} username={chat.name} id={removeFromArray(chat.participants, userInfo.id)[0]} />) : ""}
            </SidebarGroup>
            <Spacer />
            <SidebarGroup className="sidebar-bottom horizontal">
                <SidebarItem>
                    <CgLogOut onClick={logoutHandler} className="sidebar-button" />
                </SidebarItem>
                <SidebarItem>
                    <CgLaptop className="sidebar-button" />
                </SidebarItem>
                <SidebarItem>
                    <CgAdd className="sidebar-button" onClick={() => { setShowNewChatModal(true) }}></CgAdd>
                </SidebarItem>
            </SidebarGroup>
        </Sidebar>
        <div className="chat">
            <div className="chat-header">
                {selectedChat ? <User style={{ height: "100%", backgroundColor: "transparent", padding: "0px", marginLeft: "1rem" }} username={selectedChat.name} id={removeFromArray(selectedChat.participants, userInfo.id)[0]} /> : ""}
            </div>
            <div className="chat-content"></div>
            {selectedChat ? <div className="chat-messagebox">
                <form onSubmit={sendMessageHandler} autoComplete="off">
                    <input type="text" name="message" id="message" value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder="Message" />
                    <RiSendPlane2Fill id="sendIcon" />
                </form>
            </div> : ""}
        </div>

        {showNewChatModal ? <NewChatModal onResult={handleCreateChat} onClose={() => { setShowNewChatModal(false) }} /> : ""}
    </>
}

export default App;