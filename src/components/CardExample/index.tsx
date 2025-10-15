import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import 'reactjs-popup/dist/index.css';
import { faCopy, faPenToSquare } from '@fortawesome/free-regular-svg-icons';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import {
    faCirclePlay,
    faCircleQuestion,
    faHeart,
    faSquarePollVertical,
    faThumbsUp,
    faTrashCan,
} from '@fortawesome/free-solid-svg-icons';

import styles from './CardExample.module.scss';
import Button from '../Button';
import images from '../../assets/images';
import { routes } from '../../config';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import request from '../../utils/request';
import { Link, useNavigate } from 'react-router-dom';
import { copyTextToClipboard, getUserByEmail } from '../../helpers';
import { useEffect, useState } from 'react';
import Avatar from '../Avatar';
import type { Example } from '../../types/exam';

const cx = classNames.bind(styles);
type CardExampleProps = { getExample?: () => void; className?: string; myExample?: boolean; example?: Example };
function CardExample({ getExample = () => {}, className, myExample, example }: CardExampleProps) {
    const classes = cx('wraper', className, {
        'my-example': myExample,
        empty: !example,
    });

    const navigate = useNavigate();
    const { popupWarning, toastPromise } = useGlobalContext();
    const [isLike, setIsLike] = useState(false);
    const [isHeart, setIsHeart] = useState(false);

    useEffect(() => {
        setIsLike(!!example?.like);
        setIsHeart(!!example?.favorited);
    }, [example]);

    if (!example) {
        return (
            <div className={classes}>
                <div className={cx('img')}></div>
                <div className={cx('title')}></div>
                <div className={cx('info')}>
                    <div>
                        <div className={cx('avatar')}></div>
                        <div className={cx('name')}></div>
                    </div>
                    <div className={cx('date')}></div>
                </div>
                <div className={cx('line')}></div>
                <div className={cx('line')}></div>
                <div className={cx('button')}></div>
            </div>
        );
    }

    const date = new Date(example.created_at);

    return (
        <div className={classes}>
            <div className={cx('img')}>
                <img alt={example.name} src={example.image || images.defaultCard}></img>
            </div>
            <p className={cx('title')}>{example.name}</p>
            <div className={cx('example-info')}>
                {myExample ?? (
                    <Link
                        to={routes.profile(`${getUserByEmail(example.email)}!${example.user_id}`)}
                        state={{ email: example.email }}
                    >
                        <div className={cx('info')}>
                            <Avatar
                                url={example.avatar}
                                frameUrl={example.role === 'admin' ? images.frame : ''}
                                classNames={cx('avatar')}
                            ></Avatar>
                            <p className={cx('name')}>{example.username}</p>
                        </div>
                    </Link>
                )}
                <div className={cx('date')}>
                    <FontAwesomeIcon icon={faClock}></FontAwesomeIcon>
                    <p>{`${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`}</p>
                </div>
            </div>
            <div className={cx('statistics')}>
                <div>
                    <Tippy content="Số câu hỏi" placement="bottom">
                        <FontAwesomeIcon color="#fca218" icon={faCircleQuestion}></FontAwesomeIcon>
                    </Tippy>
                    <p>{example.num_question}</p>
                </div>
                <div>
                    <Tippy content="Số lượt thi" placement="bottom">
                        <FontAwesomeIcon color="#2cb44c" icon={faSquarePollVertical}></FontAwesomeIcon>
                    </Tippy>
                    <p>{example.count_test}</p>
                </div>
                <div>
                    <Tippy content="Like" placement="bottom">
                        <FontAwesomeIcon color="rgb(10, 143, 220)" icon={faThumbsUp}></FontAwesomeIcon>
                    </Tippy>
                    <p>{example.count_like}</p>
                </div>
                {/* <div>
                    <Tippy content="Số lượt tải" placement="bottom">
                        <FontAwesomeIcon color="rgb(10, 143, 220)" icon={faDownload}></FontAwesomeIcon>
                    </Tippy>
                    <p>1</p>
                </div> */}
            </div>
            <div className={cx('tag')}>
                <Button variant="outline" className={cx('tag-button')}>
                    {example.credits} tín chỉ
                </Button>
                <Button variant="outline" className={cx('tag-button')}>
                    {example.sector}
                </Button>
            </div>
            {myExample && (
                <div className={cx('action-crud')}>
                    <Tippy content="Sửa đề thi" placement="bottom">
                        <Button
                            to={routes.editExample(example.id.toString())}
                            state={{ a: 1 }}
                            icon={faPenToSquare}
                            iconColor="var(--primary)"
                        ></Button>
                    </Tippy>
                    <Tippy content="Sao chép" placement="bottom">
                        <Button
                            icon={faCopy}
                            onClick={() => {
                                copyTextToClipboard(`${import.meta.env.VITE_APP_DOMAIN}/share/${example.id}`);
                            }}
                            iconColor="var(--text-color)"
                        ></Button>
                    </Tippy>
                    <Tippy content="Xóa" placement="bottom">
                        <Button
                            onClick={() => {
                                popupWarning({
                                    message: 'Bạn có chắc muốn xóa đề thi này không ?',
                                    accecpt: () => {
                                        const toastDelete = toastPromise('Đang xóa đề thi...');
                                        request
                                            .delete('/delete-myexample', { params: { id: example.id } })
                                            .then(() => {
                                                toastDelete.success('Xóa thành công !');
                                                getExample();
                                            })
                                            .catch(() => {
                                                toastDelete.error('Xóa thất bại !');
                                            });
                                    },
                                });
                            }}
                            icon={faTrashCan}
                            iconColor="#f44c44"
                        ></Button>
                    </Tippy>
                </div>
            )}

            <div className={cx('action')}>
                <Button
                    className={cx('play')}
                    to={routes.previewExample(example.id.toString())}
                    variant="primary"
                    size="small"
                    leftIcon={faCirclePlay}
                >
                    Xem đề thi
                </Button>

                {myExample || (
                    <div>
                        <Tippy content="Sao chép" placement="bottom">
                            <Button
                                icon={faCopy}
                                onClick={() => {
                                    copyTextToClipboard(`${import.meta.env.VITE_APP_DOMAIN}/share/${example.id}`);
                                }}
                                iconColor="var(--text-color)"
                            ></Button>
                        </Tippy>
                        <Tippy content="Like" placement="bottom">
                            <Button
                                icon={faThumbsUp}
                                onClick={() => {
                                    request
                                        .post('like', { example_id: example.id, like: !isLike })
                                        .then(({ data }) => {
                                            setIsLike(data.like);
                                            example.count_like = data.count_like;
                                        })
                                        .catch((err) => {
                                            console.log(err);

                                            navigate(routes.login);
                                        });
                                }}
                                className={cx('button')}
                                {...(isLike && { iconColor: '#067eff' })}
                            ></Button>
                        </Tippy>
                        <Tippy content="Yêu thích" placement="bottom">
                            <Button
                                icon={faHeart}
                                onClick={() => {
                                    request
                                        .post('favorited', { example_id: example.id, favorited: !isHeart })
                                        .then(({ data }) => {
                                            setIsHeart(data);
                                        })
                                        .catch((err) => {
                                            console.log(err);

                                            navigate(routes.login);
                                        });
                                }}
                                {...(isHeart && { iconColor: '#f93a52' })}
                                className={cx('button')}
                            ></Button>
                        </Tippy>
                    </div>
                )}
            </div>
        </div>
    );
}

export default CardExample;
