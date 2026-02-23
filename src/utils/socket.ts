// utils/socket.ts
import { io, type Socket } from 'socket.io-client';

export const socket: Socket = io(import.meta.env.VITE_APP_CHAT_API, {
    withCredentials: true,
    autoConnect: false, // Chỉ kết nối khi cần
});

export const connectSocket = (): void => {
    if (!socket.connected) socket.connect();
};

export const disconnectSocket = (): void => {
    if (socket.connected) socket.disconnect();
};
