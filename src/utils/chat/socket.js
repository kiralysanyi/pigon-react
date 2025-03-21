import { io } from "socket.io-client";
import { BASEURL } from "../../config";
const socket = io(new URL(BASEURL).host, {path: "/socketio"});

export default socket;