import React from "react";
import { BellOutlined, DownOutlined } from "@ant-design/icons";
import { Dropdown, Avatar, Badge, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "@/service/axiosConfig";
import Styles from "./styles.module.less";

const items = [
  {
    key: 1,
    label: "绘个球",
  },
  {
    key: 2,
    label: "个人信息",
  },
  {
    key: 3,
    label: "退出登录",
  },
];
const Header: React.FC = () => {
  const navigate = useNavigate();

  const onMenuClick = ({ key }) => {
    if (key === 3) {
      axios.get("/hz-users/logout").then(({ data }) => {
        if (!data.code) {
          localStorage.removeItem("clientKey");
          navigate("/");
        } else {
          message.error(data.message);
        }
      });
    }
    console.log("click", key);
  };
  return (
    <div className={Styles.header}>
      <div className={Styles.logo}></div>
      <div className={Styles.user}>
        <Badge className="mr-20" count={5} size="small">
          <BellOutlined className="ft-20" />
        </Badge>
        <Dropdown menu={{ items, onClick: onMenuClick }}>
          <div className="flex-center cursor-pointer">
            <Avatar
              className="mr-16"
              src="https://p4-pro.a.yximgs.com/uhead/AB/2020/01/15/16/BMjAyMDAxMTUxNjI1MjhfMTY4NTMwNTA1MV8xX2hkNzA4XzI1_s.jpg"
            />
            <svg
              width="10"
              height="6"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.742 5.236.898 1.598a.188.188 0 0 1-.008-.265L1.47.72a.187.187 0 0 1 .265-.008L5 3.802 8.265.712A.188.188 0 0 1 8.53.72l.58.613a.188.188 0 0 1-.007.265L5.258 5.236a.375.375 0 0 1-.516 0Z"
                fill="#000"
                fillOpacity="0.7"
              ></path>
            </svg>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
