import classNames from 'classnames/bind';
import styles from './ItemRank.module.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faTrophy } from '@fortawesome/free-solid-svg-icons';
import Button from '../Button';
import images from '../../assets/images';
import { useAuth } from '../../hooks/useAuth';
import chat from '../../utils/chat';
import { useNavigate } from 'react-router-dom';
import { routes } from '../../config';
import Avatar from '../Avatar';
import type { User } from '../../types/auth';
import type { ReactNode } from 'react';
const cx = classNames.bind(styles);
type ItemRankProps = { rank: number; point: number; userId: number; userInfo: User; children: ReactNode };
function ItemRank({ rank = 1, point = 0, userId, userInfo, children }: ItemRankProps) {
    const style = { no1: rank === 1, no2: rank === 2, no3: rank === 3 };
    const { user } = useAuth();
    const navigate = useNavigate();
    const handleMessage = async () => {
        try {
            await chat.post('/find-conversation', {
                slug: `user-${user?.id}.${userId}`,
            });
            navigate(routes.message);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div className={cx('wrapper', style)}>
            <h1>{rank}</h1>
            <Avatar
                url={userInfo.avatar}
                size={50}
                frameUrl={userInfo.role === 'admin' ? images.frame : ''}
                classNames={cx('avatar')}
            ></Avatar>
            {/* <img className={cx('avatar')} src={avatar || images.defaultAvatar} alt="Hình nền"></img> */}
            <div className={cx('name')}>{children}</div>
            <div className={cx('point')}>{point}đ</div>
            {rank <= 3 ? (
                <FontAwesomeIcon className={cx('cup', style)} icon={faTrophy}></FontAwesomeIcon>
            ) : (
                <FontAwesomeIcon className={cx('cup', style)} icon={faTrophy}></FontAwesomeIcon>
            )}
            {userId !== user?.id ? (
                <Button
                    icon={faMessage}
                    onClick={() => {
                        handleMessage();
                    }}
                    className={cx('button')}
                ></Button>
            ) : (
                <Button disable className={cx('button')}></Button>
            )}
        </div>
    );
}

export default ItemRank;
