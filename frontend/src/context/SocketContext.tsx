import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
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
  const { userId, isAuthenticated } = useAuthStore();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    console.log('[SocketContext] Auth State:', { isAuthenticated, userId });
    
    if (isAuthenticated && userId) {
      console.log('[SocketContext] Attempting to connect to socket server at http://localhost:8008');
      const newSocket = io(SOCKET_URL, {
        query: { userId },
      });

      newSocket.on('connect', () => {
        setIsConnected(true);
        console.log('[SocketContext] Socket connected successfully! ID:', newSocket.id);
      });

      newSocket.on('connect_error', (error) => {
        console.error('[SocketContext] Socket connection error:', error);
      });

      newSocket.on('disconnect', (reason) => {
        setIsConnected(false);
        console.log('[SocketContext] Socket disconnected. Reason:', reason);
      });

      console.log('[SocketContext] Socket instance created:', newSocket);
      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    } else {
      setSocket(null);
      setIsConnected(false);
    }
  }, [isAuthenticated, userId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
