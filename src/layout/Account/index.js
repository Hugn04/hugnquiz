import classNames from 'classnames/bind';
import Button from '../../components/Button';
import styles from './Account.module.scss';
import images from '../../assets/images';
import { routes } from '../../config';
import { useAuth } from '../../hooks/useAuth';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
const cx = classNames.bind(styles);
function Account({ children }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    useEffect(() => {
        if (user && location.pathname !== routes.changePassword) {
            navigate(routes.home);
        }
    }, [location, navigate, user]);

    return (
        <div className={cx('wraper')}>
            <div className={cx('container')}>
                <div className={cx('wraper-logo')}>
                    <div className={cx('logo-group')}>
                        <Button to={routes.home} className={cx('btn-home')}>
                            <div className={cx('core')}>
                                <img className={cx('logo')} src={images.logo} alt="logo"></img>
                                <h1>{process.env.REACT_APP_NAME}</h1>
                            </div>
                        </Button>
                    </div>
                    <h2>Công cụ ôn thi trắc nghiệm hiệu quả, đạt điểm số cao.</h2>
                </div>
                <div className={cx('content')}>{children}</div>
            </div>
        </div>
    );
}

export default Account;
