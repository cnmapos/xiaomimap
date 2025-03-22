import {
  InputNumber,
  Slider,
  Checkbox,
  ColorPicker,
  Form,
  Button,
  message,
} from "antd";
import { GeometryType } from "@/typings/map";
import { IEntity, Style } from "@hztx/core";
import { saveProjectAsset } from "@/service/api/project";
import "./index.less";
import { useCallback, useEffect, useState } from "react";
import { PreviewListType } from "./Map";
import MapPanel from "./MapPanel";
interface StylePanel {
  type: GeometryType | null;
  entityStyle?: Style;
  updateEntityStyle: (style: Style) => void;
  geometry?: PreviewListType;
}

// 配置默认样式 后续可以配置
const defaultStyle = {
  // radius: 10,
  fillColor: "#fff",
  fillWidth: 15,
  fill: true,
  outline: true,
  outlineColor: "#fff",
  outlineWidth: 15,
};

const Panel: React.FC<StylePanel> = (props) => {
  const { geometry, entityStyle, type = GeometryType.Polygon } = props;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (entityStyle) {
      const { pixelSize, width, color, outlineColor, outlineWidth } =
        entityStyle;
      const values = {
        fillColor: color,
        fillWidth: pixelSize || width,
        outlineColor,
        outlineWidth,
      };
      form.setFieldsValue(values);
    }
  }, [entityStyle]);

  if (type === null) {
    // 默认不展示
    return null;
  }
  const formatStyle = (style: any) => {
    const { fillColor:_fillColor, fillWidth, outlineColor:_outlineColor, outlineWidth } = style;
    /*
    Point
    pixelSize
    color
    outlineColor
    outlineWidth

    Line
    width
    color

    Polygon
    pixelSize
    outlineColor
    color
    */
    const fillColor = _fillColor?.toHexString?.() || _fillColor;
    const outlineColor = _outlineColor?.toHexString?.() || _outlineColor;
    if (type === GeometryType.Point) {
      return {
        pixelSize: fillWidth,
        color: fillColor,
        outlineColor,
        outlineWidth,
      };
    }
    if (type === GeometryType.LineString) {
      return {
        width: fillWidth,
        color: fillColor,
        outlineColor,
        outlineWidth,
      };
    }
    if (type === GeometryType.Polygon) {
      return {
        pixelSize: fillWidth,
        outlineColor,
        color: fillColor,
      };
    }
    return null;
  };
  const updateGeometryStyle = async () => {
    if (!geometry) return;
    const values = formatStyle(form.getFieldsValue());
    if (!values) return;
    setLoading(true);
    const res = await saveProjectAsset({
      geometryList: [
        {
          geometryId: geometry.geometryId,
          geometryJson: JSON.stringify({
            ...(geometry?.geometryJson || {}),
            style: values,
          }),
        },
      ],
    }).finally(() => {
      setLoading(false);
    });
    if (res.code === 0) {
      props.updateEntityStyle(values);
      message.success("保存成功");
    } else {
      message.error(res.msg || "保存失败");
    }
    return res?.data;
  };
  const handleValuesChange = (_, values: any) => {
    console.log(values);
  };
  const handleSave = () => {
    updateGeometryStyle();
  };
  return (
    <MapPanel title="样式属性">
      <Form
        name="basic"
        onFinish={handleSave}
        form={form}
        initialValues={defaultStyle}
        className="geometry-style-form"
        onValuesChange={handleValuesChange}
        autoComplete="off"
      >
        <Form.Item name="fill" valuePropName="checked" label={null}>
          <Checkbox className="!text-white">填充</Checkbox>
        </Form.Item>
        <Form.Item label="颜色" name="fillColor">
          <ColorPicker
            showText
            size="small"
          />
        </Form.Item>
        <Form.Item label="粗细" name="fillWidth">
          <Slider step={1} max={20} min={1} />
        </Form.Item>
        <Form.Item name="outline" valuePropName="checked" label={null}>
          <Checkbox className="!text-white">描边</Checkbox>
        </Form.Item>
        <Form.Item label="颜色" name="outlineColor">
          <ColorPicker showText size="small" />
        </Form.Item>
        {
          type !== GeometryType.Polygon && (
            <Form.Item label="粗细" name="outlineWidth">
              <Slider step={1} max={10} min={1} />
            </Form.Item>
          )
        }
        <Form.Item className="flex justify-end !-mt-4 !mb-0">
          <Button
            size="small"
            htmlType="submit"
            type="primary"
            className="mt-4"
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </MapPanel>
  );
};

export default Panel;
