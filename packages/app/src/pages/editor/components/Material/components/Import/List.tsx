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
import { useState } from "react";
import { PreviewListType } from "./Map";
import { Dropdown, message, Space, Tooltip, Modal } from "antd";
import classNames from "classnames";
import { deleteProjectAsset, mergeGeometry } from "@/service/api/project";
import GeometryIcon from "./GeometryIcon";
import { GeometryType } from "@/typings/map";
import { GeometryCname } from "./Map";
import "./index.less";

export interface ImportListProps {
  data: PreviewListType[];
}

const Material: React.FC<ImportListProps> = (props) => {
  const { data } = props;
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const items = [
    {
      key: 1,
      label: "属性",
      className: "!text-white hover:!text-cyan-300",
    },
    {
      key: 2,
      label: "删除",
      className: "!text-white hover:!text-cyan-300",
    },
    {
      key: 3,
      label: "应用到动画",
      className: "!text-white hover:!text-cyan-300",
    },
    {
      key: 4,
      label: "生产轨迹动画",
      className: "!text-white hover:!text-cyan-300",
    },
  ];
  const handleCheck = (item: PreviewListType) => {
    // if (item.type === GeometryType.GeometryCollection) return;
    if (checkedList.includes(item.geometryId)) {
      setCheckedList(checkedList.filter((id) => id !== item.geometryId));
    } else {
      setCheckedList([...checkedList, item.geometryId]);
    }
  };
  const handleOpenChange = async (open: boolean) => {
    if (!open) {
      setMenuOpen(false);
      return;
    }

    setMenuOpen(!!checkedList?.length);
  };
  const deleteAssets = async (
    params: {
      assetType: number;
      assetId: number;
    }[]
  ) => {
    const names = data
      .filter((t) => params.find((p) => p.assetId === t.geometryId))
      .map((t) => t.geometryName)
      ?.join("，");
    Modal.confirm({
      title: <>确定删除<span className="text-yellow-600 px-1">{names}</span>吗？</>,
      okText: "确定",
      cancelText: "取消",
      onOk: async () => {
        const res = await deleteProjectAsset(params);
        if (res.code === 0) {
          message.success("删除成功");
        } else {
          message.error(res.msg || "删除失败");
        }
      },
    });
  };

  const mergeGeometrys = async () => {
    // 只能合并两个及以上
    if (checkedList.length < 2) {
      message.warning("至少选择两个要素进行合并！");
      return;
    }
    // 如果checkedList有集合要素，提示
    const hasGeometryCollection = checkedList.find((id) => {
      return (
        data.find((item) => item.geometryId === id)?.type ===
        GeometryType.GeometryCollection
      );
    });
    if (hasGeometryCollection) {
      message.warning("集合要素不能二次合并！");
      return;
    }
    // 生产name
    const i =
      data.filter((t) => t.type === GeometryType.GeometryCollection)?.length +
      1;
    const geometryName = `${
      GeometryCname[GeometryType.GeometryCollection]
    }${i}`;
    const res = await mergeGeometry({
      projectId: data?.[0].projectId,
      geometryName,
      category: 1,
      geometryIds: checkedList,
    });
    if (res.code === 0) {
      message.success("创建成功");
    } else {
      message.error(res.msg || "创建失败");
    }
  };
  const handleContextMenuCommand = ({ key }) => {
    switch (key) {
      case "1":
        break;
      case "2":
        mergeGeometrys();
        break;
      case "3":
        {
          const dels = checkedList.map((id) => ({
            assetType: 4,
            assetId: id,
          }));
          // removeEntitys?.(checkedList);
          deleteAssets(dels);
        }
        break;
      case "4":
        break;
      default:
        break;
    }
  };
  const removeEntitys = (ids:number[]) => {
    data
      .filter((t) => ids.includes(t.geometryId))
      .forEach((t) => {
        t._removeEntity?.();
      });
  };
  const handleCommand = ({ key }, { _removeEntity, geometryId }: PreviewListType) => {
    switch (key) {
      case "1":
        break;
      case "2":
        console.log("删除");
        removeEntitys?.([geometryId]);
        deleteAssets([
          {
            assetType: 4,
            assetId: geometryId,
          },
        ]);
        break;
      case "3":
        break;
      case "4":
        break;
      default:
        break;
    }
  };
  return (
    <>
      <Dropdown
        open={menuOpen}
        menu={{
          onClick: (menu) => {
            menu.domEvent.stopPropagation();
            handleContextMenuCommand(menu);
          },
          items: [
            {
              key: 1,
              label: "生成轨迹",
              className: "!text-white hover:!text-cyan-300",
            },
            {
              key: 2,
              label: "生产集合要素",
              className: "!text-white hover:!text-cyan-300",
            },

            {
              key: 3,
              label: "删除",
              className: "!text-white hover:!text-cyan-300",
            },
          ],
          className: "!bg-black/80  !ml-5 !-mt-4 !text-white",
        }}
        onOpenChange={handleOpenChange}
        trigger={["contextMenu"]}
      >
        <span>
          {data.map((item) => {
            return (
              <div
                key={item.geometryId}
                onClick={() => {
                  handleCheck(item);
                }}
                className={classNames(
                  "flex justify-between items-center px-2 h-10 border-b-neutral-600 border-b-1 ",
                  {
                    "bg-cyan-300/50": checkedList.includes(item.geometryId),
                  }
                )}
              >
                <div className="flex-1 flex items-center">
                  <Tooltip title={item.showInMap ? "隐藏" : "显示"}>
                    {item.showInMap ? (
                      <EyeOutlined className="p-1.5" />
                    ) : (
                      <EyeInvisibleOutlined className="p-1.5 !text-neutral-600" />
                    )}
                  </Tooltip>
                  <GeometryIcon type={item.type} className="p-1.5" />
                  <span
                    className={classNames(
                      "text-sm flex-1 text-ellipsis overflow-hidden whitespace-nowrap w-0",
                      {
                        // " text-cyan-300": checkedList.includes(item.geometryId),
                      }
                    )}
                  >
                    {item.geometryName}
                  </span>
                </div>
                <Space>
                  <Tooltip title={item.collect ? "取消收藏" : "收藏"}>
                    {item.collect ? (
                      <StarFilled className="!text-amber-500" />
                    ) : (
                      <StarOutlined />
                    )}
                  </Tooltip>

                  <Dropdown
                    placement="bottomLeft"
                    menu={{
                      items,
                      onClick: (menu) => {
                        menu.domEvent.stopPropagation();
                        handleCommand(menu, item);
                      },
                      className: "!bg-black/80  !ml-5 !-mt-4 !text-white",
                    }}
                  >
                    <MoreOutlined
                      onClick={(e) => e.stopPropagation()}
                      className="cursor-pointer"
                    />
                  </Dropdown>
                </Space>
              </div>
            );
          })}
        </span>
      </Dropdown>
    </>
  );
};

export default Material;
