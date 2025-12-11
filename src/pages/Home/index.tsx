import classNames from 'classnames/bind';
import images from '../../assets/images';
import styles from './Home.module.scss';
import Button from '../../components/Button';
import { useAuth } from '../../hooks/useAuth';
import { routes } from '../../config';

const cx = classNames.bind(styles);

function Home() {
    const { user } = useAuth();

    const stats = [
        { number: '10,000+', label: 'Câu hỏi' },
        // { number: '5,000+', label: 'Học viên' },
        { number: '95%', label: 'Tỷ lệ đỗ' },
        // { number: '24/7', label: 'Hỗ trợ' },
    ];

    return (
        <div className={cx('wrapper')}>
            {/* Hero Section */}
            <section className={cx('hero')}>
                <div className={cx('hero-decoration')}>
                    <img
                        className={cx('decoration-logo')}
                        src="https://th.bing.com/th/id/R.9819eaace9a5844542a4880ada1be306?rik=jNn%2bsGdTJl%2fg1Q&pid=ImgRaw&r=0"
                        alt=""
                    />
                </div>

                <div className={cx('hero-content')}>
                    <div className={cx('hero-badge')}>
                        <span className={cx('badge-icon')}>🎓</span>
                        <span>Nền tảng ôn thi hàng đầu</span>
                    </div>

                    <h1 className={cx('hero-title')}>
                        Chinh phục kỳ thi,
                        <br />
                        <span className={cx('highlight')}>vững bước cùng HUBT</span>
                    </h1>

                    <p className={cx('hero-description')}>
                        Ôn luyện hiệu quả với ngân hàng câu hỏi đa dạng, giải thích chi tiết. Nền tảng của chúng tôi là
                        bước đệm vững chắc giúp bạn tự tin đạt điểm cao và sẵn sàng cho môi trường học tập thực tiễn tại
                        Đại học Kinh doanh và Công nghệ Hà Nội.
                    </p>

                    <div className={cx('hero-actions')}>
                        <Button to={routes.exam} className={cx('btn-primary')}>
                            <span>Bắt đầu ôn luyện ngay</span>
                            <span className={cx('btn-icon')}>→</span>
                        </Button>
                        {!user && (
                            <Button to={routes.login} className={cx('btn-secondary')}>
                                Đăng nhập
                            </Button>
                        )}
                    </div>

                    {/* Stats */}
                    <div className={cx('hero-stats')}>
                        {stats.map((stat, index) => (
                            <div key={index} className={cx('stat-item')}>
                                <div className={cx('stat-number')}>{stat.number}</div>
                                <div className={cx('stat-label')}>{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={cx('hero-decoration')}>
                    <img
                        className={cx('decoration-image')}
                        src="https://img.pikbest.com/png-images/20191110/beautiful-cartoon-christmas-tree-gif_2515368.png!bw700"
                        alt="Decoration"
                    />
                </div>
            </section>

            {/* Footer */}
            <footer className={cx('footer')}>
                <div className={cx('footer-content')}>
                    <div className={cx('footer-logo')}>
                        <img src={images.logo} alt="HUBT Logo" />
                    </div>
                    <div className={cx('footer-text')}>
                        <p>
                            Giáng Sinh – mùa lễ hội an lành, sum họp bên ánh đèn lung linh và giai điệu rộn ràng của
                            những bản nhạc mừng mùa đông.
                        </p>
                        <p className={cx('copyright')}>© 2025 Hugn. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
