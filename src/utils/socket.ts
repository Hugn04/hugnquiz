// utils/socket.ts
import { io, type Socket } from 'socket.io-client';

export const socket: Socket = io('', {
    withCredentials: true,
    autoConnect: false, // Chỉ kết nối khi cần
});

export const connectSocket = (): void => {
    if (!socket.connected) socket.connect();
};

export const disconnectSocket = (): void => {
    if (socket.connected) socket.disconnect();
};
