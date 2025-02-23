import React from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "antd";
import { UserInfo as UserInfoType } from "./user/info/types";
import UserInfo from "./user/info";
import "./index.less";

const Home: React.FC = () => {
  const location = useLocation();
  const userInfos = location.state?.userInfo as UserInfoType;
  const imageList = [
    "https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.png",
    "https://static.yximgs.com/udata/pkg/admin-center/51d3c1da0ef4b628d7ec185264afedf55d1661b7.png",
    "https://static.yximgs.com/udata/pkg/admin-center/5303328e772045dfd2fa901cc4fbe9a4a2e7ad51.png",
  ];

  return (
    <div className="home">
      <Carousel dots={{
        className:'carousel-dots'
      }}>
        {imageList.map((item, index) => {
          return (
            <div className="carousel-item">
              <img key={index} src={item} alt="轮播图" />
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};

export default Home;
