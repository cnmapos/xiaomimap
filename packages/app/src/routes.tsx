import { RouteObject } from "react-router-dom";
import SignInAndUp from "./pages/user/login";
import Home from "./pages";
import Editor from "./pages/editor";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <SignInAndUp />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "editor",
    element: <Editor />,
  },
];

export default routes;
