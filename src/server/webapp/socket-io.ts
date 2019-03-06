import socketIo from "socket.io-client";

const io: SocketIOClient.Socket = socketIo('localhost:8081');

export default io;