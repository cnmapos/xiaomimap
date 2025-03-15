import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input } from "antd";
import ToolBar from "./ToolBar";
import MaterialList from "./MaterialList";

import "./index.less";

export interface ImportBarProps {
  onSelectMode: (v:number) => void;
}

const Material: React.FC<ImportBarProps> = (props) => {
  const { onSelectMode } = props;
  const items = [
    {
      key: 1,
      label: "本地",
    },
    {
      key: 2,
      label: "地图",
    },
  ];
  return (
    <div className="p-4 import-material w-full">
      <Input
        className="search !bg-gray-950 !text-gray-500 !border-transparent !rounded-sm"
        placeholder="搜索文件名称、画面元素、台词"
        prefix={<SearchOutlined />}
      />
      <div className="flex justify-between items-center mt-3">
        <Dropdown placement="bottomRight" menu={{ 
          items, 
          selectable: true,
          onSelect: ({ key }) => {
            onSelectMode(Number(key))
           }
          }}>
          <Button
            className="!border-gray-500"
            ghost
            size="small"
            type="dashed"
            icon={<PlusCircleFilled className="hz-editor-primary-color" />}
          >
            导入
          </Button>
        </Dropdown>
        <ToolBar></ToolBar>
      </div>
    </div>
  );
};

export default Material;
