import type { PartQuestion } from '../types/exam';

const getExampleRetry = (partQuestions: PartQuestion[]) => {
    const newExample = JSON.parse(JSON.stringify(partQuestions)) as PartQuestion[];
    newExample.forEach((part) => {
        part.questions = part.questions.filter((question) => {
            // if(question.choose === undefined)
            if (question.choose !== undefined) {
                return !question.answers[question.choose].is_correct;
            }
            return true;
        });
        part.questions.forEach((question) => {
            if (question.choose !== undefined) {
                if (!question.answers[question?.choose].is_correct) {
                    delete question.choose;
                }
            }
        });
    });

    return newExample;
};
export default getExampleRetry;
