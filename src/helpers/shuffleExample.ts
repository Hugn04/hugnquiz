import type { PartQuestion } from '../types/exam';

/**
 * Hàm shuffle array
 */
function shuffle<T>(array: T[]): T[] {
    let ctr = array.length,
        temp: T,
        index: number;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = array[ctr];
        array[ctr] = array[index];
        array[index] = temp;
    }
    return array;
}

/**
 * Shuffle exam questions / answers
 */
const shuffleExample = (exam: PartQuestion[], isQuestionShuffle: boolean, isAnswerShuffle: boolean): PartQuestion[] => {
    const newExam = [...exam];

    if (isAnswerShuffle || isQuestionShuffle) {
        newExam.forEach((item) => {
            if (isAnswerShuffle) {
                item.questions.forEach((question) => {
                    shuffle(question.answers);
                });
            }

            if (isQuestionShuffle) {
                shuffle(item.questions);
            }
        });
    }

    return newExam;
};

export default shuffleExample;
