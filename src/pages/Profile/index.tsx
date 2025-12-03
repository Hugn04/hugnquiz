import { faPen } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames/bind';

import styles from './Profile.module.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import request from '../../utils/request';
import Button from '../../components/Button';
import DropImage, { type DropImageRef } from '../../components/DropImage';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { useAuth } from '../../hooks/useAuth';
import images from '../../assets/images';
import NotFoundPage from '../NotFoundPage';
import CardExample from '../../components/CardExample';
import Avatar from '../../components/Avatar';
import type { UserProfile } from '../../types/auth';
const cx = classNames.bind(styles);
function Profile() {
    const { user } = useAuth();
    const { email } = useParams();
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState<UserProfile>();
    const [isMyInfo, setIsMyInfo] = useState(false);
    const [error, setError] = useState(<div></div>);
    const { popupWarning, toastPromise } = useGlobalContext();
    const refAvatar = useRef<DropImageRef>(null);
    const nameRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        const info = email?.split('!') || [];
        if (user) {
            if (!info[1] || user.id === Number(info[1])) {
                setIsMyInfo(true);
            }
        }
        request
            .get('/get-profile', { params: { id: info[1], email: info[0].slice(1) } })
            .then((data) => {
                setUserInfo(data.data);
            })
            .catch((err) => {
                console.log(err);

                setError(<NotFoundPage></NotFoundPage>);
            });
    }, [email, user, navigate]);
    if (!userInfo) {
        return error;
    }

    return (
        <div className={cx('wraper')}>
            {/* <img className={cx('image-blur')} src={userInfo.banner || images.defaultBanner} alt=""></img> */}
            <div className={cx('banner')}>
                <img className={cx('banner-image')} src={userInfo.banner || images.defaultBanner} alt=""></img>
                {isMyInfo && (
                    <Button
                        onClick={() => {
                            popupWarning({
                                message: (
                                    <div className={cx('popup', 'image-banner')}>
                                        <h1>Chỉnh sửa ảnh banner</h1>
                                        <DropImage
                                            className={cx('image-banner')}
                                            url={userInfo.banner}
                                            ref={refAvatar}
                                        ></DropImage>
                                    </div>
                                ),
                                accecpt: async () => {
                                    const toastDelete = toastPromise('Đang tải ảnh lên');
                                    try {
                                        const data = await refAvatar.current?.uploadImage();
                                        if (data) {
                                            await request.post('/update-profile', { banner: data.url });
                                            toastDelete.success('Tải ảnh thành công !');
                                        } else {
                                            toastDelete.error('Tải ảnh thất bại !');
                                        }
                                    } catch (error) {
                                        console.log(error);

                                        toastDelete.error('Tải ảnh thất bại !');
                                    }
                                },
                            });
                        }}
                        className={cx('button-banner')}
                        icon={faPen}
                        variant="primary"
                    ></Button>
                )}
                <div className={cx('user')}>
                    <div className={cx('user-avatar')}>
                        <Avatar
                            url={userInfo.avatar}
                            frameUrl={userInfo.role === 'admin' ? images.frame : ''}
                            size={154}
                            // classNames={cx('avatar')}
                        ></Avatar>
                        {isMyInfo && (
                            <Button
                                onClick={() => {
                                    popupWarning({
                                        message: (
                                            <div className={cx('popup')}>
                                                <h1>Chỉnh sửa avatar</h1>
                                                <DropImage
                                                    className={cx('image-avatar')}
                                                    url={userInfo.avatar}
                                                    ref={refAvatar}
                                                ></DropImage>
                                            </div>
                                        ),
                                        accecpt: async () => {
                                            const toastUpdate = toastPromise('Đang tải ảnh lên');
                                            try {
                                                const data = await refAvatar.current?.uploadImage();
                                                if (data) {
                                                    await request.post('/update-profile', { avatar: data.url });
                                                    setUserInfo((prev) => {
                                                        if (prev) {
                                                            return { ...prev, avatar: data.url };
                                                        } else {
                                                            return prev;
                                                        }
                                                    });
                                                    toastUpdate.success('Tải ảnh thành công !');
                                                } else {
                                                    toastUpdate.error('Tải ảnh thất bại !');
                                                }
                                            } catch (error) {
                                                console.log(error);

                                                toastUpdate.error('Tải ảnh thất bại !');
                                            }
                                        },
                                    });
                                }}
                                className={cx('button')}
                                icon={faPen}
                                variant="primary"
                            ></Button>
                        )}
                    </div>
                    <div className={cx('user-name')}>
                        <span>{userInfo.name}</span>
                        {isMyInfo && (
                            <Button
                                onClick={() => {
                                    popupWarning({
                                        message: (
                                            <div className={cx('popup')}>
                                                <h1>Chỉnh sửa tên</h1>
                                                <input
                                                    ref={nameRef}
                                                    className={cx('input-name')}
                                                    placeholder="Vui lòng nhập tên mới"
                                                ></input>
                                            </div>
                                        ),
                                        accecpt: async () => {
                                            const toastDelete = toastPromise('Đang chỉnh sửa...');
                                            const name = nameRef?.current?.value;
                                            try {
                                                await request.post('/update-profile', {
                                                    name: name,
                                                });
                                                setUserInfo((prev) => {
                                                    if (prev) {
                                                        return { ...prev, name: name || '' };
                                                    } else {
                                                        return prev;
                                                    }
                                                });

                                                toastDelete.success('Chỉnh sửa thành công !');
                                            } catch (error) {
                                                console.log(error);

                                                toastDelete.error('Chỉnh sửa thất bại !');
                                            }
                                        },
                                    });
                                }}
                                className={cx('btn-name')}
                                icon={faPen}
                                variant="primary"
                            ></Button>
                        )}
                    </div>
                </div>
            </div>
            <div className={cx('action')}></div>

            <div className={cx('content', 'box')}>
                <h2>Đề thi của {userInfo.name}</h2>
                <div className={cx('main')}>
                    {userInfo.examples.map((example, index) => {
                        return <CardExample className={cx('card')} key={index} example={example}></CardExample>;
                    })}
                </div>
            </div>
        </div>
    );
}
export default Profile;
