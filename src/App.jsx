import { useState } from "react";
import { Sidebar, SidebarGroup, SidebarItem, Spacer } from "./components/Sidebar";
import { CgAdd, CgLaptop, CgLogOut } from "react-icons/cg"
import NewChatModal from "./components/NewChatModal";
import { checkIfLoggedIn, getUserInfo, logout } from "./utils/auth";
import { useNavigate } from "react-router";
import { addPrivateChat, getChats } from "./utils/chat/chat";
import User from "./components/User";
import removeFromArray from "./utils/removeFromArray";

const userInfo = (await getUserInfo())["data"];

function App() {
    const navigate = useNavigate();
    checkIfLoggedIn().then((isLoggedIn) => {
        if (!isLoggedIn) {
            navigate("/login")
        }
    })

    document.title = "Pigon"
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [chatList, setChatList] = useState(null);

    if (chatList == null) {
        getChats().then((response) => {
            if (response.success) {
                setChatList(response.data);
                console.log(response.data);
            } else {
                //show error message or do whatever
            }
        })
    }

    const handleCreateChat = (data) => {
        setShowNewChatModal(false);
        console.log(data);
        addPrivateChat(data.id).then((result) => {
            console.log(result)
        })
    }

    const logoutHandler = () => {
        logout().then(() => {
            navigate("/")
        })
    }

    return <>
        <Sidebar>
            <SidebarGroup>
                <h1>Pigon</h1>
            </SidebarGroup>
            <Spacer />
            <SidebarGroup style={{ flexGrow: 1 }}>
                {/* Chat list */}
                <h1>Chats</h1>
                <input style={{ width: "auto" }} type="text" placeholder="Search chats" />
                {chatList? chatList.map(chat => <User key={chat.id} username={chat.name} id={removeFromArray(chat.participants, userInfo.id)[0]}/>): ""}
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
            <div className="chat-header"></div>
            <div className="chat-content"></div>
            <div className="chat-messagebox"></div>
        </div>

        {showNewChatModal ? <NewChatModal onResult={handleCreateChat} onClose={() => { setShowNewChatModal(false) }} /> : ""}
    </>
}

export default App;