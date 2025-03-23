import { useEffect, useState } from "react";
import { Sidebar, SidebarGroup, SidebarItem, Spacer } from "./components/Sidebar";
import { CgAdd, CgImage, CgLaptop, CgLogOut } from "react-icons/cg"
import NewChatModal from "./components/NewChatModal";
import { checkIfLoggedIn, getUserInfo, logout } from "./utils/auth";
import { useNavigate } from "react-router";
import { addPrivateChat, getChats, getMessages, selectAndSend, sendFile, sendMessage } from "./utils/chat/chat";
import User from "./components/User";
import removeFromArray from "./utils/removeFromArray";
import { RiSendPlane2Fill } from "react-icons/ri";
import "./styles/app.css"
import Message from "./components/Message";
import socket from "./utils/chat/socket";

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
    const [messages, setMessages] = useState(null);

    //handling incoming messages
    const msgHandler = (data) => {
        data = JSON.parse(data)
        if (selectedChat != null) {
            if (data.chatID == selectedChat.chatid) {
                data.date = new Date().toISOString();
                data.senderid = data.senderID;
                data.username = data.senderName;
                delete data["senderID"]
                delete data["senderName"]
                data.message = JSON.stringify(data.message)
                console.log("Message:", data)
                setMessages([data, ...messages])
            }
        }
    }

    useEffect(() => {
        socket.on("message", msgHandler)

        return () => {
            socket.off("message", msgHandler)
        }
    })

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

        if (message.trim() != "") {
            setMessage("");
            console.log(message)
            sendMessage(selectedChat.chatid, message, "text");
        }
    }

    const selectChatHandler = (chat) => {
        console.log(chat)
        setSelectedChat(chat);
        setMessage("");
        getMessages(chat.chatid).then((result) => {
            console.log(result)
            setMessages(result)
        }).catch((err) => {
            console.error(err)
        })
    }

    return <>
        <Sidebar>
            <SidebarGroup>
                <h1>Pigon</h1>
                <span>Logged in as: {userInfo.username}</span>
            </SidebarGroup>
            <Spacer />
            <SidebarGroup style={{ flexGrow: 1, gap: "1rem", overflow: "auto" }}>
                {/* Chat list */}
                <h1>Chats</h1>
                <input style={{ width: "auto" }} type="text" placeholder="Search chats" />
                {chatList ? chatList.map(chat => <User className={`sidebar-user ${selectedChat? (selectedChat.chatid == chat.chatid? "focused": ""): ""}`} onClick={() => { selectChatHandler(chat) }} key={chat.id} username={chat.name} id={removeFromArray(chat.participants, userInfo.id)[0]} />) : ""}
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
            {selectedChat ?
                <div className="chat-header">
                    <User style={{ height: "100%", backgroundColor: "transparent", padding: "0px", marginLeft: "1rem" }} username={selectedChat.name} id={removeFromArray(selectedChat.participants, userInfo.id)[0]} />
                </div> : ""}
            <div className="chat-content">
                {
                messages? messages.map((message) => <Message senderId={message.senderid} senderName={message.username} type={JSON.parse(message.message).type} content={JSON.parse(message.message).content} />): ""}
            </div>
            {selectedChat ? <div className="chat-messagebox">
                <form onSubmit={sendMessageHandler} autoComplete="off">
                    <CgImage className="sendIcon" onClick={() => {selectAndSend(selectedChat.chatid)}} />
                    <input type="text" name="message" id="message" value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder="Message" />
                    <input type="submit" id="sendmsg" style={{ display: "none" }}></input>
                    <label htmlFor="sendmsg">
                        <RiSendPlane2Fill className="sendIcon" />
                    </label>
                </form>
            </div> : ""}
        </div>

        {showNewChatModal ? <NewChatModal onResult={handleCreateChat} onClose={() => { setShowNewChatModal(false) }} /> : ""}
    </>
}

export default App;