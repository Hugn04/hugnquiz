import classNames from 'classnames/bind';
import React, { useState } from 'react';

import styles from './Default.module.scss';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';

const cx = classNames.bind(styles);

type DefaultProps = { children: React.ReactNode; sideBarMini?: boolean; searchMobile?: boolean };

function Default({ children, sideBarMini, searchMobile }: DefaultProps) {
    const [stateSideBar, setStateSideBar] = useState(false);
    const handleToggleSideBar = () => {
        setStateSideBar(!stateSideBar);
    };
    return (
        <>
            <Header onToggleSideBar={handleToggleSideBar} searchMobile={searchMobile}></Header>
            <div className={cx('wrapper')}>
                <div
                    className={cx('veli', { none: !stateSideBar })}
                    onClick={() => {
                        handleToggleSideBar();
                    }}
                ></div>
                <SideBar stateSideBar={stateSideBar} sideBarMini={sideBarMini}></SideBar>
                <div className={cx('content')}>{children}</div>
            </div>
        </>
    );
}

export default Default;
