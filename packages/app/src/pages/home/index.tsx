import React from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "antd";
import { UserInfo as UserInfoType } from "./user/info/types";
import RecentCreate from "./component/RecentCreate";
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
      <Carousel
        dots={{
          className: "carousel-dots",
        }}
      >
        {imageList.map((item, index) => {
          return (
            <div className="carousel-item">
              <img key={index} src={item} alt="轮播图" />
            </div>
          );
        })}
      </Carousel>
      <h6 className="flex text-sm items-center font-bold mb-4 mt-10">
        <svg
          width="16"
          height="16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            opacity="0.7"
            d="M8 12.146A5.686 5.686 0 1 0 8 .774a5.686 5.686 0 0 0 0 11.372Z"
            fill="#06F"
          ></path>
          <path
            opacity="0.7"
            d="M9.378 15.224H6.622a1.155 1.155 0 0 1-1.154-1.155v-3.867c0-.3.242-.543.542-.543h3.98c.3 0 .543.243.543.543v3.867c0 .638-.518 1.155-1.155 1.155Z"
            fill="#00CE9D"
          ></path>
        </svg>
        <span className="ml-4">近期创作</span>
      </h6>
      <RecentCreate />
    </div>
  );
};

export default Home;
