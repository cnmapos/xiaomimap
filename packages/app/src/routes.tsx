import { RouteObject } from "react-router-dom";
import SignInAndUp from "./pages/user/login";
import Home from "./pages";
import Editor from "./pages/editor";
import Layout from "./components/Layout";
import Draft from './pages/workspace/draft';
import Material from './pages/workspace/material';
import Product from './pages/workspace/product';

const routes: RouteObject[] = [
  {
    path: "/",
    element: <SignInAndUp />,
  },
  // {
  //   path: '/home',
  //   element: <Home />,
  // },
  {
    path: "/editor",
    element: <Editor />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "home",
        element: <Home />,
      },
      {
        path: "/workspace/material",
        element: <Material />,
      },
      {
        path: "/workspace/draft",
        element: <Draft />,
      },
      {
        path: "/workspace/product",
        element: <Product />,
      },
    ],
  },
];

export default routes;
