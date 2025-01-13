import { RouteObject } from 'react-router-dom';
import SignInAndUp from './pages/user/login';
import Home from './pages';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <SignInAndUp />,
  },
  {
    path: '/home',
    element: <Home />,
  },

];

export default routes;