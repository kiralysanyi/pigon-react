import { io } from "socket.io-client";
import { BASEURL } from "../../config";
const socket = io(new URL(BASEURL).host, {path: "/socketio", withCredentials: true});

socket.on("connect", (data) => {
    console.log("Connected: ", data)
})

socket.on("disconnect", (data) => {
    console.log("Disconnected: ", data)
})

socket.on("error", (data) => {
    console.log("Error: ", data)
})

socket.connect();

export default socket;