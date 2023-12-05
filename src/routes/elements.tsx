import { Suspense, lazy, ElementType } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component: ElementType) => (props: any) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );

// ----------------------------------------------------------------------

export const LoginPage = Loadable(lazy(() => import('../pages/LoginPage')));

export const Home = Loadable(lazy(() => import('../pages/Home')));
export const CasesList = Loadable(lazy(() => import('../pages/cases/Index')));
export const CategoryList = Loadable(lazy(() => import('../pages/category/index')));
export const AppointmentList = Loadable(lazy(() => import('../pages/appointment/index')));
export const Create = Loadable(lazy(() => import('../pages/appointment/New')));
export const Slots = Loadable(lazy(() => import('../pages/slots/index')));
export const CasesCreate = Loadable(lazy(() => import('../pages/cases/Create')));
export const EditCases = Loadable(lazy(() => import('../pages/cases/EditCases')));
export const CreateCategory = Loadable(lazy(() => import('../pages/category/createCategory')));
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
