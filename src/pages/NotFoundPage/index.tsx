import classNames from 'classnames/bind';
import { routes } from '../../config';
import style from './NotFoundPage.module.scss';
import { Link } from 'react-router-dom';
import images from '../../assets/images';
const cx = classNames.bind(style);
function NotFoundPage() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <img className={cx('ops')} src={images.NotFound404} alt="404" />
                <br />
                <h3 className={cx('text')}>
                    Không tìm thấy trang bạn đang tìm kiếm.
                    <br /> Có thể là do URL không chính xác hoặc không khả dụng.
                </h3>
                <br />
                <Link className={cx('buton')} to={routes.home}>
                    Quay về trang chủ
                </Link>
            </div>
        </div>
    );
}
export default NotFoundPage;
