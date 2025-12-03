import type { User, UserAction } from './auth';

export interface BaseExample {
    id: number;
    name: string;
    count_test: number;
    count_like: number;
    sector: Sector;
    image: string | null;
    credits: number;
    num_question: number;
    created_at: string;
    updated_at: string;
    user_id: number;
    question_id: number;
    user_action: UserAction;
}

export interface Example extends BaseExample {
    user: User;
}
export interface Contest extends Example {
    question: PartQuestion[];
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
export interface Sector {
    id: number;
    name: string;
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
