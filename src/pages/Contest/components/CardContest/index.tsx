import classNames from 'classnames/bind';
import { faCircleArrowLeft, faCircleArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect } from 'react';

import styles from './CardContest.module.scss';
import Button from '../../../../components/Button';
import AnswerList from '../AnswerList';
import { useAppSelector } from '../../../../redux/hooks';
import { useDispatch } from 'react-redux';
import { changeQuestion, chooseAnswer } from '../../../../redux/slices/contestSlice';
const cx = classNames.bind(styles);
type CardContestProps = {
    className: string;
};

function CardContest({ className }: CardContestProps) {
    const dispatch = useDispatch();
    const timeSkipQuestion = useAppSelector((state) => state.contest.timeSkipQuestion);
    const curentPart = useAppSelector((state) => state.contest.currentPart);
    const currentQuestion = useAppSelector((state) => state.contest.currentQuestion);
    const partQuestions = useAppSelector((state) => state.contest.partQuestions);

    const handleChooseAnswer = (choose: number) => {
        dispatch(chooseAnswer(choose));
        if (timeSkipQuestion) {
            setTimeout(() => {
                handleChangeQuestion('next');
            }, timeSkipQuestion * 1000);
        }
    };

    const handleChangeQuestion = (type: 'prev' | 'next' | number) => {
        dispatch(changeQuestion(type));
        return;
    };
    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (!(curentPart === 0 && currentQuestion === 0)) {
                if (e.key === 'ArrowLeft') {
                    handleChangeQuestion('prev');
                }
            }
            if (
                !(
                    curentPart === partQuestions.length - 1 &&
                    currentQuestion === partQuestions[curentPart].questions.length - 1
                )
            ) {
                if (e.key === 'ArrowRight') {
                    handleChangeQuestion('next');
                }
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [curentPart, currentQuestion],
    );
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handleKeyDown]);
    return (
        <div className={cx('contest', className)}>
            <div className={cx('header')}>
                <div>Câu {currentQuestion + 1}</div>
            </div>
            <div className={cx('content')}>
                <div
                    dangerouslySetInnerHTML={{ __html: partQuestions[curentPart]?.questions[currentQuestion]?.name }}
                ></div>
                <hr></hr>
                <AnswerList
                    question={partQuestions[curentPart]?.questions[currentQuestion]}
                    handleChooseAnswer={handleChooseAnswer}
                ></AnswerList>
            </div>
            <div className={cx('example-control')}>
                <Button
                    onClick={() => handleChangeQuestion('prev')}
                    disable={curentPart === 0 && currentQuestion === 0}
                    variant="primary"
                    leftIcon={faCircleArrowLeft}
                >
                    Trước
                </Button>
                <Button
                    onClick={() => handleChangeQuestion('next')}
                    disable={
                        curentPart === partQuestions.length - 1 &&
                        currentQuestion === partQuestions[curentPart].questions.length - 1
                    }
                    variant="primary"
                    rightIcon={faCircleArrowRight}
                >
                    Sau
                </Button>
            </div>
        </div>
    );
}

export default CardContest;
