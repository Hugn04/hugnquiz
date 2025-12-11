import { faGear } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames/bind';
import { useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './PopupStart.module.scss';
import { type InputRef } from '../Input';
import Button from '../Button';
import Popup from 'reactjs-popup';
import { getObjStyleClassName } from '../../helpers';
import { routes } from '../../config';

const cx = classNames.bind(styles);
const contentStyle = getObjStyleClassName(cx('content-popup'));
const overlayStyle = getObjStyleClassName(cx('overlay'));
type PopupStartProps = { trigger: ReactNode; idExample: number };
function PopupStart({ trigger, idExample = 0 }: PopupStartProps) {
    const delayNext = useRef<InputRef>(null);
    const isQuestionShuffle = useRef<HTMLInputElement>(null);
    const isAnswerShuffle = useRef<HTMLInputElement>(null);
    const test = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    return (
        <Popup trigger={trigger} modal nested {...{ contentStyle, overlayStyle }}>
            <div className={cx('option-popup')}>
                <h1>CHỌN CHẾ ĐỘ THI</h1>
                <div className={cx('title-popup')}>
                    <FontAwesomeIcon icon={faGear}></FontAwesomeIcon>
                    <h3>Cài đặt đề thi</h3>
                </div>

                <div className={cx('group-input')}>
                    <div>
                        <input ref={isQuestionShuffle} type="checkbox"></input>
                        <label>Tự động đảo câu hỏi</label>
                    </div>
                    <div>
                        <input ref={isAnswerShuffle} type="checkbox"></input>
                        <label>Tự động đảo câu trả lời</label>
                    </div>
                    <div style={{ display: 'none' }}>
                        <input ref={test} type="checkbox"></input>
                        <label>Thi thử</label>
                    </div>
                </div>
                {/* <div className={cx('time')}>
                    <Input
                        title="Tự động chuyển câu"
                        type="select"
                        defaultValue="1"
                        ref={delayNext}
                        data={[
                            { title: 'Tắt', value: 0 },
                            { title: '1s', value: 1 },
                            { title: '2s', value: 2 },
                            { title: '3s', value: 3 },
                        ]}
                    ></Input>
                </div> */}

                <Button
                    onClick={() => {
                        navigate(routes.conTest(idExample.toString()), {
                            state: {
                                delayNext: delayNext?.current?.getValue(),
                                isQuestionShuffle: isQuestionShuffle?.current?.checked,
                                isAnswerShuffle: isAnswerShuffle?.current?.checked,
                                test: test?.current?.checked,
                            },
                        });
                    }}
                    className={cx('start-example')}
                    variant="primary"
                >
                    Bắt đầu vào thi
                </Button>
            </div>
        </Popup>
    );
}

export default PopupStart;
