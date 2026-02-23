import classNames from 'classnames/bind';
import styles from './MessageBox.module.scss';

import React, { useEffect, useRef, useState } from 'react';
import Button from '../Button';

import { faArrowLeft, faBars, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import InfiniteScroll from 'react-infinite-scroll-component';
import chat from '../../utils/chat';
import useBreakPoint from '../../hooks/useBreakPoint';
import { useDispatch } from 'react-redux';
import { useSocket } from '../../hooks/useSocket';
import { addMessage } from '../../redux/slices/messageSlice';
import { useAuth } from '../../hooks/useAuth';
import images from '../../assets/images';
import { useAppSelector } from '../../redux/hooks';
const cx = classNames.bind(styles);
type MessageBoxProps = { setOpenMessage: (value: boolean) => void };
function MessageBox({ setOpenMessage }: MessageBoxProps) {
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const dispatch = useDispatch();
    const [input, setInput] = useState('');
    const { user } = useAuth();

    const conversation = useAppSelector((state) => state.conversation.selectedConversation);

    const scrollableDivRef = useRef<HTMLDivElement>(null);
    // const [message, setMessage] = useState([]);
    const message = useAppSelector((state) => state.message.selectedMessage.message);

    const { isMobile } = useBreakPoint();
    const { socket } = useSocket();

    const loadMoreData = () => {
        if (loading || !scrollableDivRef.current) {
            return;
        }
        if (!conversation?._id) {
            return;
        }

        const scrollableDiv = scrollableDivRef.current;
        const previousScrollHeight = scrollableDiv.scrollHeight;

        setLoading(true);

        chat.get('get-message', { params: { id: conversation._id, skip: message.length } })
            .then(({ data }) => {
                if (data.length < 20) {
                    setHasMore(false);
                }
                dispatch(addMessage({ messages: data }));
                setTimeout(() => {
                    if (scrollableDiv) {
                        const newScrollHeight = scrollableDiv.scrollHeight;
                        scrollableDiv.scrollTop += newScrollHeight - previousScrollHeight;
                    }
                }, 0);

                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (conversation) {
            loadMoreData();
        }
        setHasMore(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversation]);
    const handleSend = () => {
        if (input.trim()) {
            setInput('');
            socket.emit('send-message', { conversationId: conversation?._id, message: input });
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    };

    if (!conversation?._id) {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('no-conversation')}>Bạn chưa có cuộc trò chuyện nào</div>
            </div>
        );
    }
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('header_left')}>
                    {isMobile && (
                        <Button
                            onClick={() => {
                                setOpenMessage(false);
                            }}
                            size="large"
                            icon={faArrowLeft}
                        ></Button>
                    )}

                    <div className={cx('info')}>
                        <img
                            className={cx('avatar')}
                            src={conversation?.image || images.defaultAvatar}
                            alt="Ảnh đại diện"
                        ></img>
                        <div className={cx('info_main')}>
                            <p className={cx('name')}>{conversation.name}</p>
                            <span className={cx('status')}>Online</span>
                        </div>
                    </div>
                </div>
                <div className={cx('header_right')}>
                    <Button size="large" icon={faBars}></Button>
                </div>
            </div>
            <div id={`scrollableDiv`} ref={scrollableDivRef} className={cx('content')}>
                <InfiniteScroll
                    dataLength={message.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    style={{ display: 'flex', overflow: 'hidden', flexDirection: 'column-reverse' }}
                    inverse={true}
                    loader={
                        <div className={cx('chat-loader')}>
                            {/* Avatar */}
                            <div className={cx('avatar')}></div>

                            {/* Tin nhắn */}
                            <div className={cx('message')}>
                                <div className={cx('line', 'short')}></div>
                                <div className={cx('line', 'long')}></div>
                            </div>
                        </div>
                    }
                    endMessage={<div className={cx('end')}>Đã tải hết tin nhắn 🤐</div>}
                    scrollableTarget={`scrollableDiv`}
                >
                    <div className={cx('messages')}>
                        {message.map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={cx('message_item', {
                                        right: user?.id === item?.sender.id,
                                        bottom: item.sender.id !== message[index + 1]?.senderId,
                                    })}
                                >
                                    <div className={cx('avatar_wrapper')}>
                                        <img className={cx('avatar', 'scale')} src={item.sender.avatar} alt="Ảnh"></img>
                                    </div>
                                    <div className={cx('message_content')}>{item.content}</div>
                                </div>
                            );
                        })}
                    </div>
                </InfiniteScroll>
            </div>
            <div className={cx('footer')}>
                <input
                    className={cx('input')}
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                    }}
                    placeholder="Nhập tin nhắn"
                    onKeyDown={handleKeyDown}
                ></input>
                <Button icon={faPaperPlane} onClick={handleSend}></Button>
            </div>
        </div>
    );
}

export default MessageBox;
