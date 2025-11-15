import type { ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  authApi,
  useLogoutMutation,
  useUserInfoQuery
} from "@/redux/features/auth/auth.api";
import { Navigate } from 'react-router-dom';

type TProtectedRoute = {
    children: ReactNode;
    role: string | undefined;
};

const ProtectedRoute = ({ children, role }: TProtectedRoute) => {
    const [logout] = useLogoutMutation();
     const { data } = useUserInfoQuery(undefined);
    const token = useAppSelector(data);

    let user: any;

    // if (token) {
    //     user = verifyToken(token);
    // }

    const dispatch = useAppDispatch();

    if (role !== undefined && role !== user?.role) {
        logout(undefined);
        dispatch(authApi.util.resetApiState());
        return <Navigate to="/login" replace={true} />;
    }
    if (!token) {
        return <Navigate to="/login" replace={true} />;
    }

    return children;
};

export default ProtectedRoute;