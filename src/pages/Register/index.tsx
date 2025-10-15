import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import 'react-toastify/ReactToastify.min.css';

import Button from '../../components/Button';
import styles from './Register.module.scss';
import Input, { type InputRef } from '../../components/Input';
import request from '../../utils/request';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { routes } from '../../config';
import type { AxiosError } from 'axios';
const cx = classNames.bind(styles);
function Login() {
    const name = useRef<InputRef>(null);
    const email = useRef<InputRef>(null);
    const password = useRef<InputRef>(null as unknown as InputRef);
    const confirmPassword = useRef<InputRef>(null);
    const btnRegister = useRef<HTMLButtonElement>(null);
    const navigate = useNavigate();
    const { toastPromise } = useGlobalContext();
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            if (btnRegister.current) {
                btnRegister.current.click();
            }
        }
    };

    return (
        <div className={cx('wraper')}>
            <div>
                <Input
                    ref={name}
                    placeholder="Nhập họ và tên"
                    validates={{ require: 'Bắt buộc nhập tên !' }}
                    onKeyDown={handleKeyDown}
                    autoComplete="name"
                ></Input>
                <Input
                    ref={email}
                    type="email"
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
                        min: { value: 6, message: 'Mật khẩu tối thiểu phải 6 ký tự !' },
                    }}
                    onKeyDown={handleKeyDown}
                ></Input>
                <Input
                    ref={confirmPassword}
                    type="password"
                    placeholder="Gõ lại mật khẩu"
                    validates={{
                        require: 'Hãy gõ lại mật khẩu !',
                        confirm: { value: password, message: 'Mật khẩu gõ lại không đúng !' },
                    }}
                    onKeyDown={handleKeyDown}
                ></Input>
            </div>

            <div className={cx('login-wraper')}>
                <Button
                    ref={btnRegister}
                    onClick={async () => {
                        const toastRegister = toastPromise('Đang đăng ký...');
                        try {
                            await request.post('verify_register', { email: email?.current?.getValue() });
                            toastRegister.success('Thông tin nhập vào thành công. Mời bạn xác thực email !');
                            navigate(routes.verifyEmail, {
                                state: {
                                    name: name?.current?.getValue(),
                                    email: email?.current?.getValue(),
                                    password: password.current.getValue(),
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
                        }
                    }}
                    className={cx('btn-login')}
                    variant="primary"
                    validateInput={[name, email, password, confirmPassword]}
                >
                    Đăng ký
                </Button>
            </div>
            <hr></hr>
            <div className={cx('register-wraper')}>
                <Button to={routes.login} variant="primary" className={cx('btn-register')}>
                    Đăng nhập
                </Button>
            </div>
        </div>
    );
}

export default Login;
