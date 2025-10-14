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
    // thêm các trường khác nếu cần
}

export interface AuthContextType {
    user: User | null;
    login: (info: LoginInfo) => Promise<void | boolean>;
    logout: () => Promise<void>;
    auth: (redirect?: boolean) => Promise<boolean>;
}
