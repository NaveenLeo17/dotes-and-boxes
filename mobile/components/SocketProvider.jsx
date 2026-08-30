import { createContext, useContext, useEffect, useState } from "react";
import { AppState } from "react-native";
import { useAuth } from "@clerk/expo";

import { createSocket, disconnectSocket } from "../services/socket.js";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  const { isSignedIn, getToken } = useAuth();

  const [socket, setSocket] = useState(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    let activeSocket = null;
    let appStateSubscription = null;

    async function connectSocket() {
      try {
        if (!isSignedIn) {
          disconnectSocket();
          setSocket(null);
          setIsSocketConnected(false);
          return;
        }

        const token = await getToken();

        if (!token) {
          console.log("No Clerk token available");
          return;
        }

        activeSocket = createSocket(token);

        activeSocket.on("connect", () => {
          console.log("Socket Connected:", activeSocket.id);
          setIsSocketConnected(true);
        });

        activeSocket.on("disconnect", (reason) => {
          console.log("Socket Disconnected:", reason);
          setIsSocketConnected(false);
        });

        activeSocket.on("connect_error", (err) => {
          console.log("Socket Error:", err.message);
          setIsSocketConnected(false);
        });

        setSocket(activeSocket);

        // Reconnect when app comes back to foreground
        appStateSubscription = AppState.addEventListener(
          "change",
          async (nextState) => {
            if (nextState === "active") {
              console.log("App became active");

              if (!activeSocket.connected) {
                console.log("Socket disconnected. Reconnecting...");

                const newToken = await getToken();

                activeSocket.auth = {
                  token: newToken,
                };

                activeSocket.connect();
              }
            }
          },
        );
      } catch (error) {
        console.log("Socket Connection Failed:", error);
      }
    }

    connectSocket();

    return () => {
      if (activeSocket) {
        activeSocket.off("connect");
        activeSocket.off("disconnect");
        activeSocket.off("connect_error");
      }

      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
  }, [isSignedIn]);

  return (
    <SocketContext.Provider value={{ socket, isSocketConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}
