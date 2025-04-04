import { useEffect, useState } from "react";
import { createGroupChat, searchUsers } from "../utils/chat/chat";
import BasicModal from "./BasicModal";
import User from "./User";
import { getUserInfo } from "../utils/auth";
import removeFromArray from "../utils/removeFromArray";

const userInfo = (await getUserInfo())["data"];

function NewGroupModal({ onCancel, onCreate }) {
    const [searchResults, setSearchResults] = useState([])
    const [participants, setParticipants] = useState([{ id: userInfo.id, username: userInfo.username, registerDate: userInfo.registerDate }]);
    const [chatName, setChatName] = useState("");
    console.log("Participants: ", participants)


    const handleSearchInputChange = async (e) => {
        const query = e.target.value;
        searchUsers(query).then((results) => {
            console.log(results)
            setSearchResults(results)
        }).catch((err) => {
            console.error(err);
            window.alert(err);
        })
    }

    const addUserHandler = (user) => {
        if (participants.includes(user)) {
            return;
        }
        setParticipants([user, ...participants])
    }

    const removeUserHandler = (user) => {
        if (user.id == userInfo.id) {
            return;
        }
        setParticipants(removeFromArray(participants, user))
    }

    const createGroupHandler = () => {
        if (chatName.trim() == "") {
            console.log("Chatname is empty")
            //display some error
            return;
        }

        let participantIds = []

        for (let i in participants) {
            participantIds.push(participants[i]["id"])
        }

        createGroupChat(chatName, participantIds).then((result) => {
            console.log(result)
            onCreate();

        }).catch((err) => {
            console.error(err);
        })
    }


    return <BasicModal onClose={onCancel} title="New Group">
        <div className="groupmodal" style={{ position: "relative", transform: "none", top: "0px", left: "0px", backdropFilter: "none" }}>
            <h2>Group</h2>
            <input className="input" value={chatName} onChange={(e) => { setChatName(e.target.value) }} type="text" placeholder="Name of the group"></input>
            <h2>Added participants</h2>
            <div className="participants">
                {
                    participants.map(result => <User className="sidebar-user" onClick={() => { removeUserHandler(result) }} key={result.id} username={result.username} id={result.id} />)
                }
            </div>
            <input className="btn" type="button" value="Create" onClick={createGroupHandler} />
            <h2>Search</h2>
            <input className="input" onChange={handleSearchInputChange} type="text" placeholder="Search users" />
            <div className="modal-search-results">
                {
                    searchResults.map(result => result.id != userInfo.id ? <User className="sidebar-user" onClick={() => { addUserHandler(result) }} key={result.id} username={result.username} id={result.id} /> : "")
                }
            </div>
        </div>
    </BasicModal>
}

export default NewGroupModal;