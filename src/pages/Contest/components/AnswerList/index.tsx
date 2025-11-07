import classNames from 'classnames/bind';
import styles from './AnswerList.module.scss';
import Button from '../../../../components/Button';
import type { Question } from '../../../../types/exam';
const cx = classNames.bind(styles);
type AnswerListProps = {
    question: Question;
    handleChooseAnswer: (choose: number) => void;
};
function AnswerList({ question, handleChooseAnswer }: AnswerListProps) {
    return (
        <div key={Math.random()} className={cx('answer-list')}>
            {question.answers.map((answer, index) => {
                const isSelected = question.choose === index;
                const showResult = question.choose !== undefined;
                const isCorrect = showResult && answer.is_correct;
                const isWrong = showResult && isSelected && !answer.is_correct;

                return (
                    <Button
                        key={index}
                        onClick={() => handleChooseAnswer(index)}
                        className={cx('button')}
                        disable={showResult}
                        userselect={showResult}
                    >
                        <div className={cx('answer-item')}>
                            <input type="radio" readOnly checked={isSelected} />
                            <div
                                className={cx('answer-content', {
                                    correct: showResult && isCorrect,
                                    wrong: showResult && isWrong,
                                })}
                                dangerouslySetInnerHTML={{ __html: answer.option }}
                            />
                        </div>
                    </Button>
                );
            })}
        </div>
    );
}

export default AnswerList;
