import classNames from 'classnames/bind';
import { useRef, useState } from 'react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';

import request from '../../utils/request';
import styles from './EditExample.module.scss';
import Input, { type InputRef } from '../../components/Input';
import Button from '../../components/Button';
import DropImage, { type DropImageRef } from '../../components/DropImage';
import ListAnswers, { type ListAnswersRef } from './components/ListAnswers';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { routes } from '../../config';
import Select, { type SelectRef } from '../../components/Select';
import type { Answer, Contest, Example, Question, Sector } from '../../types/exam';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    addQuestion,
    changePart,
    changeQuestion,
    deleteCurrentQuestion,
    setCurrentQuestion,
    setEditPartQuestions,
} from '../../redux/slices/contestSlice';
import extractExample from '../../helpers/extractExample';
const cx = classNames.bind(styles);

function EditExample() {
    const partQuestions = useAppSelector((state) => state.contest.partQuestions);
    const curentPart = useAppSelector((state) => state.contest.currentPart);
    const curentQuestion = useAppSelector((state) => state.contest.currentQuestion);
    const [example, setExample] = useState<Example>();
    const { subject } = useParams();
    const [questionName, setQuestionName] = useState('');
    const [answers, setAnswers] = useState<Answer[]>([]);
    const answersRef = useRef<ListAnswersRef>(null);
    const [popupWarning, setPopupWarning] = useState({ state: false, message: '', next: () => {}, event: () => {} });
    const { toastPromise, showToast } = useGlobalContext();
    const creditsRef = useRef<InputRef>(null);
    const sectorRef = useRef<SelectRef<Sector>>(null);
    const [sectorList, setSectorList] = useState<Sector[]>([]);
    const nameExampleRef = useRef<InputRef>(null);
    const imageRef = useRef<DropImageRef>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const save = () => {
        // console.log(answersRef.current?.getAnswers());

        const question: Question = {
            name: questionName,
            answers: answersRef.current?.getAnswers() ?? answers,
        };
        dispatch(setCurrentQuestion(question));
    };
    const isChange = () => {
        const questionNotChange = JSON.stringify({
            name: partQuestions[curentPart]?.questions[curentQuestion].name,
            answers: answers,
        });
        const questionChange = JSON.stringify({
            name: questionName,
            answers: answersRef.current?.getAnswers() ?? answers,
        });

        return questionNotChange !== questionChange;
    };
    useEffect(() => {
        const fetchSector = async () => {
            try {
                const { data: sectors } = await request.get<Sector[]>('/sectors');
                setSectorList(sectors);
            } catch (error) {
                console.log(error);
            }
        };
        fetchSector();
    }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: contest } = await request.get<Contest>('/getMyQuestion', { params: { id: subject } });
                setExample(extractExample(contest));
                dispatch(setEditPartQuestions(contest.question));
            } catch (error) {
                console.log(error);

                dispatch(setEditPartQuestions([]));
                showToast('Bạn không có quyền sửa đề thi này !');
                navigate(routes.myExam);
            }
        };
        fetchData();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        if (partQuestions.length === 0) return;
        setQuestionName(partQuestions[curentPart]?.questions[curentQuestion].name);
        setAnswers([...partQuestions[curentPart].questions[curentQuestion].answers]);
    }, [curentPart, curentQuestion, partQuestions]);
    if (!example || partQuestions.length === 0) return;

    return (
        <div className={cx('wrapper')}>
            <div className={cx('info', 'box')}>
                <h1 className={cx('header')}>Thông tin đề thi</h1>

                <Input
                    ref={nameExampleRef}
                    defaultValue={example.name}
                    validates={{ require: 'Bắt buộc nhập tên đề thi !' }}
                    title="Tên đề thi"
                    type="text"
                ></Input>
                <Input
                    style={{ margin: '0 16px' }}
                    defaultValue={example.credits + ''}
                    validates={{ require: 'Bắt buộc nhập số tín chỉ !' }}
                    ref={creditsRef}
                    title="Số tín chỉ"
                    type="number"
                ></Input>
                <Select<Sector>
                    validates={{ require: 'Bắt buộc chọn ngành !' }}
                    ref={sectorRef}
                    defaultValue={example.sector}
                    filter={(items, search) => items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))}
                    placeholder="Chọn ngành"
                    items={sectorList}
                    render={(data) => data.name}
                    title="Chọn ngành"
                ></Select>
                <DropImage className={cx('image')} url={example.image || ''} ref={imageRef}></DropImage>
            </div>
            <div className={cx('container')}>
                <div className={cx('content', 'box')}>
                    <div className={cx('question')}>
                        <textarea
                            value={questionName}
                            onChange={(e) => setQuestionName(e.target.value)}
                            className={cx('textarea')}
                            spellCheck={false}
                        ></textarea>
                    </div>
                    <div className={cx('answers')}>
                        <ListAnswers ref={answersRef} isChange={isChange} save={save} data={answers}></ListAnswers>
                    </div>
                </div>
                <div className={cx('example-table')}>
                    <div className={cx('part', 'box')}>
                        {/* Handle change part*/}
                        {partQuestions.map((part, index) => {
                            return (
                                <Button
                                    key={index}
                                    className={cx('button')}
                                    // Xóa part
                                    // onKeyDown={(e) => {
                                    //     if (e.key === 'Delete') {
                                    //         if (partQuestions[curentPart].questions.length <= 1) {
                                    //             showToast('Không thể xóa hết câu hỏi trong 1 phần !');
                                    //             return;
                                    //         }
                                    //         setCurentQuestion(partQuestions[curentPart].questions.length - 2);
                                    //         setListExample((prev) => {
                                    //             const newExam = [...prev];
                                    //             newExam.splice(curentPart, 1);

                                    //             return newExam;
                                    //         });
                                    //     }
                                    // }}
                                    variant={index === curentPart ? 'primary' : 'outline'}
                                    onClick={() => {
                                        if (isChange()) {
                                            setPopupWarning((prev) => ({
                                                ...prev,
                                                state: true,
                                                message: 'Bạn muốn thay đổi câu hỏi vừa rồi không !',
                                                next: () => {
                                                    dispatch(changeQuestion(0));
                                                    dispatch(changePart(index));
                                                },
                                            }));
                                        } else {
                                            dispatch(changeQuestion(0));
                                            dispatch(changePart(index));
                                        }
                                    }}
                                    size="small"
                                >
                                    {part.name}
                                </Button>
                            );
                        })}
                    </div>
                    <div className={cx('group-question', 'box')}>
                        <div className={cx('question')}>
                            {/* Handle change question */}
                            {partQuestions[curentPart]?.questions.map((item, index) => {
                                return (
                                    <Button
                                        key={index}
                                        onClick={() => {
                                            if (isChange()) {
                                                setPopupWarning((prev) => ({
                                                    ...prev,
                                                    state: true,
                                                    message: 'Bạn muốn thay đổi câu hỏi vừa rồi không !',
                                                    next: () => {
                                                        dispatch(changeQuestion(index));
                                                    },
                                                }));
                                            } else {
                                                dispatch(changeQuestion(index));
                                            }
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Delete') {
                                                if (partQuestions[curentPart].questions.length <= 1) {
                                                    showToast('Không thể xóa hết câu hỏi trong một phần !');
                                                    return;
                                                }
                                                dispatch(deleteCurrentQuestion());
                                            }
                                        }}
                                        className={cx('button')}
                                        variant={index === curentQuestion ? 'primary' : 'outline'}
                                        size="small"
                                    >
                                        {index + 1}
                                    </Button>
                                );
                            })}
                        </div>
                        <div className={cx('action')}>
                            {/* Thêm câu hỏi */}
                            <Button
                                variant="primary"
                                onClick={() => {
                                    const questions: Question = { name: '', answers: [] };
                                    dispatch(addQuestion(questions));
                                }}
                            >
                                Thêm câu hỏi
                            </Button>
                            {/* Lưu thay đổi */}
                            <Button
                                variant="primary"
                                validateInput={[creditsRef, nameExampleRef, sectorRef]}
                                onClick={() => {
                                    const update = async () => {
                                        const count_question = partQuestions.reduce((total, item) => {
                                            total += item.questions.length;
                                            return total;
                                        }, 0);
                                        const toastUpdate = toastPromise('Đang chỉnh sửa đề thi !');
                                        try {
                                            const data = await imageRef.current?.uploadImage();

                                            const body = {
                                                id: subject,
                                                count_question,
                                                name: nameExampleRef.current?.getValue(),
                                                sector: sectorRef.current?.getValue()?.id,
                                                credits: creditsRef.current?.getValue(),
                                                question: partQuestions,
                                                ...(data?.url && { image: data.url }),
                                            };
                                            await request.post('/update-myexample', body);
                                            toastUpdate.success('Sửa đề thi thành công !');
                                            navigate(routes.myExam);
                                        } catch (error) {
                                            console.log(error);

                                            toastUpdate.error('Sửa đề thi thất bại !');
                                        }

                                        // imageRef.current
                                        //     ?.uploadImage()
                                        //     .then((data) => {
                                        //         const body = {
                                        //             id: subject,
                                        //             count_question,
                                        //             name: nameExampleRef.current?.getValue(),
                                        //             sector: sectorRef.current?.getValue()?.id,
                                        //             credits: creditsRef.current?.getValue(),
                                        //             question: partQuestions,
                                        //             ...(data.url && { image: data.url }),
                                        //         };
                                        //         return request.post('/update-myexample', body);
                                        //     })
                                        //     .then(() => {
                                        //         toastUpdate.success('Sửa đề thi thành công !');
                                        //         navigate(routes.myExam);
                                        //     })
                                        //     .catch(() => {

                                        //     });
                                    };
                                    setPopupWarning((prev) => ({
                                        ...prev,
                                        state: true,
                                        message: 'Bạn muốn lưu tất cả thay đổi không !',
                                        event: () => {
                                            update();
                                        },
                                    }));
                                }}
                            >
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Popup warning */}
            <Popup
                open={popupWarning.state}
                onClose={() => {
                    popupWarning.next();
                    setPopupWarning((prev) => ({ ...prev, state: false }));
                }}
            >
                {popupWarning.message}
                <div className={cx('popup-warning')}>
                    <Button
                        variant="primary"
                        onClick={() => {
                            save();
                            setPopupWarning((prev) => ({ ...prev, state: false }));
                            popupWarning.next();
                            popupWarning.event();
                        }}
                    >
                        Lưu
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            setPopupWarning((prev) => ({ ...prev, state: false }));
                            popupWarning.next();
                        }}
                    >
                        Hủy
                    </Button>
                </div>
            </Popup>
        </div>
    );
}

export default EditExample;
