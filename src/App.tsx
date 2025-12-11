import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { publicRoutes, privateRoutes, adminRoutes, type RouteType } from './routes';
import DefaultLayout from './layout/Default';
import { useEffect } from 'react';
import ProtectedRoute from './components/ProtectedRoute';
import { useLocalStorage } from './hooks/useLocalStorage';
import NotFoundPage from './pages/NotFoundPage';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './providers/AuthProvider';
import { GlobalProvider } from './providers/GlobalProvider';
import './App.css';
function App() {
    const [theme, setTheme] = useLocalStorage('theme-dark', false);
    useEffect(() => {
        const classList = document.body.classList;
        if (theme) {
            classList.add('theme-dark');
        } else {
            classList.remove('theme-dark');
        }
        const handleUnload = () => {
            setTheme(classList.contains('theme-dark'));
        };

        window.addEventListener('unload', handleUnload);

        return () => {
            window.removeEventListener('unload', handleUnload);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLayout = (item: RouteType) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let PageLayout: React.ComponentType<any> = DefaultLayout;
        const Layout = item.layout;
        if (Layout === null) {
            PageLayout = ({ children }: { children: React.ReactNode }) => <>{children}</>;
        } else if (Layout) {
            PageLayout = Layout;
        }
        return PageLayout;
    };

    return (
        <BrowserRouter>
            <GlobalProvider>
                <AuthProvider>
                    <Routes>
                        {publicRoutes.map((item, index) => {
                            const Component = item.component;
                            const PageLayout = handleLayout(item);
                            return (
                                <Route
                                    key={index}
                                    path={item.path}
                                    element={
                                        <PageLayout {...item.props}>
                                            <Component></Component>
                                        </PageLayout>
                                    }
                                ></Route>
                            );
                        })}
                        {privateRoutes.map((item, index) => {
                            const Component = item.component;
                            const PageLayout = handleLayout(item);
                            return (
                                <Route
                                    key={index}
                                    path={item.path}
                                    element={
                                        <PageLayout {...item.props}>
                                            <ProtectedRoute>
                                                <Component></Component>
                                            </ProtectedRoute>
                                        </PageLayout>
                                    }
                                ></Route>
                            );
                        })}
                        {adminRoutes.map((item, index) => {
                            const Component = item.component;
                            const PageLayout = handleLayout(item);
                            return (
                                <Route
                                    key={index}
                                    path={item.path}
                                    element={
                                        <AdminRoute>
                                            <PageLayout {...item.props}>
                                                <Component></Component>
                                            </PageLayout>
                                        </AdminRoute>
                                    }
                                ></Route>
                            );
                        })}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </AuthProvider>
            </GlobalProvider>
        </BrowserRouter>
    );
}

export default App;
