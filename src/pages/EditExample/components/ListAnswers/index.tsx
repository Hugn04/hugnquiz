import classNames from 'classnames/bind';
import { forwardRef, useEffect, useImperativeHandle, useState, type ChangeEvent } from 'react';

import styles from './ListAnswers.module.scss';
import Button from '../../../../components/Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import type { Answer } from '../../../../types/exam';

const cx = classNames.bind(styles);

type ListAnswersProps = {
    isChange: () => boolean;
    save: () => void;
    data: Answer[];
};

export interface ListAnswersRef {
    getAnswers: () => Answer[];
}

const ListAnswers = forwardRef<ListAnswersRef, ListAnswersProps>(({ isChange, save, data }, ref) => {
    const [answers, setAnswers] = useState<Answer[]>(data);
    const [changed, setChanged] = useState<boolean>(false);

    useEffect(() => {
        // Reset lại danh sách khi data thay đổi
        setAnswers(JSON.parse(JSON.stringify(data)));
    }, [data]);

    useEffect(() => {
        setChanged(isChange());
        // answers.forEach((item, index) => {
        //     if (item.is_correct) setChecked(index);
        // });
    }, [answers, isChange]);

    useImperativeHandle(ref, () => ({
        getAnswers() {
            return answers;
        },
    }));

    const handleChangeAnswer = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
        setAnswers((prev) => {
            const newAnswers = [...prev];
            newAnswers[index].option = e.target.value;
            return newAnswers;
        });
    };

    const handleChecked = (index: number) => {
        setAnswers((prev) => {
            const newAnswers = [...prev].map((item, i) => ({
                ...item,
                is_correct: i === index,
            }));
            return newAnswers;
        });
    };

    return (
        <div className={cx('wrapper')}>
            {answers.map((answer, index) => (
                <div className={cx('answer-group')} key={index}>
                    <input
                        className={cx('check')}
                        checked={answer.is_correct}
                        onChange={() => handleChecked(index)}
                        type="radio"
                    />
                    <textarea
                        value={answer.option}
                        onChange={(e) => handleChangeAnswer(e, index)}
                        spellCheck={false}
                        className={cx('input-area')}
                    />
                    <Button
                        className={cx('button')}
                        onClick={() =>
                            setAnswers((prev) => {
                                const newAnswers = [...prev];
                                newAnswers.splice(index, 1);
                                return newAnswers;
                            })
                        }
                        variant="primary"
                        icon={faTrash}
                    />
                </div>
            ))}
            <div className={cx('action')}>
                <Button
                    variant="primary"
                    disable={answers[answers.length - 1] ? answers[answers.length - 1].option === '' : false}
                    onClick={() => setAnswers((prev) => [...prev, { option: '', is_correct: false }])}
                >
                    Thêm câu trả lời
                </Button>
                <div style={{ display: 'flex' }}>
                    <Button disable={!changed} variant="primary" onClick={() => save()}>
                        Chấp nhận
                    </Button>
                    <Button
                        disable={!changed}
                        variant="danger"
                        onClick={() => {
                            setAnswers(JSON.parse(JSON.stringify(data)));
                        }}
                    >
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default ListAnswers;
