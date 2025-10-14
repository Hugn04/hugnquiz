import { Navigate } from 'react-router-dom';
import { memo } from 'react';

import { useAuth } from '../../hooks/useAuth';
import { routes } from '../../config';
type AdminRouteProps = {
    children: React.ReactNode;
};
function AdminRoute({ children }: AdminRouteProps) {
    const { user, auth } = useAuth();

    auth(false);
    if (user && user.role !== 'admin') {
        return <Navigate to={routes.home} state={{ message: 'Bạn không có quyền vào trang này !' }} />;
    }
    return children;
}
export default memo(AdminRoute);
