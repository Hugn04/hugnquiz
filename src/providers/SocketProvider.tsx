import { useEffect, useState, type ReactNode } from 'react';
import { disconnectSocket, socket } from '../utils/socket';
import { SocketContext } from '../context/SocketContext';

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
