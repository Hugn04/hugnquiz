import classNames from 'classnames/bind';
import 'react-toastify/ReactToastify.min.css';

import styles from './MessagePage.module.scss';
import Conversation from '../../components/Conversation';
import MessageBox from '../../components/MessageBox';
import { useEffect, useState } from 'react';
import { useSocket } from '../../hooks/useSocket';
import { useDispatch } from 'react-redux';
import { newMessage } from '../../redux/slices/messageSlice';
import { connectSocket } from '../../utils/socket';

const cx = classNames.bind(styles);
function MessagePage() {
    const [openMessage, setOpenMessage] = useState(false);
    const classes = { open: openMessage };
    const dispatch = useDispatch();
    const { socket } = useSocket('message', ({ message }) => {
        dispatch(newMessage(message));
    });
    useEffect(() => {
        connectSocket();
        socket.emit('join-room');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('message', classes)}>
                <MessageBox setOpenMessage={setOpenMessage}></MessageBox>
            </div>
            <div className={cx('conversation', classes)}>
                <Conversation setOpenMessage={setOpenMessage}></Conversation>
            </div>
        </div>
    );
}

export default MessagePage;
