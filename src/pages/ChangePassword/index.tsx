import classNames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import { useRef, useState } from 'react';
import 'react-toastify/ReactToastify.min.css';

import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import styles from './ChangePassword.module.scss';
import Input, { type InputRef } from '../../components/Input';
import { useGlobalContext } from '../../hooks/useGlobalContext';
import { routes } from '../../config';
import request from '../../utils/request';

const cx = classNames.bind(styles);
function ChangePassword() {
    const { user } = useAuth();
    const [changeFalse, setChangeFalse] = useState(false);
    const oldPassword = useRef<InputRef>(null);
    const newPassword = useRef<InputRef>(null);
    const confirmPassword = useRef<InputRef>(null);
    const btnChangePass = useRef<HTMLButtonElement>(null);
    const { toastPromise } = useGlobalContext();
    const navigate = useNavigate();

    const handleChangePassword = () => {
        setChangeFalse(true);
        const toastChangePassword = toastPromise('Đang đổi mật khẩu !');
        request
            .post('/change-password', {
                oldPassword: oldPassword?.current?.getValue(),
                newPassword: newPassword?.current?.getValue(),
            })
            .then((data) => {
                toastChangePassword.success(data.data);
                navigate(routes.home);
            })
            .catch((err) => {
                toastChangePassword.error(err.response?.data);
            })
            .finally(() => {
                setChangeFalse(false);
            });
    };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            btnChangePass?.current?.click();
        }
    };

    return (
        <div className={cx('wraper')}>
            <div className={cx('header')}>
                <h1>Đổi mật khẩu</h1>
                <div className={cx('name')}>{user?.name}</div>
                <div>Email: {user?.email}</div>
            </div>
            <div>
                <Input
                    ref={oldPassword}
                    type="password"
                    placeholder="Nhập mật khẩu cũ"
                    validates={{
                        require: 'Bắt buộc nhập mật khẩu !',
                        min: { value: 6, message: 'Mật khẩu tối thiểu 6 ký tự !' },
                    }}
                    onKeyDown={handleKeyDown}
                ></Input>
                <Input
                    ref={newPassword}
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    validates={{
                        require: 'Bắt buộc nhập mật khẩu mới !',
                        min: { value: 6, message: 'Mật khẩu mới tối thiểu 6 ký tự !' },
                    }}
                    onKeyDown={handleKeyDown}
                ></Input>
                <Input
                    ref={confirmPassword}
                    type="password"
                    placeholder="Mật khẩu"
                    validates={{
                        require: 'Vui lòng nhập lại mật khẩu !',
                        min: { value: 6, message: 'Gõ lại mật khẩu tối thiểu 6 ký tự !' },
                        confirm: { value: newPassword as { current: InputRef }, message: 'Gõ lại mật khẩu sai !' },
                    }}
                    onKeyDown={handleKeyDown}
                ></Input>
            </div>
            <div className={cx('change-wraper')}>
                <Button
                    ref={btnChangePass}
                    onClick={handleChangePassword}
                    disable={changeFalse}
                    className={cx('btn-change')}
                    variant="primary"
                    validateInput={[oldPassword, newPassword, confirmPassword]}
                >
                    Đổi mật khẩu
                </Button>
            </div>
        </div>
    );
}

export default ChangePassword;
