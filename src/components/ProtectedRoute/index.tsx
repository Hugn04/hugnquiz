import { Navigate } from 'react-router-dom';
import React, { memo } from 'react';

import { useAuth } from '../../hooks/useAuth';
import { routes } from '../../config';
import { useGlobalContext } from '../../hooks/useGlobalContext';
type ProtectedRouteProps = {
    children: React.ReactNode;
};
function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, auth } = useAuth();
    const { showToast } = useGlobalContext();
    auth(false);
    if (!user) {
        showToast('Bạn phải đăng nhập mới vào được trang này !');
        return <Navigate to={routes.login} />;
    }
    return children;
}
export default memo(ProtectedRoute);
