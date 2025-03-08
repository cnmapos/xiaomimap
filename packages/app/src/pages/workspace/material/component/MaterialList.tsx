import { Row, Col, Checkbox, Dropdown } from "antd";
import { HeartFilled, MoreOutlined } from "@ant-design/icons";
import React from "react";
import "./index.less";

const items = [
  {
    key: "1",
    label: "复制",
  },
  {
    key: "2",
    label: "编辑",
  },
  {
    key: "3",
    label: "重命名",
  },
  {
    key: "4",
    label: "删除",
  },
];

const Main: React.FC<{
  data: any[];
}> = (props) => {
  const { data } = props;
  return (
    <div className="material-list">
      <Row>
        {data.map((_, i) => {
          return (
            <Col xxl={{ span: 3 }} xl={{ span: 4 }}>
              <div className="material-item">
                <div className="material-item-img mb-4">
                  <div className="flex justify-between z-10 absolute w-full top-2 px-2">
                    <Checkbox value={i} ></Checkbox>
                    <span className="flex items-center">
                      <HeartFilled className="!text-gray-300 mr-1.5 hover:!text-red-500" />
                      <Dropdown placement="bottomRight" menu={{ items }}>
                        <svg
                          width="28"
                          height="16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="ant-dropdown-trigger"
                        >
                          <rect
                            width="28"
                            height="16"
                            rx="4"
                            fill="#fff"
                            fillOpacity="0.65"
                          ></rect>
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M8 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm6 2a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"
                            fill="#000"
                            fillOpacity="0.9"
                          ></path>
                        </svg>
                      </Dropdown>
                    </span>
                  </div>
                  <img
                    src="https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.png"
                    alt="img"
                  />
                </div>
                <p className="text-sm mb-2 text-slate-950 truncate">
                  cat catcatcatcatcatcatcatcatcatcatcatcatcatcat
                </p>
                <p className="text-xs pb-3 text-gray-400 truncate">
                  今日 20:44
                </p>
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default Main;
