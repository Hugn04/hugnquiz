import type { Contest, Example } from '../types/exam';

export default function extractExample(contest: Contest): Example {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { question, ...example } = contest;
    return example;
}
