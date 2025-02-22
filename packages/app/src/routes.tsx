import { RouteObject } from 'react-router-dom';
import SignInAndUp from './pages/user/login';
import Home from './pages';
import Layout from './components/Layout';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <SignInAndUp />,
  },
  // {
  //   path: '/home',
  //   element: <Home />,
  // },
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: 'home',
        element: <Home />,
      },
    ],
  },

];

export default routes;