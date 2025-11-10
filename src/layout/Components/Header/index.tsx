import classNames from 'classnames/bind';
import { faCircleUser, faSquarePlus } from '@fortawesome/free-regular-svg-icons';
import Tippy from '@tippyjs/react/headless';
import { useEffect, useRef, useState } from 'react';
import { createSearchParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
    faBars,
    faCircleHalfStroke,
    faCircleInfo,
    faEllipsisVertical,
    faLock,
    faRightFromBracket,
    faSearch,
    faUserPlus,
    faUserTie,
    // faUserTie,
} from '@fortawesome/free-solid-svg-icons';

import styles from './Header.module.scss';
import images from '../../../assets/images';
import Button from '../../../components/Button';
import NavList from '../NavList';
import { useAuth } from '../../../hooks/useAuth';
import { routes } from '../../../config';
import Avatar from '../../../components/Avatar';
import { getMessageRole } from '../../../helpers/roleController';

const cx = classNames.bind(styles);
type HeaderProps = { navBar?: boolean; onToggleSideBar?: () => void; searchMobile?: boolean };

function Header({ navBar, onToggleSideBar, searchMobile }: HeaderProps) {
    const [visibleModel, setVisibleModel] = useState(false);
    const searchRef = useRef<HTMLInputElement>(null);
    const btnSearch = useRef<HTMLButtonElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isAdmin, setIsAdmin] = useState(false);
    const { user, logout, auth } = useAuth();
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const [searchValue, setSearchValue] = useState(params.get('search') || '');

    const styleSearch = { searchMobile: searchMobile };
    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            btnSearch?.current?.click();
        }
    };
    const [temp] = useState([
        {
            title: 'Chuyển nền',
            icon: faCircleHalfStroke,
            event: {
                onClick() {
                    const classList = document.body.classList;
                    classList.toggle('theme-dark');
                },
            },
        },
        {
            title: 'Thông tin tài khoản',
            icon: faCircleInfo,
            event: {
                to: routes.profile('this'),
            },
        },
        {
            title: 'Đổi mật khẩu',
            icon: faLock,
            event: {
                to: routes.changePassword,
            },
        },
        {
            title: 'Đăng xuất',
            icon: faRightFromBracket,
            event: {
                onClick: logout,
            },
        },
    ]);
    const [menus, setMenus] = useState(temp);
    useEffect(() => {
        auth(false);

        if (user && user.role === 'admin') {
            setIsAdmin(user.role === 'admin');

            setMenus(() => {
                const newMenus = [
                    {
                        title: 'Trang quản trị',
                        icon: faUserTie,
                        event: {
                            to: routes.admin,
                        },
                    },
                    ...temp,
                ];
                return newMenus;
            });
        }
    }, [auth, temp, user]);

    return (
        <div className={cx('wraper')}>
            <div className={cx('header-logo')}>
                <Button className={cx('toogle-menu')} onClick={onToggleSideBar} size="large" icon={faBars}></Button>
                <img src={images.logo} alt="Logo"></img>
                <Link to={routes.home}>
                    <h1 className={cx('header-title')}>{import.meta.env.VITE_APP_NAME}</h1>
                </Link>
            </div>
            <div className={cx('search', styleSearch)}>
                <input
                    ref={searchRef}
                    value={searchValue}
                    onChange={(e) => {
                        setSearchValue(e.target.value);
                    }}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder="Tìm kiếm đề thi"
                ></input>
                <Button
                    ref={btnSearch}
                    onClick={() => {
                        navigate(
                            {
                                pathname: routes.exam, // đường dẫn
                                search: createSearchParams({ search: searchValue }).toString(), // query params
                            },
                            {
                                state: { searchState: searchValue }, // state ẩn
                            },
                        );
                    }}
                    className={cx('icon')}
                    icon={faSearch}
                ></Button>
            </div>
            <div className={cx('action')}>
                {navBar && (
                    <div className={cx('nav-bar')}>
                        <Button className={cx('active')} variant="white" to={routes.home}>
                            Trang chủ
                        </Button>
                        <Button variant="white" to={routes.exam}>
                            Đề thi
                        </Button>
                        <Button to={routes.myExam} variant="white">
                            Đề thi của tôi
                        </Button>
                    </div>
                )}
                {user ? (
                    <>
                        {user.role === 'admin' && (
                            <Button
                                to={routes.createExample}
                                className={cx('create-exam')}
                                leftIcon={faSquarePlus}
                                variant="primary"
                            >
                                Tạo đề thi
                            </Button>
                        )}
                        <Tippy
                            visible={visibleModel}
                            onClickOutside={() => setVisibleModel(false)}
                            offset={[-5, 2]}
                            interactive
                            render={(attrs) => (
                                <div className={cx('menu-box')} tabIndex={-1} {...attrs}>
                                    <NavList menus={menus} />
                                </div>
                            )}
                        >
                            <div className={cx('account')} onClick={() => setVisibleModel(!visibleModel)}>
                                <Avatar
                                    url={user.avatar}
                                    frameUrl={user.role === 'admin' ? images.frame : ''}
                                    size={40}
                                    classNames={cx('avatar')}
                                ></Avatar>
                                {/* <img
                                    className={cx('avatar')}
                                    src={user.avatar || images.defaultAvatar}
                                    alt="Ảnh đại diện"
                                ></img> */}
                                <div className={cx('account_info')}>
                                    <h3 className={cx('name')}>{user.name}</h3>
                                    <h3 className={cx('role')}>{getMessageRole(user.role)}</h3>
                                </div>
                                <Button className={cx('menu')} leftIcon={faEllipsisVertical}></Button>
                            </div>
                        </Tippy>
                    </>
                ) : (
                    <>
                        <Button className={cx('register')} to={routes.register} leftIcon={faUserPlus} variant="primary">
                            Đăng ký
                        </Button>
                        <Button className={cx('login')} to={routes.login} leftIcon={faCircleUser} variant="primary">
                            Đăng Nhập
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Header;
