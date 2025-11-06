import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import 'react-toastify/ReactToastify.min.css';

import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import styles from './Login.module.scss';
import Input, { type InputRef } from '../../components/Input';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { routes } from '../../config';
import request from '../../utils/request';
import type { AxiosError } from 'axios';
import LoginWithGoogle from '../../components/LoginWithGoogle';

const cx = classNames.bind(styles);
function Login() {
    const { login } = useAuth();
    const [loginFalse, setLoginFalse] = useState(false);
    const email = useRef<InputRef>(null as unknown as InputRef);
    const password = useRef<InputRef>(null as unknown as InputRef);
    const btnLogin = useRef<HTMLButtonElement>(null);
    const { toastPromise } = useGlobalContext();
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoginFalse(true);
        await login({ email: email?.current?.getValue() ?? '', password: password?.current?.getValue() ?? '' });
        setLoginFalse(false);
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            btnLogin?.current?.click();
        }
    };

    return (
        <div className={cx('wraper')}>
            <div>
                <Input
                    ref={email}
                    placeholder="Email hoặc số điện thoại"
                    validates={{ require: 'Bắt buộc nhập email !', email: 'Đây không phải email !' }}
                    onKeyDown={handleKeyDown}
                    autoComplete="email"
                ></Input>
                <Input
                    ref={password}
                    type="password"
                    placeholder="Mật khẩu"
                    validates={{
                        require: 'Bắt buộc nhập mật khẩu !',
                        min: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự !' },
                    }}
                    onKeyDown={handleKeyDown}
                ></Input>
            </div>

            <div className={cx('login-wraper')}>
                <Button
                    variant="primary"
                    size="small"
                    ref={btnLogin}
                    onClick={handleLogin}
                    disable={loginFalse}
                    className={cx('btn-login')}
                    validateInput={[email, password]}
                >
                    Đăng nhập
                </Button>
            </div>
            <div className={cx('login-google')}>
                <LoginWithGoogle></LoginWithGoogle>
            </div>
            <div className={cx('forgot-pwr')}>
                <Button
                    variant="link"
                    onClick={async () => {
                        const toastRegister = toastPromise('Đang đăng ký...');
                        const emailValue = email?.current?.getValue();
                        try {
                            await request.post('verify_forgot_password', { email: emailValue });
                            toastRegister.success('Thông tin nhập vào thành công. Mời bạn xác thực email !');
                            navigate(routes.verifyEmail, {
                                state: {
                                    email: emailValue,
                                },
                            });
                        } catch (error) {
                            const err = error as AxiosError<{ message?: string }>;

                            // Nếu có phản hồi từ server
                            if (err.response) {
                                toastRegister.error(err.response.data?.message || 'Đã xảy ra lỗi khi gửi email!');
                            } else {
                                toastRegister.error('Không thể kết nối tới máy chủ!');
                            }
                            // toastRegister.error(error.response ? error.response.data : error);
                        }
                    }}
                    validateInput={[email]}
                >
                    Quên mật khẩu
                </Button>
            </div>
            <hr></hr>
            <div className={cx('register-wraper')}>
                <Button to={routes.register} variant="primary" className={cx('btn-register')}>
                    Đăng ký tài khoản
                </Button>
            </div>
        </div>
    );
}

export default Login;
