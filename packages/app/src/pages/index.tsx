import React from "react";
import { useLocation } from "react-router-dom";
import { UserInfo as UserInfoType } from './user/info/types';
import UserInfo from "./user/info";
import "./index.css";

const Home: React.FC = () => {
    const location = useLocation();
    const userInfos= location.state?.userInfo as UserInfoType;

    return (
        <div className="mainSite">
            <div className="nav">
                <UserInfo {...userInfos} />
            </div>
            <div className="content">
                <h1>这里是网站主页</h1>
            </div>
        </div>
    )
};

export default Home;