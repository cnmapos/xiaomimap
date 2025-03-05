import { AppstoreAddOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import classNames from "classnames";

import MapMenuBar from "./MapMenuBar";
import { useState } from "react";

const Map: React.FC = () => {
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <div className={classNames("bg-editor-card text-white absolute w-full h-full", {
      "fixed top-0 left-0 right-0 bottom-0 z-10": fullscreen,
    })}>
      <MapMenuBar ></MapMenuBar>
     <div className="map bg-amber-200 h-full w-full"></div>
    </div>
  );
};

export default Map;
