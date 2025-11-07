import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen, faChartColumn, faHeart, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState } from 'react';
import { useParams, useSearchParams, useLocation } from 'react-router-dom';

import styles from './Contest.module.scss';
import Button from '../../components/Button';
import Time, { type TimeRef } from '../../components/Time';
import CardContest from './components/CardContest';
import request from '../../utils/request';
import { shuffleExample, copyTextToClipboard, getExampleRetry } from '../../helpers';
// import PopupFinally from './components/PopupFinally';
// import PopupTimeout from './components/PopupTimeout';
import { faCopy } from '@fortawesome/free-regular-svg-icons';
import Tippy from '@tippyjs/react';
import images from '../../assets/images';
import Avatar from '../../components/Avatar';
import type { Contest, Example } from '../../types/exam';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/hooks';
import { changeQuestion, setPartQuestions } from '../../redux/slices/contestSlice';
import PopupFinally from './components/PopupFinally';
import extractExample from '../../helpers/extractExample';
const cx = classNames.bind(styles);

function Contest() {
    const { state } = useLocation();
    const [isLoading, setIsloading] = useState(true);
    const { delayNext, isQuestionShuffle, isAnswerShuffle, test } = state
        ? state
        : { delayNext: 1, isQuestionShuffle: false, isAnswerShuffle: false };
    const dispatch = useDispatch();
    const partQuestions = useAppSelector((state) => state.contest.partQuestions);
    const result = useAppSelector((state) => state.contest.result);
    const [timeSkipQuestion, setTimeSkipQuestion] = useState(state ? +delayNext : 1);
    const curentPart = useAppSelector((state) => state.contest.currentPart);
    const curentQuestion = useAppSelector((state) => state.contest.currentQuestion);
    const [example, setExample] = useState<Example>();
    const [searchParams] = useSearchParams();
    const { subject } = useParams();
    // const popupTimeOutRef = useRef();
    const timeRef = useRef<TimeRef>(null);
    // const [endExample, setEndExample] = useState(false);

    const [isLike, setIsLike] = useState(false);
    const [isHeart, setIsHeart] = useState(false);
    const numQuestion = useAppSelector((state) => state.contest.numQuestion);
    const retryExampleFalse = () => {
        dispatch(setPartQuestions(getExampleRetry(partQuestions)));
        // const newListExample = getExampleRetry(partQuestions);
    };

    const handleGetExample = async () => {
        try {
            const { data } = await request.get<Contest>('/getQuestion', { params: { id: subject } });
            const example = extractExample(data);
            setExample(example);
            dispatch(setPartQuestions(shuffleExample([...data.question], isQuestionShuffle, isAnswerShuffle)));
            setIsloading(false);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        if (timeRef.current) {
            let time = 0;
            if (test) {
                time = (example?.credits ?? 0) * 15 * 60;
            }
            timeRef.current.start(time);
        }
        setIsLike(!!example?.user_action.like);
        setIsHeart(!!example?.user_action.favorited);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading]);

    useEffect(() => {
        handleGetExample();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, subject]);

    const handleTimeOut = () => {
        if (!(result.correct + result.wrong === example?.num_question)) {
            // popupTimeOutRef.current.onOpen();
        }
    };
    const handleRetry = () => {
        handleGetExample();
        timeRef?.current?.restart();
    };
    const resultRef = useRef({
        example_id: example?.id,
        score: Math.round((10 / (example?.num_question ?? 0)) * result.correct * 10) / 10,
    });
    const numQuestionRef = useRef(example?.num_question);

    useEffect(() => {
        resultRef.current = {
            example_id: example?.id,
            score: Math.round((10 / (example?.num_question ?? 0)) * result.correct * 10) / 10,
        };
        numQuestionRef.current = numQuestion;
    }, [example?.id, example?.num_question, result.correct, numQuestion]);

    useEffect(() => {
        let shouldSendApi = false;

        const handleBeforeUnload = (event: BeforeUnloadEvent) => {
            event.preventDefault();
            event.returnValue = '';
            shouldSendApi = true;
        };

        const handleUnload = async () => {
            if (shouldSendApi && numQuestionRef.current === example?.num_question) {
                navigator.sendBeacon(`${import.meta.env.VITE_APP_API}update-score`, JSON.stringify(resultRef.current));
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('unload', handleUnload);

        return () => {
            shouldSendApi = true;
            const load = async () => {
                await handleUnload();
            };
            load();
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('unload', handleUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (isLoading) {
        return <div></div>;
    }

    return (
        <div className={cx('wraper')}>
            {/* Thông tin dề */}
            <div>
                <div className={cx('info-example', 'box')}>
                    <h1>{example?.name}</h1>
                    <div className={cx('info-author')}>
                        <Avatar
                            url={example?.user.avatar ?? ''}
                            size={34}
                            frameUrl={example?.user.role === 'admin' ? images.frame : ''}
                            // classNames={cx('avatar')}
                        ></Avatar>
                        {/* <img src={example?.avatar || images.defaultAvatar} alt="Ảnh tác giả"></img> */}
                        <p className={cx('name')}>{example?.user.name}</p>
                    </div>
                    <div className={cx('chart')}>
                        <div>
                            <FontAwesomeIcon icon={faChartColumn}></FontAwesomeIcon>
                            <p>{example?.num_question}</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faChartColumn}></FontAwesomeIcon>
                            <p>{example?.count_test}</p>
                        </div>
                        <div>
                            <FontAwesomeIcon icon={faChartColumn}></FontAwesomeIcon>
                            <p>{example?.count_like}</p>
                        </div>
                    </div>
                    <hr></hr>
                    <div className={cx('total')}>
                        <p>Thời gian làm bài thi:</p>
                        <Time
                            time={0}
                            ref={timeRef}
                            countDown={false}
                            notAlwayRunning
                            finishFn={handleTimeOut}
                            className={cx('time')}
                        ></Time>
                    </div>
                    <div className={cx('other')}>
                        <div className={cx('time')}>
                            <label>Tự động chuyển câu:</label>
                            <select
                                value={timeSkipQuestion}
                                onChange={(e) => setTimeSkipQuestion(parseInt(e.target.value))}
                            >
                                <option value={0}>Tắt</option>
                                <option value={1}>1s</option>
                                <option value={2}>2s</option>
                                <option value={3}>3s</option>
                            </select>
                        </div>
                        <hr></hr>
                        <div className={cx('other-group')}>
                            <Button
                                icon={faCopy}
                                onClick={() => {
                                    copyTextToClipboard(`${import.meta.env.VITE_APP_DOMAIN}/share/${example?.id}`);
                                }}
                                iconColor="var(--text-color)"
                            ></Button>
                            <div>
                                <Tippy content="Like" placement="bottom">
                                    <Button
                                        icon={faThumbsUp}
                                        onClick={() => {
                                            request
                                                .post('like', { example_id: example?.id, like: !isLike })
                                                .then(({ data }) => {
                                                    setIsLike(data.like);
                                                    setExample((prev) =>
                                                        prev ? { ...prev, count_like: data.count_like } : prev,
                                                    );
                                                })
                                                .catch();
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
                                                .post('favorited', { example_id: example?.id, favorited: !isHeart })
                                                .then(({ data }) => {
                                                    setIsHeart(data);
                                                })
                                                .catch();
                                        }}
                                        {...(isHeart && { iconColor: '#f93a52' })}
                                        className={cx('button')}
                                    ></Button>
                                </Tippy>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx('part-example', 'box')}>
                    <h1 className={cx('header')}>Danh sách phần thi</h1>
                    <div className={cx('content')}>
                        {partQuestions.map((part, index) => {
                            return (
                                <Button
                                    key={index}
                                    // onClick={() => {
                                    //     setCurentPart(index);
                                    //     setCurentQuestion(0);
                                    // }}
                                    className={cx('button', { active: index === curentPart })}
                                    leftIcon={faBookOpen}
                                >
                                    <h1>{part.name}</h1>
                                    <p>{part.questions.length} câu hỏi</p>
                                </Button>
                            );
                        })}
                    </div>
                    <div className={cx('result')}>
                        <div>
                            <p>Đúng : </p>
                            <p className={cx('correct')}>{result.correct}</p>
                        </div>
                        <div>
                            <p>Sai : </p>
                            <p className={cx('wrong')}>{result.wrong}</p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Khu vực thi */}
            <div>
                <CardContest className={cx('box')}></CardContest>
            </div>
            {/* Khu vực chuyển câu hỏi */}
            <div className={cx('example-table', 'box')}>
                <div className={cx('header')}>
                    <h3>Mục lục</h3>
                </div>
                <div className={cx('content')}>
                    {partQuestions[curentPart]?.questions?.map((item, index) => {
                        let isCorrect = false;
                        if (item.choose !== undefined) {
                            isCorrect = item.answers[item.choose].is_correct;
                        }

                        const classes = cx('button', {
                            wrong: !isCorrect && item.choose !== undefined,
                            correct: isCorrect,
                            active: index === curentQuestion,
                        });
                        return (
                            <Button key={index} onClick={() => dispatch(changeQuestion(index))} className={classes}>
                                {index + 1}
                            </Button>
                        );
                    })}
                    {/* <Button className={cx('button')}>1</Button> */}
                </div>
                <div className={cx('retry')}>
                    <Button onClick={retryExampleFalse} variant="primary">
                        Làm lại câu sai
                    </Button>
                </div>
            </div>
            {/* <PopupTimeout
                ref={popupTimeOutRef}
                onClose={() => {
                    setEndExample(true);
                }}
            ></PopupTimeout> */}
            {result.correct + result.wrong === numQuestion && (
                <PopupFinally
                    partQuestions={partQuestions}
                    exampleResult={{
                        id: example?.id ?? 0,
                        name: example?.name ?? '',
                        time: timeRef?.current?.getTime() ?? '',
                    }}
                    onOpen={() => {
                        timeRef?.current?.stop();
                    }}
                    handleRetry={handleRetry}
                    handleRetryExample={retryExampleFalse}
                ></PopupFinally>
            )}
        </div>
    );
}

export default Contest;
