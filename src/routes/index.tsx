import { createBrowserRouter, Navigate} from 'react-router-dom';
import App from '../App';
import Login from '../pages/Login';
import ChangePassword from '../pages/ChangePassword';
import ForgotPassword from '../pages/ForgotPassword';
import MainLayout from "@/components/layout/MainLayout";
import { withAuth } from "@/utils/withAuth";
import Unauthorized from "@/pages/Unauthorized";
import { role } from "@/constants/role";
import { TRole } from "@/types";

import { adminSidebarItems } from './adminSidebarItems';
import { routeGenerator } from '../utils/routesGenerator';

export const router = createBrowserRouter([
  {
    path: '/',
      element: <Navigate to="/admin/dashboard" replace />,
  },
   {
    path: '/',
     Component: withAuth(App,  role.superAdmin as TRole),
  },
  {
    path: '/superAdmin',
    Component: withAuth(MainLayout, role.superAdmin as TRole),
    children: routeGenerator(adminSidebarItems),
  },
  {
    path: '/admin',
    Component: withAuth(MainLayout, role.admin as TRole),
     children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      ...routeGenerator(adminSidebarItems),
    ],
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/change-password',
    Component: ChangePassword,
  },
  {
    path: '/reset-password',
    Component: ForgotPassword,
  },
  {
    path: '/unauthorized',
    Component: Unauthorized,
  },
]);
