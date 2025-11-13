import classNames from 'classnames/bind';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faCircleXmark, faQuestion } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useRef, useState, type ChangeEvent, type MouseEvent as ReactMouseEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import mammoth from 'mammoth';
import styles from './CreateExample.module.scss';
import Button from '../../components/Button';
import request from '../../utils/request';
import Input, { type InputRef } from '../../components/Input';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { convertExampleToText, convertTextToExample, copyTextToClipboard } from '../../helpers';
import { routes } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import useBreakpoint from '../../hooks/useBreakPoint';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { changePart, changeQuestion, setEditPartQuestions } from '../../redux/slices/contestSlice';
import Select, { type SelectRef } from '../../components/Select';
import type { Sector } from '../../types/exam';

const cx = classNames.bind(styles);
const template =
    "'Phần 1\nCâu 1:\n*Đáp án A\nĐáp án B\nĐáp án C\n\nCâu 2:\nĐáp án A\n*Đáp án B\nĐáp án C\n\nCâu 3:\nĐáp án A\n*Đáp án B\nĐáp án C\n\n'Phần 2\nCâu 1:\n*Đáp án A\nĐáp án B\nĐáp án C\n\nCâu 2:\n*Đáp án A\nĐáp án B\nĐáp án C\n\n";
function CreateExample() {
    // Take example
    const { user } = useAuth();
    const keyRef = useRef<InputRef>(null);
    const typeRef = useRef<InputRef>(null);
    // end
    const { isMobile } = useBreakpoint();

    const { toastPromise } = useGlobalContext();
    // const [curentPart, setCurentPart] = useState(0);
    // const [curentQuestion, setCurentQuestion] = useState(0);
    const dispatch = useAppDispatch();
    const partQuestions = useAppSelector((state) => state.contest.partQuestions);
    const curentPart = useAppSelector((state) => state.contest.currentPart);
    const curentQuestion = useAppSelector((state) => state.contest.currentQuestion);
    const [sectorList, setSectorList] = useState<Sector[]>([]);

    const [textarea, setTextarea] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const nameExampleRef = useRef<InputRef>(null);
    const sectorRef = useRef<SelectRef<Sector>>(null);
    const creditsRef = useRef<InputRef>(null);
    const [creating, setCreating] = useState(false);

    const handleCreateExample = async () => {
        const count_question = partQuestions.reduce((total, item) => {
            total += item.questions.length;
            return total;
        }, 0);
        if (textarea.trim()) {
            const toastCreatExample = toastPromise('Đang tạo đề thi...');
            setCreating(true);
            try {
                await request.post('/create-example', {
                    name: nameExampleRef.current?.getValue(),
                    credits: creditsRef.current?.getValue(),
                    count_question,
                    sector: sectorRef.current?.getValue()?.id,
                    question: JSON.stringify(partQuestions),
                });
                toastCreatExample.success('Tạo đề thi thành công !');
                navigate(routes.myExam);
            } catch (error) {
                console.log(error);

                toastCreatExample.error('Tạo đề thi thất bại !');
            } finally {
                setCreating(false);
            }
        } else {
            toast('Đề thi không được để trống !');
        }
    };
    const handleClick = (e: ReactMouseEvent<HTMLInputElement>) => {
        e.currentTarget.value = ''; // reset file input
    };

    const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.extractRawText({ arrayBuffer });
            const text = result.value.replace(/\n\n/g, '\n');
            setTextarea(text.trim());
        } catch (error) {
            toast.error('Lỗi khi đọc file');
            console.error(error);
        }
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
        const objExample = convertTextToExample(textarea);

        if (textarea && textarea.trim()) {
            dispatch(setEditPartQuestions([...objExample]));
        } else {
            dispatch(setEditPartQuestions([]));
            dispatch(changePart(0));
        }
    }, [curentPart, curentQuestion, dispatch, textarea]);
    const question = partQuestions[curentPart]?.questions[curentQuestion];
    if (isMobile) {
        return (
            <div className={cx('err-wrapper')}>
                <div className={cx('not-support')}>
                    Trang web này không hỗ trợ mobile
                    <p>Click vào đây để trở lại</p>
                    <Button onClick={() => (location.key ? navigate(-1) : navigate('/'))} variant="primary">
                        Quay lại
                    </Button>
                </div>
            </div>
        );
    }
    return (
        <div className={cx('wraper')}>
            <div className={cx('edit', 'box')}>
                <h1>Thêm mới đề thi bằng văn bản</h1>
                <div className={cx('example-info')}>
                    <div className={cx('input-group')}>
                        <div style={{ display: 'flex', margin: '16px 0' }}>
                            <Input
                                ref={nameExampleRef}
                                validates={{ require: 'Bắt buộc nhập tên !' }}
                                title="Tên đề thi"
                                type="text"
                            ></Input>
                            <Input
                                style={{ margin: '0 16px' }}
                                validates={{
                                    require: 'Bắt buộc nhập số tín chỉ !',
                                    maxNumber: { value: 10, message: 'Số tín chỉ quá lớn' },
                                }}
                                ref={creditsRef}
                                title="Số tín chỉ"
                                type="number"
                            ></Input>
                            {/* Take example */}
                            {user?.role === 'admin' && (
                                <div>
                                    <Input ref={keyRef} title="Key"></Input>
                                    {/* <Input
                                        ref={typeRef}
                                        title="Type"
                                        type="select"
                                        data={[{ title: 'EDUQUIZ' }, { title: 'PESTHUBT' }]}
                                    ></Input> */}
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            const toastGetExample = toastPromise('Đang lấy dữ liệu');
                                            request
                                                .get('/getExampleQ', {
                                                    params: {
                                                        tagExample: keyRef.current?.getValue(),
                                                        type: typeRef.current?.getValue(),
                                                    },
                                                })
                                                .then((data) => {
                                                    setTextarea(convertExampleToText(data.data));
                                                    toastGetExample.success('Lấy dữ liệu thành công !');
                                                })
                                                .catch(() => {
                                                    toastGetExample.error('Không có đề thi nào vơi key trên');
                                                });
                                        }}
                                    >
                                        Clone
                                    </Button>
                                </div>
                            )}
                        </div>
                        <Select<Sector>
                            ref={sectorRef}
                            title="Chọn ngành"
                            validates={{ require: 'Bắt buộc chọn ngành' }}
                            items={sectorList}
                            placeholder="Chọn ngành"
                            filter={(items, search) =>
                                items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))
                            }
                            render={(item) => item.name}
                        />
                    </div>
                </div>
                <div className={cx('header_area')}>
                    <div className={cx('tutorial_cotainer')}>
                        <h1>Nơi để nhập đề thi</h1>
                        <Tippy
                            placement="bottom"
                            interactive={true}
                            offset={[235, 8]}
                            delay={[30, 30]}
                            maxWidth={550}
                            content={
                                <div className={cx('tutorial')}>
                                    <strong>Hướng dẫn:</strong>
                                    <ul className="list-disc list-inside">
                                        <li>
                                            <strong>Chia phần:</strong> Tên của mỗi phần bắt đầu bởi dấu{' '}
                                            <strong>(')</strong>
                                        </li>
                                        <li>
                                            <strong>Câu hỏi:</strong> Mỗi câu hỏi cách nhau bởi 2 đấu xuống dòng
                                        </li>
                                        <li>
                                            <strong>Câu trả lời:</strong> Câu trả lời là những dòng liên tiếp dưới câu
                                            hỏi
                                        </li>
                                        <li>
                                            <strong>Câu trả lời đúng:</strong> Là một câu trả lời có dấu{' '}
                                            <strong>(*)</strong> ở đằng trước
                                        </li>
                                        <div style={{ display: 'flex', margin: '4px' }}>
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    copyTextToClipboard(template);
                                                }}
                                            >
                                                Sao chép mẫu
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={() => {
                                                    setTextarea(template);
                                                }}
                                            >
                                                Sử dụng mẫu
                                            </Button>
                                        </div>
                                    </ul>
                                </div>
                            }
                        >
                            <Button className={cx('tutorial-btn')} icon={faQuestion}></Button>
                        </Tippy>
                    </div>
                    <label className={cx('file-upload')}>
                        <input type="file" accept=".doc,.docx" onClick={handleClick} onChange={handleChange} />
                        Nhập bằng file word
                    </label>
                </div>
                <div className={cx('core')}>
                    <textarea
                        spellCheck={false}
                        value={textarea}
                        onChange={(e) => {
                            setTextarea(e.target.value);
                        }}
                    ></textarea>
                </div>
                <p>Vui lòng soạn câu hỏi theo đúng cấu trúc</p>
                <div className={cx('button')}>
                    <Button
                        disable={creating}
                        onClick={handleCreateExample}
                        variant="primary"
                        validateInput={[nameExampleRef, creditsRef, sectorRef]}
                    >
                        Xác nhận
                    </Button>
                </div>
            </div>
            <div className={cx('preview', 'box')}>
                <div className={cx('header')}>
                    <h1>Xem trước đề thi</h1>
                </div>
                <div className={cx('content')}>
                    <div className={cx('part')}>
                        {partQuestions.map((part, index) => {
                            return (
                                <Button
                                    key={index}
                                    onClick={() => dispatch(changePart(index))}
                                    variant={curentPart === index ? 'primary' : 'outline'}
                                    size="small"
                                    className={cx('button')}
                                >
                                    {part.name}
                                </Button>
                            );
                        })}
                        {/* <Button primary small className={cx('button')}>
                            Phần 1
                        </Button> */}
                    </div>
                    <div className={cx('example-group')}>
                        <div className={cx('group-header')}>
                            <h1>Danh sách câu hỏi</h1>
                            <div className={cx('list')}>
                                {partQuestions[curentPart]?.questions.map((question, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            onClick={() => dispatch(changeQuestion(index))}
                                            variant={curentQuestion === index ? 'primary' : 'outline'}
                                            size="small"
                                            className={cx('button')}
                                        >
                                            {index + 1}
                                        </Button>
                                    );
                                })}
                                {/* <Button primary small className={cx('button')}>
                                    1
                                </Button> */}
                            </div>
                        </div>
                        <div className={cx('example')}>
                            <div className={cx('header')}>
                                <h1>Câu {curentQuestion + 1}</h1>
                            </div>
                            <div className={cx('card-content')}>
                                <div
                                    className={cx('question')}
                                    dangerouslySetInnerHTML={{
                                        __html: question?.name,
                                    }}
                                ></div>
                                <div className={cx('answer-group')}>
                                    {question?.answers.map((answer, index) => {
                                        const classes = cx('answer', {});
                                        const Icon = answer.is_correct ? (
                                            <FontAwesomeIcon color="green" icon={faCircleCheck}></FontAwesomeIcon>
                                        ) : (
                                            <FontAwesomeIcon color="red" icon={faCircleXmark}></FontAwesomeIcon>
                                        );
                                        return (
                                            <div key={index} className={classes}>
                                                {Icon}
                                                <p dangerouslySetInnerHTML={{ __html: answer.option }}></p>
                                            </div>
                                        );
                                    })}
                                    {/* <div className={cx('answer')}>
                                        <FontAwesomeIcon icon={faCircleXmark}></FontAwesomeIcon>
                                        <p>Đáp án A</p>
                                    </div>
                                     */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CreateExample;
