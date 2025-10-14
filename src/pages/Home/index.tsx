import classNames from 'classnames/bind';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import images from '../../assets/images';
import styles from './Home.module.scss';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { routes } from '../../config';
import Slider from 'react-slick';
const cx = classNames.bind(styles);
function Home() {
    const { user } = useAuth();
    const settings = {
        dots: true,
        // infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        // Thêm hai thuộc tính này để slider tự động chạy
        autoplay: true,
        autoplaySpeed: 3000,
    };
    // const imgs = [images.slier1, images.slier2, images.slier3];
    const imgs = [
        'https://mir-s3-cdn-cf.behance.net/project_modules/2800_opt_1/dbb528128425071.6155bf559c93c.png',
        'https://tuhocdohoa.vn/wp-content/uploads/2018/08/TT025-le-hoi-trung-thu-viet-nam-01.jpg',
        'https://static.vinwonders.com/production/ruoc-den-trung-thu-1.jpg',
    ];
    return (
        <>
            <div className={cx('wraper')}>
                <img className={cx('background')} src={images.background} alt="Background"></img>
                <div className={cx('main')}>
                    <div className={cx('container', 'left')}>
                        <img
                            className={cx('logo')}
                            alt="Logo"
                            src="https://png.pngtree.com/png-clipart/20210310/original/pngtree-lunar-new-year-lion-dance-border-auspicious-clouds-png-image_5947851.png"
                        ></img>

                        <div className={cx('content')}>
                            <h1>Chinh phục kỳ thi, vững bước cùng HUBT!</h1>
                            <br></br>
                            <p>
                                Ôn luyện hiệu quả với ngân hàng câu hỏi đa dạng, giải thích chi tiết. Nền tảng của chúng
                                tôi là bước đệm vững chắc giúp bạn tự tin đạt điểm cao và sẵn sàng cho môi trường học
                                tập thực tiễn tại Đại học Kinh doanh và Công nghệ Hà Nội.
                            </p>
                        </div>
                        <div className={cx('action')}>
                            <Button to={routes.exam} className={cx('button')}>
                                Bắt đầu ôn luyện ngày
                            </Button>
                            {!user && (
                                <>
                                    <Button to={routes.login} className={cx('button')}>
                                        Đăng nhập
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={cx('container', 'right')}>
                        <img className={cx('logo')} alt="Logo" src={images.logo2}></img>
                        <div className={cx('slider-container')}>
                            <Slider {...settings}>
                                {imgs.map((src, index) => (
                                    <div key={index}>
                                        <img
                                            src={src}
                                            style={{ width: 700, height: 365, objectFit: 'cover' }}
                                            alt={`slide-${index}`}
                                            className={cx('img')}
                                        />
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
                <div className={cx('footer')}>
                    <div className={cx('copyright-footer')}>
                        Trung Thu – Tết đoàn viên, sum vầy bên ánh trăng rằm và tiếng trống múa lân rộn ràng.<br></br>
                        6/10/2025<br></br>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Home;
