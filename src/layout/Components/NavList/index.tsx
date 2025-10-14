import type { IconProp } from '@fortawesome/fontawesome-svg-core';
import Button from '../../../components/Button';
import classNames from 'classnames/bind';
import styles from './NavList.module.scss';
const cx = classNames.bind(styles);

interface MenuItem {
    title: string;
    icon?: IconProp;
    spacer?: boolean;
    active?: boolean;
    event?: any;
}

interface NavListProps {
    menus: MenuItem[];
    classNameButton?: string;
}

const NavList = ({ menus, classNameButton }: NavListProps) => {
    return (
        <div className={cx('wraper')}>
            {menus?.map((item, index) => {
                const classes = cx('button', classNameButton, {
                    spacer: item.spacer,
                    active: item.active,
                });
                return (
                    <Button key={index} {...item.event} className={classes} leftIcon={item.icon}>
                        <span className={cx('title')}>{item.title}</span>
                    </Button>
                );
            })}
        </div>
    );
};

export default NavList;
