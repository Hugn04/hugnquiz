import classNames from 'classnames/bind';

import styles from './PreviewExample.module.scss';
import Button from '../../components/Button';
import Tippy from '@tippyjs/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquarePollVertical } from '@fortawesome/free-solid-svg-icons';
import { faCircleQuestion, faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import PopupStart from '../../components/PopupStart';
import ItemRank from '../../components/ItemRank';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import request from '../../utils/request';
import chat from '../../utils/chat';
import { convertExampleToText, getUserByEmail } from '../../helpers';
import images from '../../assets/images';
import { routes } from '../../config';
import Avatar from '../../components/Avatar';
import type { Example, MyScore, PartQuestion, Score } from '../../types/exam';
const cx = classNames.bind(styles);
// const initExample = [
//     {
//         name: 'Phần 1',
//         questions: [
//             {
//                 name: 'Có thể đề thi này bị lỗi !',
//                 answers: [],
//             },
//         ],
//     },
// ];
function PreviewExample() {
    const { subject } = useParams();

    const [score, setScores] = useState<Score[]>([]);
    const [myScore, setMyScores] = useState<MyScore | null>(null);
    const [example, setExample] = useState<Example | null>(null);
    const [partQuestions, setPartQuestions] = useState<PartQuestion[]>([]);
    const navigate = useNavigate();
    const handleMessage = async () => {
        try {
            await chat.post('/find-conversation', {
                slug: `exam-${example?.id}`,
                name: example?.name,
                image: example?.image || '',
            });
            navigate(routes.message);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [scoreRes, questionRes] = await Promise.all([
                    request.get('get-score', { params: { example_id: subject } }),
                    request.get('/getQuestion', { params: { id: subject } }),
                ]);

                setScores(scoreRes.data.scores);
                setMyScores(scoreRes.data.user_score);

                const exam = JSON.parse(questionRes.data.question);
                setExample(questionRes.data);
                setPartQuestions([...exam]);
            } catch (err) {
                console.error(err);
                setPartQuestions([]);
            }
        };

        fetchData();
    }, [subject]);
    return (
        <div className={cx('wraper')}>
            <div className={cx('left')}>
                <div className={cx('info', 'box')}>
                    <img src={example?.image || images.defaultCard} alt=""></img>
                    <div>
                        <div className={cx('title')}>{example?.name}</div>
                        <div className={cx('statistics')}>
                            <div>
                                <Tippy content="Số câu hỏi" placement="bottom">
                                    <FontAwesomeIcon color="#fca218" icon={faCircleQuestion}></FontAwesomeIcon>
                                </Tippy>
                                <p>{example?.num_question}</p>
                            </div>
                            <div>
                                <Tippy content="Số lượt thi" placement="bottom">
                                    <FontAwesomeIcon color="#2cb44c" icon={faSquarePollVertical}></FontAwesomeIcon>
                                </Tippy>
                                <p>{example?.count_test}</p>
                            </div>
                            <div>
                                <Tippy content="Like" placement="bottom">
                                    <FontAwesomeIcon color="rgb(10, 143, 220)" icon={faThumbsUp}></FontAwesomeIcon>
                                </Tippy>
                                <p>{example?.count_like}</p>
                            </div>
                        </div>
                        <div className={cx('actions')}>
                            <PopupStart
                                idExample={Number.parseInt(subject || '0')}
                                trigger={<Button primary>Bắt đầu</Button>}
                            ></PopupStart>
                            <Button
                                onClick={() => {
                                    handleMessage();
                                }}
                                primary
                            >
                                Nhắn tin trong đề thi
                            </Button>
                        </div>
                    </div>
                </div>
                <div className={cx('author', 'box')}>
                    <div
                        className={cx('word_example')}
                        dangerouslySetInnerHTML={{ __html: convertExampleToText(partQuestions, '<br>', 2) }}
                    ></div>
                </div>
            </div>
            <div className={cx('rank', 'box')}>
                <div className={cx('title')}>Bảng xếp hạng</div>
                <hr></hr>
                <div className={cx('rank-content')}>
                    <div className={cx('me')}>
                        <div className={cx('core')}>
                            <Avatar
                                url={myScore ? myScore.user.avatar : ''}
                                size={80}
                                frameUrl={myScore?.user.role === 'admin' ? images.frame : ''}
                                // classNames={cx('avatar')}
                            ></Avatar>
                            {myScore?.ranking ? `No.${myScore.ranking}` : 'Không có xếp hạng'}
                        </div>
                    </div>
                    {score.length > 0 &&
                        score.map((item, index) => {
                            return (
                                <ItemRank
                                    key={index}
                                    userId={item.user_id}
                                    point={item.score}
                                    userInfo={item.user}
                                    rank={index + 1}
                                >
                                    <Link to={routes.profile(`${getUserByEmail(item.user.email)}!${item.user_id}`)}>
                                        {item.user.name}
                                    </Link>
                                </ItemRank>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

export default PreviewExample;
