export interface LoginInfo {
    email: string;
    password: string;
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar: string;
}
export interface UserLogin {
    user: User;
    token: string;
}

export interface UserAction {
    id: number;
    like: boolean;
    favorited: boolean;
    user_id: number;
    example_id: number;
}

export interface AuthContextType {
    user: User | null;
    login: (info: LoginInfo | string) => Promise<void | boolean>;
    logout: () => Promise<void>;
    auth: (redirect?: boolean) => Promise<boolean>;
}
