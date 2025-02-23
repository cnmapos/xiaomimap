import { Select, DatePicker, Button, Form, Input } from "antd";
import React from "react";
import "./index.less";

const Main: React.FC = () => {
  return (
    <div className="material-list">
      {Array(7).fill(null).map(() => {
        return (
          <div className="material-item">
            <div className="material-item-img mb-4">
              <img
                src="https://static.yximgs.com/udata/pkg/admin-center/311250d4d5d3e7a935460a6f55c9faccbb44303b.png"
                alt="img"
              />
            </div>
            <p className="text-sm mb-2 text-slate-950 truncate">cat catcatcatcatcatcatcatcatcatcatcatcatcatcat</p>
            <p className="text-xs mb-3 text-gray-400 truncate">今日 20:44</p>
          </div>
        );
      })}
    </div>
  );
};

export default Main;
