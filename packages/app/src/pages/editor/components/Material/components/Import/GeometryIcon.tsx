import {
  BorderOuterOutlined,
  EnvironmentOutlined,
  PicCenterOutlined,
  RollbackOutlined,
} from "@ant-design/icons";
import { GeometryType, CreateGeometryType } from "@/typings/map";

export interface GeometryIconType {
  type: CreateGeometryType;
  [key: string]: any;
}

const Main: React.FC<GeometryIconType> = (props) => {
  const { type, ...rest } = props;
  if (type === GeometryType.Point) {
    return <EnvironmentOutlined {...rest} />;
  }
  if (type === GeometryType.LineString) {
    return <RollbackOutlined {...rest} />;
  }
  if (type === GeometryType.Polygon) {
    return <BorderOuterOutlined {...rest} />;
  }
  return <PicCenterOutlined {...rest} />;
};

export default Main;
