import classNames from 'classnames/bind';
import { useState } from 'react';

import Header from '../Components/Header';
import styles from './Home.module.scss';
import SideBar from '../Components/SideBar';
const cx = classNames.bind(styles);

function Home({ children }: { children: React.ReactNode }) {
    const [stateSideBar, setStateSideBar] = useState(false);
    const handleToggleSideBar = () => {
        setStateSideBar(!stateSideBar);
    };
    return (
        <div className={cx('wraper')}>
            <Header onToggleSideBar={handleToggleSideBar} navBar={true}></Header>
            <div className={cx('sidebar')}>
                <SideBar stateSideBar={stateSideBar}></SideBar>
            </div>
            {children}
        </div>
    );
}

export default Home;
