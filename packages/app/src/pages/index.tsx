import React from "react";
import { useLocation } from "react-router-dom";
import { UserInfo as UserInfoType } from './user/info/types';
import UserInfo from "./user/info";
import "./index.css";

const Home: React.FC = () => {
    const location = useLocation();
    const userInfos= location.state?.userInfo as UserInfoType;

    return (
        <div style={{height:3000}}>
            我是home 页面
        </div>
    )
};

export default Home;