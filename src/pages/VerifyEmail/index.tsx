import classNames from 'classnames/bind';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useRef } from 'react';

import styles from './VerifyEmail.module.scss';
import Button from '../../components/Button';
import Time from '../../components/Time';
import request from '../../utils/request';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { routes } from '../../config';
import OTPInput, { type OTPInputRef } from '../../components/OTPInput';
const cx = classNames.bind(styles);
function VerifyEmail() {
    const { state } = useLocation();
    const otp = useRef<OTPInputRef>(null);
    const { toastPromise } = useGlobalContext();
    const navigate = useNavigate();
    if (!state) {
        return <Navigate to={routes.home}></Navigate>;
    }
    return (
        <div className={cx('wraper')}>
            <div className={cx('header')}>
                <h1>Xác nhận email</h1>
                <p>
                    Mã OTP đã được gửi đến email <i style={{ color: 'var(--text-color)' }}>{state && state.email}</i>{' '}
                    bạn vui lòng kiểm tra email để lấy mã OTP
                </p>
            </div>
            <div className={cx('content')}>
                <OTPInput ref={otp}></OTPInput>
                <Time className={cx('time')} time={300} countDown>
                    <h2>Thời gian còn lại: </h2>
                </Time>
            </div>
            <Button
                onClick={() => {
                    if (state.name) {
                        const toastRegister = toastPromise('Đang đăng ký...');
                        request
                            .post('register', {
                                name: state.name,
                                email: state.email,
                                password: state.password,
                                otp: otp.current?.getValue(),
                            })
                            .then(() => {
                                toastRegister.success('Tạo tài khoản thành công !');
                                navigate(routes.home);
                            })
                            .catch((error) => {
                                toastRegister.error(error.response && error.response.data);
                            });
                    } else {
                        const toastForgotPassword = toastPromise('Đang lấy lại mật khẩu ...');
                        request
                            .post('forgot_password', {
                                email: state.email,
                                otp: otp.current?.getValue(),
                            })
                            .then((succ) => {
                                toastForgotPassword.success(succ?.data);
                                navigate(routes.home);
                            })
                            .catch((error) => {
                                toastForgotPassword.error(error.response && error.response.data);
                            });
                    }
                }}
                className={cx('button')}
                variant="primary"
                validateInput={[otp]}
            >
                Xác nhận
            </Button>
        </div>
    );
}

export default VerifyEmail;
