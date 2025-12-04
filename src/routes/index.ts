import Account from '../layout/Account';
import HomeLayout from '../layout/Home';
import { routes as routesConfig } from '../config';

import HomePage from '../pages/Home';
import ExamQuestions from '../pages/ExamQuestions';
import MyExample from '../pages/MyExample';

import Login from '../pages/Login';
import Register from '../pages/Register';
import TestComponent from '../pages/TestComponent';
import VerifyEmail from '../pages/VerifyEmail';
import EditExample from '../pages/EditExample';
import Profile from '../pages/Profile';
// import ShareExample from '../pages/ShareExample';
import MyFavorite from '../pages/MyFavorite';
import ChangePassword from '../pages/ChangePassword';
// import HomeAdmin from '../pages/admins/HomeAdmin';
import PreviewExample from '../pages/PreviewExample';
import ContestPage from '../pages/Contest';
import CreateExample from '../pages/CreateExample';
// import MessagePage from '../pages/MessagePage';

export type RouteType = {
    path: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    layout?: React.ComponentType<any> | null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    props?: { [key: string]: any };
};

const publicRoutes: RouteType[] = [
    { path: routesConfig.home, component: HomePage, layout: HomeLayout },
    { path: routesConfig.login, component: Login, layout: Account },
    { path: routesConfig.register, component: Register, layout: Account },
    { path: routesConfig.verifyEmail, component: VerifyEmail, layout: Account },
    { path: routesConfig.exam, component: ExamQuestions },
    { path: routesConfig.test, component: TestComponent, layout: null },
    // { path: routesConfig.share, component: ShareExample },
];

const privateRoutes: RouteType[] = [
    { path: routesConfig.conTest(), component: ContestPage, props: { sideBarMini: true } },
    { path: routesConfig.previewExample(), component: PreviewExample, props: { sideBarMini: true } },
    { path: routesConfig.myExam, component: MyExample },
    { path: routesConfig.editExample(), component: EditExample, props: { sideBarMini: true } },
    { path: routesConfig.profile(), layout: HomeLayout, component: Profile, props: { sideBarMini: true } },
    { path: routesConfig.changePassword, component: ChangePassword, layout: Account },
    { path: routesConfig.favorite, component: MyFavorite },
    // { path: routesConfig.message, component: MessagePage, props: { noPadding: true } },
    { path: routesConfig.createExample, component: CreateExample, props: { sideBarMini: true } },
];

const adminRoutes: RouteType[] = [
    // { path: routesConfig.admin, component: HomeAdmin, layout: null }
];

export { publicRoutes, privateRoutes, adminRoutes };
