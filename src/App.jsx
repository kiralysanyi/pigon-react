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
import MediaViewer from "./components/MediaViewer";
import { BASEURL } from "./config";
import BasicModal from "./components/BasicModal";
import DeviceList from "./components/DeviceList";
import { MdPeopleAlt } from "react-icons/md";
import NewGroupModal from "./components/NewGroupModal";
import GroupManager from "./components/GroupManager";

const userInfo = (await getUserInfo())["data"];
let mediaSource, mediaType = null;


function App() {
    const navigate = useNavigate();

    useEffect(() => {
        checkIfLoggedIn().then((result) => {
            if (result == false) {
                navigate("/login")
            }
        })
    }, [])

    document.title = "Pigon"

    //modals
    const [showNewChatModal, setShowNewChatModal] = useState(false);
    const [showDevicesModal, setShowDevicesModal] = useState(false);



    const [chatList, setChatList] = useState(null);
    const [message, setMessage] = useState("");
    const [selectedChat, setSelectedChat] = useState(null)
    const [messages, setMessages] = useState(null);
    const [showMediaViewer, setShowMediaViewer] = useState(false);
    const [showNewGroupModal, setShowNewGroupModal] = useState(false);
    const [showGroupManager, setShowGroupManager] = useState(false)

    //handling incoming messages
    const msgHandler = (data) => {
        try {
            data = JSON.parse(data)
        } catch (error) {
            console.error(error)
            return;
        }

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

    const newChatHandler = () => {
        updateChatList();
        //maybe notify the user? idk, I will do it later.
    }


    useEffect(() => {
        socket.on("message", msgHandler)
        socket.on("newchat", newChatHandler)

        return () => {
            socket.off("message", msgHandler)
            socket.off("newchat", newChatHandler)
        }
    })



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
                <Spacer />
                <SidebarGroup className="horizontal">

                    {userInfo ? <User onClick={() => { navigate("/settings") }} id={userInfo.id} username={userInfo.username} /> : ""}
                </SidebarGroup>
            </SidebarGroup>
            <Spacer />
            <SidebarGroup style={{ flexGrow: 1, gap: "1rem", overflow: "auto" }}>
                {/* Chat list */}
                <h1>Chats</h1>
                <input style={{ width: "auto" }} type="text" placeholder="Search chats" />
                {chatList ? chatList.map(chat => <User className={`sidebar-user ${selectedChat ? (selectedChat.chatid == chat.chatid ? "focused" : "") : ""}`} onClick={() => { selectChatHandler(chat) }} key={chat.id} username={chat.name} id={removeFromArray(chat.participants, userInfo.id)[0]} />) : ""}
            </SidebarGroup>
            <Spacer />
            <SidebarGroup className="sidebar-bottom horizontal">
                <SidebarItem>
                    <CgLogOut onClick={logoutHandler} className="sidebar-button" />
                </SidebarItem>
                <SidebarItem>
                    <CgLaptop className="sidebar-button" onClick={() => { setShowDevicesModal(true) }} />
                </SidebarItem>
                <SidebarItem>
                    <CgAdd className="sidebar-button" onClick={() => { setShowNewChatModal(true) }}></CgAdd>
                </SidebarItem>
                <SidebarItem>
                    <MdPeopleAlt onClick={() => { setShowNewGroupModal(true) }} className="sidebar-button" />
                </SidebarItem>
            </SidebarGroup>
        </Sidebar>
        <div className="chat">
            {selectedChat ?
                <div className="chat-header">
                    <User onClick={() => { selectedChat.groupchat == 1 ? setShowGroupManager(true) : null }} style={{ height: "100%", backgroundColor: "transparent", padding: "0px", marginLeft: "1rem" }} username={selectedChat.name} id={removeFromArray(selectedChat.participants, userInfo.id)[0]} />
                </div> : ""}
            <div className="chat-content">
                {
                    messages ? messages.map((message) => <Message
                        onClick={() => {
                            let msg = JSON.parse(message.message);
                            if (msg.type == "image" || msg.type == "video") {
                                mediaSource = BASEURL + msg.content
                                mediaType = msg.type;
                                setShowMediaViewer(true);
                            }
                        }}
                        date={message.date}
                        senderId={message.senderid}
                        senderName={message.username}
                        type={JSON.parse(message.message).type}
                        content={JSON.parse(message.message).content}
                    />) : ""}
            </div>
            {selectedChat ? <div className="chat-messagebox">
                <form onSubmit={sendMessageHandler} autoComplete="off">
                    <CgImage className="sendIcon" onClick={() => { selectAndSend(selectedChat.chatid) }} />
                    <input type="text" name="message" id="message" value={message} onChange={(e) => { setMessage(e.target.value) }} placeholder="Message" />
                    <input type="submit" id="sendmsg" style={{ display: "none" }}></input>
                    <label htmlFor="sendmsg">
                        <RiSendPlane2Fill className="sendIcon" />
                    </label>
                </form>
            </div> : ""}
        </div>

        {showNewChatModal ? <NewChatModal onResult={handleCreateChat} onClose={() => { setShowNewChatModal(false) }} /> : ""}

        {showMediaViewer ? <MediaViewer type={mediaType} url={mediaSource} onClose={() => { setShowMediaViewer(false) }} /> : ""}

        {/* Devices modal */}

        {showDevicesModal ? <BasicModal title="Devices" onClose={() => { setShowDevicesModal(false) }}>
            <DeviceList />
        </BasicModal> : ""}

        {showNewGroupModal ? <NewGroupModal onCreate={() => { setShowNewGroupModal(false); updateChatList() }} onCancel={() => { setShowNewGroupModal(false) }} /> : ""}

        {showGroupManager ? <GroupManager chatInfo={selectedChat} onClose={() => { setShowGroupManager(false); updateChatList(); }} onLeave={() => { setShowGroupManager(false); updateChatList(); setSelectedChat(null); setMessages(null); setMessage(null) }} /> : ""}
    </>
}

export default App;