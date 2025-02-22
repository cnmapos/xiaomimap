import { Outlet } from 'react-router-dom';
import Header from '../Header';
import SideMenu from '../SideMenu';
import Styles from './styles.module.less';
const Layout = () => {
  return (
    <>
      <Header/>
      <SideMenu />
      <main className={Styles.main}>
        <Outlet />
      </main>
    </>
  );
};

export default Layout;