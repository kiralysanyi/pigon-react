import { useState } from "react";
import { searchUsers } from "../utils/chat/chat";
import "../styles/modal.css"
import { CgClose } from "react-icons/cg";
import User from "./User";

function NewChatModal({ onClose = () => { }, onResult = (result) => { } }) {
    const [searchResults, setSearchResults] = useState([])

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

    return <>
        <div className="modal-container">
            <div className="modal">
                <div className="modal-header">
                    <h1>New chat</h1>
                    <input type="text" name="username" id="username" placeholder="Search users" onChange={handleSearchInputChange} />
                    <CgClose className="modal-close" onClick={onClose} />
                </div>
                <div className="modal-content">
                    <div className="modal-search-results">
                        {
                            searchResults.map(result => <User onClick={() => {onResult(result)}} key={result.id} username={result.username} id={result.id} />)
                        }
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default NewChatModal;