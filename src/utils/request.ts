import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios';

const request: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API as string, // ép kiểu string
    headers: {
        Accept: 'application/json',
    },
});

// Hàm convert, nhận bất kỳ object nào, trả về cùng type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const convertStringToNumber = (data: any): any => {
    if (typeof data === 'object' && data !== null) {
        Object.keys(data).forEach((key) => {
            const value = data[key];
            if (typeof value === 'string' && !isNaN(Number(value))) {
                data[key] = Number(value);
            } else if (typeof value === 'object' && value !== null) {
                data[key] = convertStringToNumber(value);
            }
        });
    }
    return data;
};

request.interceptors.response.use(
    (response: AxiosResponse) => {
        response.data = convertStringToNumber(response.data);
        return response;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    },
);

request.defaults.withCredentials = true;
request.defaults.withXSRFToken = true;

export default request;
