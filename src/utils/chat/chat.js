import { BASEURL } from "../../config";
import { getUserInfo } from "../auth";
import socket from "./socket";

let userinfo = (await getUserInfo()).data;



function createchat({ isGroupChat, chatName, participants }) {
    return new Promise((resolved, rejected) => {
        /*
        Body
        {
            isGroupChat: true/false,
            chatName: "aaa" //only required if isGroupChat = true
            participants: [] //array of userIDs
        }
        */

        fetch(BASEURL + "/api/v1/chat/create", {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                isGroupChat, chatName, participants
            })
        }).then(async (res) => {
            let response = await res.json()
            console.log(response);
            if (response.success == true) {
                resolved();
            } else {
                rejected(new Error(response.message));
            }
        }).catch((err) => {
            rejected(err);
        })
    });

}

function addPrivateChat(userid) {
    return new Promise((resolved, rejected) => {
        console.log(userinfo);
        let data = {
            isGroupChat: false,
            chatName: "",
            participants: [userinfo.id, userid]
        }

        console.log(data);
        createchat(data).then(() => {
            //successfully created chat
            console.log("Successfully created chat!!!!!!!!!!!");
            resolved();
        }).catch((err) => {
            console.error(err);
            rejected(err);
        })
    })

}

async function sendFile(file, type, chatid) {
    const formData = new FormData();

    // Append the file to the FormData object
    formData.append('file', file);
    formData.append("chatid", chatid);
    try {
        // Make the POST request to your server's upload endpoint
        const response = await fetch(BASEURL + '/api/v1/chat/cdn', {
            method: 'POST',
            credentials: "include",
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();
            sendMessage(chatid, "/api/v1/chat/cdn?filename=" + result["filename"], type);
        } else {
            window.alert(`Error uploading file: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Upload failed:', error);
        window.alert(`Failed to upload file`);
    }
}

/**
 * 
 * @param {number} chatID 
 * @param {*} content 
 * @param {string} type possible options: text, image, video
 */
let sendMessage = (chatID, content, type = "text") => {
    let message = {
        type,
        content
    }
    socket.emit("message", { chatID, message });
}

function searchUsers(query) {
    return new Promise((resolved, rejected) => {
        fetch(BASEURL + "/api/v1/auth/search?" + new URLSearchParams({ search: query }).toString(), {
            method: "GET",
            credentials: "include"
        }).then(async (response) => {
            let res = await response.json()
            if (res.success == false) {
                rejected(new Error(res.message))
                return;
            }
            resolved(res["data"]);
        }).catch((error) => {
            rejected(error)
        })
    });

}

/**
 * 
 * @param {string} chatName 
 * @param {Array} participants Array of participants (userid)
 * @returns 
 */
function createGroupChat(chatName, participants) {
    return new Promise((resolved, rejected) => {
        let data = {
            isGroupChat: true,
            chatName,
            participants
        }

        console.log(data);
        createchat(data).then(() => {
            //successfully created chat
            console.log("Successfully created chat!!!!!!!!!!!");
            resolved();
        }).catch((err) => {
            console.error(err)
            window.alert(err)
            rejected(err);
        })
    });
}

/**
 * 
 * @param {number} chatid ID of the chat
 * @param {number} page Page number default = 1
 */
async function getMessages(chatid, page = 1) {
    return new Promise((resolved, rejected) => {
        fetch(BASEURL + "/api/v1/chat/messages?chatid=" + chatid + "?page=" + page, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(async (result) => {
            resolved(await result.json())
        }).catch((err) => {
            rejected({
                success: false,
                message: err
            })
        })
    });

}

async function getChats() {
    let response = await fetch(BASEURL + "/api/v1/chat/chats", {
        method: "GET",
        credentials: "include"
    });

    response = await response.json();
    console.log(response);

    if (response.success == true) {
        return response;
    } else {
        console.error(response)
        return response;
    }
}

async function selectAndSend(chatid) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpg, image/jpeg, image/png, video/mp4, video/webm";
    fileInput.addEventListener("change", (event) => {
        let type = null;
        if (fileInput.files[0].type.includes("video")) {
            type = "video";
        }

        if (fileInput.files[0].type.includes("image")) {
            type = "image"
        }

        if (type == null) {
            console.error("Unknown filetype");
            window.alert("Unknown filetype");
            return;
        }

        sendFile(fileInput.files[0], type, chatid);
    });
    fileInput.click();
}

function deleteGroup(chatID) {
    return new Promise((resolved, rejected) => {
        fetch(BASEURL + "/api/v1/chat/group",
            {
                method: "DELETE",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatid: chatID })
            }).then(async (res) => {
                let response = await res.json();
                if (response.success == false) {
                    rejected(response)
                    return;
                }

                if (response.success == true) {
                    resolved(response)
                }
            });
    })

}

function leaveGroup(chatID) {
    return new Promise((resolved, rejected) => {
        fetch(BASEURL + "/api/v1/chat/leave", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ chatid: chatID })
        }).then(async (res) => {
            let response = await res.json();
            if (response.success == false) {
                rejected(response)
                return;
            }

            if (response.success == true) {
                resolved(response)
            }
        }).catch((err) => {
            console.error(err);
            rejected(err);
        })
    })
}

export { addPrivateChat, sendFile, sendMessage, searchUsers, createGroupChat, getChats, getMessages, selectAndSend, deleteGroup, leaveGroup }