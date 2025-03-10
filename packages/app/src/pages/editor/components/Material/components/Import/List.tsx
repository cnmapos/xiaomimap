import {
  BorderOuterOutlined,
  EnvironmentOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  MoreOutlined,
  RollbackOutlined,
  StarFilled,
  StarOutlined,
} from "@ant-design/icons";
import { PreviewListType } from "./Map";
import { Dropdown, Space } from "antd";
import "./index.less";

export interface ImportListProps {
  data: PreviewListType[];
}

const Material: React.FC<ImportListProps> = (props) => {
  const { data } = props;
  const items = [
    {
      key: "1",
      label: "属性",
      className: "!text-white",
    },
    {
      key: "2",
      label: "删除",
      className: "text-main !font-bold",
    },
    {
      key: "3",
      label: "应用到动画",
      className: "!text-white",
    },
    {
      key: "4",
      label: "生产轨迹动画",
      className: "!text-white",
    },
  ];
  return (
    <>
      {data.map((item) => {
        return (
          <div
            key={item.uuid}
            className="flex  justify-between items-center px-2 h-10 border-b-neutral-600 border-b-1 "
          >
            <div>
              {item.showInMap ? (
                <EyeOutlined className="p-1.5" />
              ) : (
                <EyeInvisibleOutlined className="p-1.5 !text-neutral-600" />
              )}
              {item.type === "point" ? (
                <EnvironmentOutlined className="p-1.5" />
              ) : item.type === "line" ? (
                <RollbackOutlined className="p-1.5" />
              ) : (
                <BorderOuterOutlined className="p-1.5" />
              )}
              <span className="text-sm">{item.name}</span>
            </div>
            <Space>
              {item.collect ? (
                <StarFilled className="!text-amber-500" />
              ) : (
                <StarOutlined />
              )}
              <Dropdown
                placement="bottomLeft"
                menu={{
                  items,
                  className: "!bg-black/80  !ml-5 !-mt-4 !text-white",
                }}
              >
                <MoreOutlined className="cursor-pointer" />
              </Dropdown>
            </Space>
          </div>
        );
      })}
    </>
  );
};

export default Material;
