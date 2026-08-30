import { io } from "socket.io-client";

let socket = null;

export function createSocket(token) {
  if (socket) {
    socket.auth = { token };

    if (!socket.connected) {
      socket.connect();
    }
    return socket;
  }

  socket = io("http://192.168.1.2:3000", {
    transports: ["websocket"],
    auth: {
      token,
    },
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
