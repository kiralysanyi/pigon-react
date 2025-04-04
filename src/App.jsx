import { useEffect, useRef, useState } from "react";
import { Sidebar, SidebarGroup, SidebarItem, Spacer } from "./components/Sidebar";
import { CgAdd, CgClose, CgImage, CgLaptop, CgLogOut, CgMenu } from "react-icons/cg"
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
import Chat from "./components/Chat";

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
    const [showGroupManager, setShowGroupManager] = useState(false);

    const [sidebarToggle, setSidebarToggle] = useState(false);

    //handling incoming messages
    const msgHandler = (data) => {
        console.log("Incoming: ", data)
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
                socket.emit("setLastRead", {
                    chatID: data.chatID,
                    messageID: data.messageID
                });
                setMessages([data, ...messages])
            }
        }

        setChatList(prevChats => {
            const updatedChats = prevChats.map(chat =>
                chat.chatid === data.chatID
                    ? { ...chat, hasUnreadMessages: true, lastInteraction: new Date().toISOString() }
                    : chat
            );

            return [...updatedChats].sort((a, b) => new Date(b.lastInteraction) - new Date(a.lastInteraction));
        });
    }

    const updateChatList = () => {
        getChats().then((response) => {
            if (response.success) {
                setChatList(response.data);
                console.log(response)
            } else {
                console.error(response)
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

    const [page, setPage] = useState(1);
    const [reachedLastPage, setReachedLastPage] = useState(false);


    const selectChatHandler = (chat) => {
        setReachedLastPage(false);
        setPage(1);
        console.log(chat)
        setSelectedChat(chat);
        setMessage("");
        updateChatList();
        getMessages(chat.chatid).then((result) => {
            console.log(result)
            setMessages(result)
        }).catch((err) => {
            console.error(err)
        })
    }



    const scrollHandler = (e) => {
        if (reachedLastPage) {
            return;
        }
        console.log(e.currentTarget.scrollTop * -1, e.currentTarget.scrollHeight - 1500)
        if (e.currentTarget.scrollTop * -1 > e.currentTarget.scrollHeight - 1500) {
            console.log("EEEE")
            setPage(page + 1);
            getMessages(selectedChat.chatid, page + 1).then((result) => {
                if (result.length == 0) {
                    setReachedLastPage(true);
                    return;
                }
                console.log(result)
                setMessages(messages.concat(result))
            }).catch((err) => {
                console.error(err)
            })
        }
    }

    console.log(messages)

    return <>
        <button onClick={() => { sidebarToggle ? setSidebarToggle(false) : setSidebarToggle(true); }} className="block fixed top-0 left-0 w-16 h-16 z-49 bg-white dark:bg-black/40 backdrop-blur-lg dark:text-white lg:hidden">
            {/* open sidebar, only show in mobile view */}
            <CgMenu className="w-full h-full p-3"/>
        </button>
        <Sidebar hide={sidebarToggle}>
            <SidebarGroup>
                <h1 className="text-3xl">Pigon</h1>
                <button onClick={() => { setSidebarToggle(true) }} className="block absolute top-0 right-0 w-10 h-10 z-49 bg-transparent dark:text-white lg:hidden">
                    {/* close sidebar, only show in mobile view */}
                    <CgClose className="w-full h-full p-1" />
                </button>
                <Spacer />
                <SidebarGroup className="horizontal">

                    {userInfo ? <User onClick={() => { navigate("/settings") }} id={userInfo.id} username={userInfo.username} /> : ""}
                </SidebarGroup>
            </SidebarGroup>
            <Spacer />
            <SidebarGroup style={{ flexGrow: 1, gap: "1rem", overflow: "auto" }}>
                <h1 className="text-3xl">Chats</h1>
                <input style={{ width: "auto" }} type="text" placeholder="Search chats" />
                {chatList ? chatList.map(chat => <Chat unread={chat.hasUnreadMessages} groupmode={chat.groupchat} className={`sidebar-user ${selectedChat ? (selectedChat.chatid == chat.chatid ? "focused" : "") : ""}`} onClick={() => { selectChatHandler(chat); setSidebarToggle(true) }} key={chat.chatid} chatname={chat.name} pfpid={removeFromArray(chat.participants, userInfo.id)[0]} />) : ""}
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
                    <Chat groupmode={selectedChat ? selectedChat.groupchat : null} onClick={() => { selectedChat.groupchat == 1 ? setShowGroupManager(true) : null }} style={{ height: "100%", backgroundColor: "transparent", padding: "0px", marginLeft: "1rem" }} chatname={selectedChat.name} pfpid={removeFromArray(selectedChat.participants, userInfo.id)[0]} />
                </div> : ""}
            <div className="chat-content" onScroll={scrollHandler}>
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
                        key={message.messageID}
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