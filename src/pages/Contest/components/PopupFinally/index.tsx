import classNames from 'classnames/bind';
import Popup from 'reactjs-popup';
// import htmlDocx from 'html-docx-js/dist/html-docx';

import styles from './PopupFinally.module.scss';
import Button from '../../../../components/Button';
import { getObjStyleClassName } from '../../../../helpers';
import { convertExampleToText } from '../../../../helpers';
import images from '../../../../assets/images';
import { routes } from '../../../../config';
import type { PartQuestion } from '../../../../types/exam';
import { useAppSelector } from '../../../../redux/hooks';
const cx = classNames.bind(styles);

const contentStyle = getObjStyleClassName(cx('content-popup'));
const overlayStyle = getObjStyleClassName(cx('overlay'));
const arrowStyle = getObjStyleClassName(cx()); // style for an svg element
type PopupFinallyProps = {
    partQuestions: PartQuestion[];
    onOpen: () => void;
    exampleResult: {
        id: number;
        name: string;
        // correct: result.correct,
        // score: (10 / (example?.num_question ?? 0)) * result.correct,
        time: string;
    };
    handleRetry: () => void;
    handleRetryExample: () => void;
};
function PopupFinally({
    partQuestions,
    onOpen = () => {},
    exampleResult,
    handleRetry = () => {},
    handleRetryExample = () => {},
}: PopupFinallyProps) {
    // const downloadDocx = (content, fileName = 'document.docx') => {
    //     const converted = htmlDocx.asBlob(content);
    //     const url = URL.createObjectURL(converted);
    //     const a = document.createElement('a');
    //     a.href = url;
    //     a.download = fileName;
    //     document.body.appendChild(a);
    //     a.click();
    //     document.body.removeChild(a);
    // };
    const numQuestion = useAppSelector((state) => state.contest.numQuestion);
    const result = useAppSelector((state) => state.contest.result);
    const score = (10 / (numQuestion ?? 0)) * result.correct;
    const getRate = (score: number) => {
        if (score === 10) {
            return {
                type: 'perfect',
                title: 'Xuất sắc',
                advice: 'Bạn đã làm rất tốt! Hãy tiếp tục duy trì phong độ này nhé!',
            };
        } else if (score > 8) {
            return {
                type: 'good',
                title: 'Giỏi',
                advice: 'Kết quả tuyệt vời! Hãy tiếp tục rèn luyện để vươn tới sự hoàn hảo!',
            };
        } else if (score > 6.5) {
            return {
                type: 'average',
                title: 'Khá',
                advice: 'Bạn học khá tốt! Cố gắng tập trung hơn vào những điểm chưa vững nhé!',
            };
        } else if (score > 4) {
            return {
                type: 'poor',
                title: 'Trung bình',
                advice: 'Bạn cần cố gắng hơn! Hãy dành thêm thời gian ôn tập và thực hành!',
            };
        } else {
            return {
                type: 'bad',
                title: 'Yếu',
                advice: 'Đừng nản lòng! Hãy tìm ra điểm yếu của mình và học hỏi từ những sai lầm!',
            };
        }
    };

    // useEffect(() => {
    //     request
    //         .post('update-score', { example_id: exampleResult.id, score: Math.round(score * 10) / 10 })
    //         .then((data) => {
    //             console.log(data);
    //         })
    //         .catch((err) => console.log(err));
    // }, [exampleResult.id, score]);
    return (
        <Popup open modal onOpen={onOpen} onClose={handleRetry} {...{ contentStyle, overlayStyle, arrowStyle }}>
            <div className={cx('wrapper')}>
                <div className={cx('title')}>
                    <h1>KẾT QUẢ LÀM BÀI THI</h1>
                    <h1>{exampleResult.name}</h1>
                </div>
                <div className={cx('content')}>
                    <div className={cx('result')}>
                        <div className={cx('image')}>
                            <div className={cx('title')}>Chúc mừng</div>
                            <img src={images.finallyGif} alt="Chúc mừng"></img>
                            <div>Bạn đã hoàn thành phần thi</div>
                        </div>
                        <div className={cx('info')}>
                            <div className={cx('score')}>{Math.round(score * 10) / 10} điểm</div>

                            <div className={cx('rate')}>
                                Xếp loại:
                                <div className={cx('rate-content', getRate(score).type)}>{getRate(score).title}</div>
                            </div>
                            <div className={cx('advice')}>{getRate(score).advice}</div>
                            <div className={cx('detail')}>
                                <div>
                                    Số câu đúng: {result.correct}/{numQuestion}
                                </div>
                                <div>Thời gian làm bài: {exampleResult.time}</div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={cx('word_example')}
                        dangerouslySetInnerHTML={{ __html: convertExampleToText(partQuestions, '<br>') }}
                    ></div>
                </div>
                <div className={cx('action')}>
                    <Button
                        variant="primary"
                        // onClick={() => {
                        //     const content = document.querySelector('.' + cx('word_example')).innerHTML;
                        //     downloadDocx(content);
                        // }}
                    >
                        Tải đề thi
                    </Button>
                    <Button variant="primary" onClick={handleRetryExample}>
                        Làm lại câu sai
                    </Button>
                    <Button variant="primary" onClick={handleRetry}>
                        Làm lại bài thi
                    </Button>
                    <Button variant="primary" to={routes.exam} style={{ background: 'red' }}>
                        Thoát
                    </Button>
                </div>
            </div>
        </Popup>
    );
}

export default PopupFinally;
