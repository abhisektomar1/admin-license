import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  Page404,
  Home,
  LoginPage,
  CasesList,
  CasesCreate,
  CategoryList,
  CreateCategory,
  AppointmentList,
  Slots,
  EditCases,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: '/dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'home', element: <Home /> },
        {
          path: 'clientAccess',
          children: [
            { element: <Navigate to="/dashboard/clientAccess/list" replace />, index: true },
            { path: 'list', element: <CasesList /> },
            { path: 'new', element: <CasesCreate /> },
            { path: 'edit/:id', element: <EditCases /> },
          ],
        },
        {
          path: 'clientMaster',
          children: [
            { element: <Navigate to="/dashboard/clientMaster/list" replace />, index: true },
            { path: 'list', element: <CategoryList /> },
            { path: 'new', element: <CreateCategory /> },
          ],
        },
        {
          path: 'ipMaster',
          children: [
            { element: <Navigate to="/dashboard/ipMaster/list" replace />, index: true },
            { path: 'list', element: <AppointmentList /> },
            // { path: 'new', element: <CreateCategory /> },
          ],
        },
        {
          path: 'slots',
          children: [
            { element: <Navigate to="/dashboard/slots/list" replace />, index: true },
            { path: 'list', element: <Slots /> },
            // { path: 'new', element: <CreateCategory /> },
          ],
        },
      ],
    },
    {
      element: <CompactLayout />,
      children: [{ path: '404', element: <Page404 /> }],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
