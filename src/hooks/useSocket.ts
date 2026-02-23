import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SocketCallback<T = any> = (data: T) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSocket = <T = any>(event?: string, callback?: SocketCallback<T>) => {
    const context = useContext(SocketContext);

    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }

    const { socket } = context;

    useEffect(() => {
        if (event && callback) socket.on(event, callback);

        return () => {
            socket.off(event, callback);
        };
    }, [event, callback, socket]);

    return context;
};
