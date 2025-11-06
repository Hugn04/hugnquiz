import { useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import request from '../utils/request';
import { useGlobalContext } from '../hooks/useGlobalContext';
import { routes } from '../config';
import { disconnectSocket } from '../utils/socket';
import { useDispatch } from 'react-redux';
import type { LoginInfo, User, UserLogin } from '../types/auth';
import { AuthContext } from '../context/AuthContext';
interface AuthProviderProps {
    children: ReactNode;
}
export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useLocalStorage<User | null>('user', null);
    const navigate = useNavigate();
    const { toastPromise } = useGlobalContext();
    const dispatch = useDispatch();

    const login = async (info: LoginInfo | string) => {
        const toastLogin = toastPromise('Đang đăng nhập...');
        try {
            let dataUser: UserLogin | null = null;
            if (typeof info === 'string') {
                const { data } = await request.post('/auth/google', { id_token: info });
                dataUser = data;
            } else {
                const { data } = await request.post<UserLogin>('login', info);
                dataUser = data;
            }

            await setUser(dataUser?.user ?? null);
            toastLogin.success('Đăng nhập thành công');
            navigate(routes.home);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            toastLogin.error(error.response ? error.response.data.message : error.message || error);
            navigate(routes.login);
            return true;
        }
    };

    const logout = async () => {
        const toastLogout = toastPromise('Đang đăng xuất...');
        try {
            await request.get('logout');
            setUser(null);
            toastLogout.success('Đã đăng xuất thành công !');
            navigate(routes.home, { replace: true });
        } catch (error) {
            console.log(error);

            toastLogout.error('Đăng xuất thất bại !');
        }
    };

    const auth = async (redirect = true) => {
        try {
            const { data } = await request.get<User>('auth');
            if (JSON.stringify(user) !== JSON.stringify(data)) {
                await setUser(data);
            }
            return true;
        } catch (error) {
            console.log(error);

            dispatch({ type: 'RESET_STORE' });
            setUser(null);
            disconnectSocket();
            if (redirect) {
                navigate(routes.login, { replace: true });
            }
            return false;
        }
    };

    const value = useMemo(
        () => ({
            user,
            login,
            logout,
            auth,
        }),
        [user], // eslint-disable-line react-hooks/exhaustive-deps
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
