import type { Answer, PartQuestion, Question } from '../types/exam';

const splitPart = (text: string): string[] => {
    const delimiter = "\n'";
    const regex = new RegExp(`(${delimiter})`);

    const result = text.split(regex).filter(Boolean);
    const finalResult = result
        .map((item, index) => {
            if (index > 0 && item !== delimiter) {
                return "'" + item;
            }
            return item;
        })
        .filter((item) => item !== delimiter);

    return finalResult;
};

const convertTextToExample = (text: string): PartQuestion[] => {
    const objExample = splitPart(text);
    const result = objExample.reduce((total: PartQuestion[], stringExample) => {
        //console.log(index, 'example', objExample);
        let namePart = '';
        const example = stringExample.split(/(\n{2,})/).filter((dong) => dong.trim() !== '');
        const questions = example.reduce((total: Question[], value, index) => {
            const arrExample = value.split('\n').filter((dong) => dong.trim() !== '');
            //console.log(index, arrExample);
            if (index === 0) {
                namePart = arrExample[0][0] === "'" ? arrExample.splice(0, 1)[0].replace("'", '') : 'Phần 1';
            }
            const nameQuestion = arrExample.splice(0, 1)[0];

            const answers = arrExample.reduce((total: Answer[], value) => {
                const answer = value.replace('*', '');
                total.push({ option: answer, is_correct: value[0] === '*' });
                return total;
            }, []);
            total.push({ name: nameQuestion, answers: answers });
            return total;
        }, []);

        total.push({ name: namePart, questions: questions });
        return total;
    }, []);
    return result;
};

export default convertTextToExample;
