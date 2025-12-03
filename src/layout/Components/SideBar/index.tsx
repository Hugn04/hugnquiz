import classNames from 'classnames/bind';
import { faFacebookMessenger } from '@fortawesome/free-brands-svg-icons';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { faCircleQuestion, faClipboardQuestion, faHeart, faHome } from '@fortawesome/free-solid-svg-icons';

import styles from './SideBar.module.scss';
import NavList from '../NavList';
import routes from '../../../config/routes';
import type { IconProp } from '@fortawesome/fontawesome-svg-core';
const cx = classNames.bind(styles);

type MenuItem = {
    title: string;
    icon?: IconProp;
    event?: {
        to?: string;
        href?: string;
        onClick?: () => void;
    };
    active?: boolean;
    spacer?: boolean;
};

const initMenu: MenuItem[] = [
    {
        title: 'Trang chủ',
        icon: faHome,
        event: {
            to: routes.home,
        },
    },
    {
        title: 'Đề thi',
        icon: faClipboardQuestion,
        event: {
            to: routes.exam,
        },
    },
    {
        title: 'Đề thi của tôi',
        icon: faCircleQuestion,
        event: {
            to: routes.myExam,
        },
    },
    {
        title: 'Đề thi yêu thích',
        icon: faHeart,
        event: {
            to: routes.favorite,
        },
    },
    {
        title: 'Tin nhắn',
        icon: faFacebookMessenger,
        event: {
            to: routes.message,
        },
        spacer: true,
    },
    {
        title: 'Trang chủ của trường',
        event: {
            href: 'https://hubt.edu.vn/',
        },
    },

    {
        title: '© 2024 - 2025 Hugn',
    },
];
type SideBarProps = { stateSideBar: boolean; sideBarMini?: boolean };
function SideBar({ stateSideBar, sideBarMini }: SideBarProps) {
    const { pathname } = useLocation();
    const [menus, setMenus] = useState<MenuItem[]>(initMenu);
    useEffect(() => {
        const newMenu = [...menus];
        menus.map((item, index) => {
            if (item.event) {
                if (item.active) {
                    newMenu[index] = { ...newMenu[index], active: false };
                }
                if (pathname === item.event.to) {
                    newMenu[index] = { ...newMenu[index], active: true };
                    setMenus(newMenu);
                }
            }
            return null;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);
    const classes = cx('sidebar', {
        active: stateSideBar,
        hide: sideBarMini && !stateSideBar,
    });
    const classesWrapper = cx('wrapper', {
        active: stateSideBar,
        hide: sideBarMini && !stateSideBar,
    });
    return (
        <div className={classesWrapper}>
            <div className={classes}>
                <NavList classNameButton={cx('button')} menus={menus}></NavList>
            </div>
        </div>
    );
}
export default SideBar;
