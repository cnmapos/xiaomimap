import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css'
import Home from './Home'
import routerConfig from './navigation/config'

function createRouters() {
  return routerConfig.map((n) => {
    return n.children.map((c) => ({ path: c.path, element: <c.element /> }))
  }).flat();
}

// 路由配置
const routes = [
  {
    path: '/',
    element: <Home />,
  },
  ...createRouters(),
];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App
