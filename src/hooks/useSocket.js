import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';

export const useSocket = (event, callback) => {
    const context = useContext(SocketContext);
    if (!context) throw new Error('useSocket must be used within a SocketProvider');

    useEffect(() => {
        const { socket } = context;

        socket.on(event, callback);

        return () => {
            socket.off(event, callback);
        };
    }, [event, callback, context]);

    return context;
};
