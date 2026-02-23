// context/SocketProvider.tsx
import { createContext } from 'react';
import { socket } from '../utils/socket';

// Định nghĩa type cho giá trị context
interface SocketContextType {
    socket: typeof socket;
    isConnected: boolean;
}

// Khởi tạo context với type
export const SocketContext = createContext<SocketContextType | undefined>(undefined);
