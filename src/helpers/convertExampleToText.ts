import type { PartQuestion } from '../types/exam';

const convertExampleToText = (partQuestions: PartQuestion[], charEnd: string = '\n', num: number | null = null) => {
    let result = '';
    partQuestions.some((part) => {
        result += "'" + part.name + charEnd;
        part.questions.some((question, index) => {
            if (question.img && question.img.length > 0) {
                result +=
                    (index === 0 ? '' : charEnd) +
                    question.name +
                    `<img src="https://pesthubt.s3-ap-southeast-1.amazonaws.com${question.img[0].url}" alt="">`.replace(
                        'm//',
                        'm/',
                    ) +
                    charEnd;
            } else {
                result += (index === 0 ? '' : charEnd) + question.name + charEnd;
            }
            question.answers.forEach((answer) => {
                // if (answer.is_correct) {
                //     result += (answer.is_correct ? '*' : '') + answer.option + charEnd;
                // }
                result += (answer.is_correct ? '*' : '') + answer.option + charEnd;
            });
            if (num !== null && index > num - 2) {
                return true;
            } else {
                return false;
            }
        });
        if (num) return true;
        return false;
    });
    return result;
};
export default convertExampleToText;
