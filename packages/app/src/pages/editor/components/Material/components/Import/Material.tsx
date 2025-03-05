import {
  PlusCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Input } from "antd";
import ToolBar from "./ToolBar";
import MaterialList from './MaterialList';

import "./index.less";



const Material: React.FC = () => {
  return (
    <div className="p-4 import-material w-full">
      <Input
        className="search !bg-gray-950 !text-gray-500 !border-transparent !rounded-sm"
        placeholder="搜索文件名称、画面元素、台词"
        prefix={<SearchOutlined />}
      />
      <div className="flex justify-between items-center mt-3">
        <Button
          className="!border-gray-500"
          ghost
          size="small"
          type="dashed"
          icon={<PlusCircleFilled className="hz-editor-primary-color" />}
        >
          导入
        </Button>
        <ToolBar></ToolBar>
      </div>
      {/* <MaterialList></MaterialList> */}
    </div>
  );
};

export default Material;
