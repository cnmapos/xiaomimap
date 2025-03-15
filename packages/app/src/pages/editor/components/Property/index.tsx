import React, { useState } from "react";
import { Select, Slider, Radio, Button } from "antd";
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  MenuOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from "@ant-design/icons";
import Styles from "./styles.module.less";

const Property: React.FC = () => {
  const [fontFamily, setFontFamily] = useState("系统");
  const [fontSize, setFontSize] = useState(15);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [color, setColor] = useState("#FFFFFF");
  const [letterSpacing, setLetterSpacing] = useState(0);
  const [lineHeight, setLineHeight] = useState(0);
  const [textAlign, setTextAlign] = useState("left");

  return (
    <div className={Styles.property}>
      <div className={Styles.section}>
        <div className={Styles.row}>
          <span className={Styles.label}>字体</span>
          <Select 
            value={fontFamily}
            onChange={setFontFamily}
            className={Styles.fontSelect}
          >
            <Select.Option value="系统">系统</Select.Option>
          </Select>
        </div>
        
        <div className={Styles.row}>
          <span className={Styles.label}>字号</span>
          <Slider
            value={fontSize}
            onChange={setFontSize}
            min={12}
            max={72}
            className={Styles.slider}
          />
          <div className={Styles.value}>{fontSize}</div>
        </div>

        <div className={Styles.row}>
          <span className={Styles.label}>样式</span>
          <div className={Styles.styleButtons}>
            <Button 
              type={isBold ? "primary" : "default"}
              icon={<BoldOutlined />}
              onClick={() => setIsBold(!isBold)}
            />
            <Button
              type={isItalic ? "primary" : "default"}
              icon={<ItalicOutlined />}
              onClick={() => setIsItalic(!isItalic)}
            />
            <Button
              type={isUnderline ? "primary" : "default"}
              icon={<UnderlineOutlined />}
              onClick={() => setIsUnderline(!isUnderline)}
            />
          </div>
        </div>

        <div className={Styles.row}>
          <span className={Styles.label}>颜色</span>
          <div className={Styles.colorPicker}>
            <div 
              className={Styles.colorBlock}
              style={{ backgroundColor: color }}
            />
          </div>
        </div>

        <div className={Styles.row}>
          <span className={Styles.label}>字间距</span>
          <Slider
            value={letterSpacing}
            onChange={setLetterSpacing}
            min={-10}
            max={10}
            className={Styles.slider}
          />
          <div className={Styles.value}>{letterSpacing}</div>
        </div>

        <div className={Styles.row}>
          <span className={Styles.label}>行间距</span>
          <Slider
            value={lineHeight}
            onChange={setLineHeight}
            min={0}
            max={100}
            className={Styles.slider}
          />
          <div className={Styles.value}>{lineHeight}</div>
        </div>

        <div className={Styles.row}>
          <span className={Styles.label}>对齐方式</span>
          <Radio.Group value={textAlign} onChange={e => setTextAlign(e.target.value)}>
            <Radio.Button value="left"><AlignLeftOutlined /></Radio.Button>
            <Radio.Button value="center"><AlignCenterOutlined /></Radio.Button>
            <Radio.Button value="right"><AlignRightOutlined /></Radio.Button>
            <Radio.Button value="justify"><MenuOutlined /></Radio.Button>
            <Radio.Button value="indent"><MenuUnfoldOutlined /></Radio.Button>
            <Radio.Button value="outdent"><MenuFoldOutlined /></Radio.Button>
          </Radio.Group>
        </div>
      </div>

      <div className={Styles.footer}>
        <Button type="primary">保存预设</Button>
      </div>
    </div>
  );
};

export default Property;