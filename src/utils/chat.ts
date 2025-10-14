import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';

const chat: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_CHAT_API as string,
    headers: {
        Accept: 'application/json',
    },
});

// Hàm đệ quy: chuyển string số sang number
const convertStringToNumber = (data: unknown): unknown => {
    if (typeof data === 'object' && data !== null) {
        for (const key in data as Record<string, unknown>) {
            const value = (data as Record<string, unknown>)[key];
            if (typeof value === 'string' && !isNaN(Number(value))) {
                (data as Record<string, unknown>)[key] = Number(value);
            } else if (typeof value === 'object') {
                convertStringToNumber(value);
            }
        }
    }
    return data;
};

// Interceptor xử lý response
chat.interceptors.response.use(
    (response: AxiosResponse) => {
        response.data = convertStringToNumber(response.data);
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

chat.defaults.withCredentials = true;
chat.defaults.withXSRFToken = true;

export default chat;
