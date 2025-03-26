import { Fragment, useEffect, useState } from "react";
import { getUserInfo } from "../utils/auth";
import BasicModal from "./BasicModal";
import { Spacer } from "./Sidebar";
import User from "./User";
import Confirm from "./Confirm";
import { deleteGroup, leaveGroup } from "../utils/chat/chat";
const userInfo = (await getUserInfo())["data"];

/**
 * 
 * @param {number[]} participantIds Array containing participant ids
 * @returns {Promise<Array>} An array of fetched userinfo (promise)
 */
function participantsInfoFetcher(participantIds) {
    return new Promise(async (resolved, rejected) => {
        let infoArray = [];
        for (let i in participantIds) {
            try {
                let data = (await getUserInfo(participantIds[i]))["data"];
                data["id"] = participantIds[i];
                infoArray.push(data)
            } catch (error) {
                console.log(error)
                rejected(error)
            }
        }
        resolved(infoArray);
    });
}

let confirmTitle, confirmContent, confirmCallback = null;

function GroupManager({ chatInfo, onLeave = () => { }, onClose = () => { } }) {
    const [showConfirm, setShowConfirm] = useState(false);

    const isAdmin = chatInfo.initiator == userInfo.id;
    const [participants, setParticipants] = useState(null)
    useEffect(() => {
        (async () => {
            let data = await participantsInfoFetcher(chatInfo.participants)
            setParticipants(data)
        })()
        return () => { }
    }, [])

    const deleteGroupHandler = () => {
        confirmCallback = () => {
            confirmCallback = null;

            deleteGroup(chatInfo.chatid).then((result) => {
                console.log(result)
                setShowConfirm(false);
                onLeave();
            }).catch((err) => {
                console.error(err);
                setShowConfirm(false);
            })
        }
        confirmTitle = "Delete group"
        confirmContent = "Do you really want to delete this group with all of it's content?";
        setShowConfirm(true)
    }

    const leaveGroupHandler = () => {
        confirmCallback = () => {
            confirmCallback = null;

            leaveGroup(chatInfo.chatid).then((result) => {
                console.log(result)
                setShowConfirm(false);
                onLeave();
            }).catch((err) => {
                console.error(err);
                setShowConfirm(false);
            })
        }
        confirmTitle = "Leave group"
        confirmContent = "Do you really want to leave this group?";
        setShowConfirm(true)
    }

    return <BasicModal style={{ width: "80%", height: "80%" }} title={"Group: " + chatInfo.name} onClose={onClose}>
        <div className="form groupmodal" style={{ position: "relative", transform: "none", top: "0px", left: "0px", backdropFilter: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h2>Participants</h2>
            <div className="participants">
                {participants ? participants.map((participant) => <User key={participant["id"]} id={participant.id} username={participant.username} />) : ""}
            </div>

            {isAdmin ? <Fragment>
                <h2>Add participants</h2>
                <input type="text" placeholder="Search users" />
                <div></div>
            </Fragment> : ""}
            <Spacer />
            <div>
                {isAdmin ? <Fragment>
                    <input type="button" onClick={deleteGroupHandler} value="Delete group" className="btn-danger" />
                </Fragment> : <input onClick={leaveGroupHandler} type="button" value="Leave group" className="btn-danger" />}
            </div>
        </div>

        {showConfirm ? <Confirm content={confirmContent} title={confirmTitle} onConfirm={() => { confirmCallback ? confirmCallback() : null }} onCancel={() => { setShowConfirm(false) }} /> : ""}
    </BasicModal>
}

export default GroupManager;