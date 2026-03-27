import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/auth.store';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: ReactNode;
}

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const { accessToken } = useAuthStore();

  const socketRef = useRef<Socket | null>(null);
  const hasConnected = useRef(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {

    if (!accessToken) {
      if (socketRef.current) {
        console.log("[Socket] Disconnecting (logout)");
        socketRef.current.disconnect();
        socketRef.current = null;
        hasConnected.current = false;
      }
      setIsConnected(false);
      return;
    }

    if (hasConnected.current) {
      console.log("[Socket] Already initialized, skipping...");
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: { token: accessToken },
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 20000,
      autoConnect: true,
    });

    socketRef.current = socket;
    hasConnected.current = true;

    socket.on("connect", () => {
      console.log("[Socket] Connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket] Disconnected:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket] Connection Error:", error.message);
    });

    socket.on("reconnect_attempt", (attempt) => {
      console.log("[Socket] Reconnect attempt:", attempt);
    });

    socket.on("reconnect", () => {
      console.log("[Socket] Reconnected");
    });

    return () => {
      console.log("[Socket] Cleanup skipped (preventing unwanted disconnect)");
    };
  }, [accessToken]); 

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};