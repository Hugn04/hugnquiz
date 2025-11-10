// redux/contestSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { PartQuestion } from '../../types/exam';

interface ContestState {
    partQuestions: PartQuestion[];
    currentPart: number;
    currentQuestion: number;
    numQuestion: number;
    timeSkipQuestion: number;
    result: { correct: number; wrong: number };
}

const initState: ContestState = {
    partQuestions: [],
    currentPart: 0,
    numQuestion: 0,
    currentQuestion: 0,
    timeSkipQuestion: 1,
    result: { correct: 0, wrong: 0 },
};

const contestSlice = createSlice({
    name: 'contest',
    initialState: initState,
    reducers: {
        setPartQuestions: (state, action: PayloadAction<PartQuestion[]>) => {
            state.partQuestions = action.payload;
            const num = action.payload.reduce((total, item) => {
                return total + item.questions.length;
            }, 0);
            state.numQuestion = num;
            state.currentPart = 0;
            state.currentQuestion = 0;
            state.result.correct = 0;
            state.result.wrong = 0;
        },
        setEditPartQuestions: (state, action: PayloadAction<PartQuestion[]>) => {
            const objExample = action.payload;
            if (!objExample[state.currentPart]) {
                state.currentPart = objExample.length - 1;
                // setCurentPart(objExample.length - 1);
            } else {
                const curentPartExample = objExample[state.currentPart].questions;
                if (!curentPartExample[state.currentQuestion]) {
                    state.currentQuestion = curentPartExample.length - 1;
                    // setCurentQuestion(curentPartExample.length - 1);
                }
            }
            state.partQuestions = action.payload;
            const num = action.payload.reduce((total, item) => {
                return total + item.questions.length;
            }, 0);
            state.numQuestion = num;
        },
        chooseAnswer: (state, action: PayloadAction<number>) => {
            const question = state.partQuestions[state.currentPart].questions[state.currentQuestion];
            question.choose = action.payload;
            if (question.answers[action.payload].is_correct) {
                state.result.correct += 1;
            } else {
                state.result.wrong += 1;
            }
        },
        changeQuestion: (state, action: PayloadAction<number | 'next' | 'prev'>) => {
            const type = action.payload;
            const endPart = state.partQuestions[state.currentPart].questions.length - 1;
            if (typeof type === 'string') {
                if (type === 'next') {
                    if (state.currentQuestion < endPart) {
                        state.currentQuestion += 1;
                    } else if (state.currentPart < state.partQuestions.length - 1) {
                        state.currentPart += 1;
                        state.currentQuestion = 0;
                    }
                }
                if (type === 'prev') {
                    if (state.currentQuestion <= 0) {
                        state.currentPart -= 1;
                    } else {
                        state.currentQuestion -= 1;
                    }
                }
            } else {
                state.currentQuestion = type;
            }
        },
        changePart: (state, action: PayloadAction<number>) => {
            state.currentPart = action.payload;
            state.currentQuestion = 0;
        },
    },
});

export const { setPartQuestions, chooseAnswer, changeQuestion, changePart, setEditPartQuestions } =
    contestSlice.actions;
export default contestSlice.reducer;
