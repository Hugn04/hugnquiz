import classNames from 'classnames/bind';
import styles from './Conversation.module.scss';

import { useEffect, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useDispatch } from 'react-redux';
import Input, { type InputRef } from '../Input';
import {
    addConversation,
    filterAllGroup,
    searchConversation,
    setSelectConversation,
} from '../../redux/slices/conversationSlice';
import chat from '../../utils/chat';
import { setSelectedMessage } from '../../redux/slices/messageSlice';
import images from '../../assets/images';
import { useAppSelector } from '../../redux/hooks';
import Select from '../Select';
const cx = classNames.bind(styles);
type ConversationProps = { setOpenMessage: (value: boolean) => void };
function Conversation({ setOpenMessage }: ConversationProps) {
    const [hasMore, setHasMore] = useState(true);
    const conversations = useAppSelector((state) => state.conversation.conversations) ?? [];
    const selectId = useAppSelector((state) => state.conversation.selectedConversation?._id);
    const searchRef = useRef<InputRef>(null);
    const loadMoreData = async () => {
        try {
            const { data: conversation } = await chat.get('/get-conversation', {
                params: { skip: conversations.length },
            });
            dispatch(addConversation(conversation));
            if (conversation.length < 8) {
                setHasMore(false);
            }
            // dispatch(addMessages({ conversationId: conversation._id, messages: data }));
        } catch (error) {
            console.log(error);
        }
    };
    const dispatch = useDispatch();
    const handleChooseConversation = (id: string) => {
        setOpenMessage(true);
        dispatch(setSelectConversation(id));
        dispatch(setSelectedMessage(id));
    };
    useEffect(() => {
        // socket.emit('join-room', conversation._id);
        loadMoreData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <div className={cx('title')}>Đoạn chat</div>
                <div className={cx('search')}>
                    <Input
                        ref={searchRef}
                        title="Tìm kiếm"
                        handleDebounce={() => {
                            if (searchRef.current) dispatch(searchConversation(searchRef.current.getValue()));
                        }}
                        className={cx('input')}
                    ></Input>
                    <Select<{ title: string; value: boolean | null }>
                        items={[
                            { title: 'Tất cả', value: null },
                            { title: 'Nhóm', value: true },
                            { title: 'Người dùng', value: false },
                        ]}
                        defaultValue={{ title: 'Tất cả', value: null }}
                        title="Lọc đoạn chat"
                        render={(d) => {
                            return d.title;
                        }}
                        onSelect={(e) => {
                            if (e) dispatch(filterAllGroup(e.value));
                        }}
                        filter={(items, search) =>
                            items.filter((i) => i.title.toLowerCase().includes(search.toLowerCase()))
                        }
                        placeholder="Lọc đoạn chat"
                        // onChange={(e) => setTimeSkipQuestion(parseInt(e.target.value))}
                    ></Select>
                </div>
            </div>
            <div id={`scrollableDivConversation`} className={cx('content')}>
                <InfiniteScroll
                    dataLength={conversations.length}
                    next={loadMoreData}
                    hasMore={hasMore}
                    style={{ display: 'flex', overflow: 'hidden', flexDirection: 'column' }}
                    //inverse={true}
                    loader={<div>Đang tải ...</div>}
                    endMessage={
                        <div style={{ width: '100%', textAlign: 'center', marginTop: '8px' }}>
                            Đã tải hết đoạn chat !!!
                        </div>
                    }
                    scrollableTarget={`scrollableDivConversation`}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {conversations.map((item, index) => {
                            const classes = {
                                active: item._id === selectId,
                            };
                            return (
                                <div
                                    onClick={() => {
                                        if (item._id) {
                                            handleChooseConversation(item._id);
                                        }
                                    }}
                                    className={cx('conversation_item', classes)}
                                    key={index}
                                >
                                    <img
                                        className={cx('avatar')}
                                        src={item.image || images.defaultAvatar}
                                        alt="Ảnh"
                                    ></img>
                                    <div className={cx('name')}>{item.name}</div>
                                </div>
                            );
                        })}
                    </div>
                </InfiniteScroll>
            </div>
        </div>
    );
}

export default Conversation;
