import type { User } from './auth';

export interface Example {
    id: number;
    like: number;
    favorited: number;
    created_at: string;
    name: string;
    image: string;
    email: string;
    user_id: number;
    avatar: string;
    role: string;
    username: string;
    num_question: number;
    count_test: number;
    count_like: number;
    credits: number;
    sector: string;
}

export interface Pagegination {
    current_page: number;
    data: Example[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Links[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}
export type Links = { url: null | string; label: string; active: boolean };

export interface MyScore extends Score {
    ranking: number;
}
export interface Score {
    created_at: string;
    example_id: string;
    id: number;
    ranking: number;
    score: number;
    updated_at: string;
    user: User;
    user_id: number;
}

export interface PartQuestion {
    name: string;
    questions: Question[];
}
export interface Question {
    img?: string[{ url: string }];
    name: string;
    answers: Answer[];
    choose?: number;
}
export interface Answer {
    is_correct: boolean;
    option: string;
}
