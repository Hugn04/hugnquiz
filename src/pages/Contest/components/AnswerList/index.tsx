import classNames from 'classnames/bind';
import styles from './AnswerList.module.scss';
import Button from '../../../../components/Button';
import { useEffect, useState } from 'react';
import type { Question } from '../../../../types/exam';
const cx = classNames.bind(styles);
type AnswerListProps = {
    question: Question;
    handleChooseAnswer: (choose: number) => void;
};
function AnswerList({ question, handleChooseAnswer }: AnswerListProps) {
    const [choose, setChoose] = useState(question?.choose);

    useEffect(() => {
        setChoose(question?.choose);
    }, [question]);

    return (
        <div className={cx('answer-list')}>
            {question?.answers?.map((answer, index) => {
                const isCorrect = choose !== undefined && answer.is_correct;
                return (
                    <Button
                        onClick={() => {
                            setChoose(index);
                            handleChooseAnswer(index);
                            // isCorrect = null;
                        }}
                        disable={choose !== undefined}
                        userselect={choose !== undefined}
                        key={index}
                        className={cx('button')}
                    >
                        <div className={cx('answer-item')}>
                            <input type="radio" readOnly checked={choose === index}></input>
                            <div
                                className={cx('answer-content', {
                                    correct: isCorrect,
                                    wrong: !isCorrect && choose === index,
                                })}
                                dangerouslySetInnerHTML={{ __html: answer.option }}
                            ></div>
                        </div>
                    </Button>
                );
            })}
        </div>
    );
}

export default AnswerList;
