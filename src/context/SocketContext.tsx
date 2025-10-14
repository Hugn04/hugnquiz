// context/SocketProvider.tsx
import { createContext, useEffect, useState, type ReactNode } from 'react';
import { socket, disconnectSocket } from '../utils/socket';

// Định nghĩa type cho giá trị context
interface SocketContextType {
    socket: typeof socket;
    isConnected: boolean;
}

// Khởi tạo context với type
const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Props cho SocketProvider
interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));

        return () => {
            disconnectSocket();
        };
    }, []);

    return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};
