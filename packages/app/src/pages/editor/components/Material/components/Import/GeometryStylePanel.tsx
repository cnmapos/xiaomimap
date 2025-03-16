import { InputNumber, Slider, Checkbox, ColorPicker, Form } from "antd";
import { GeometryType } from "@/typings/map";
import "./index.less";

interface StylePanel {
  type: GeometryType | null;
}

const Panel: React.FC<StylePanel> = (props) => {
  const { type = GeometryType.Polygon } = props;

  if(type === null){
    // 默认不展示
    return null;
  }
  const handleValuesChange = (_, values: any) => {
    console.log(values);
  };
  return (
    <div className="bg-neutral-800/90 rounded-sm p-4 min-w-60">
      <h3 className="font-bold text-base mb-4">样式属性</h3>
      <Form
        name="basic"
        initialValues={{
          radius: 12,
          fillColor: "#fff",
          fill: true,
          outline: true,
          outlineColor: "#fff",
          outlineWidth: 15,
        }}
        className="geometry-style-form"
        onValuesChange={handleValuesChange}
        autoComplete="off"
      >
        {type === GeometryType.Point && (
          <Form.Item name="radius" label="半径">
            <InputNumber min={1} />
          </Form.Item>
        )}

        <Form.Item name="fill" valuePropName="checked" label={null}>
          <Checkbox className="!text-white">填充</Checkbox>
        </Form.Item>
        <Form.Item label="颜色" name="fillColor">
          <ColorPicker
            onChange={(color) => console.log(color.toHexString())}
            showText
            size="small"
          />
        </Form.Item>
        {type !== GeometryType.Polygon && (
          <Form.Item label="粗细" name="fillWidth">
            <Slider />
          </Form.Item>
        )}

        <Form.Item name="outline" valuePropName="checked" label={null}>
          <Checkbox className="!text-white">描边</Checkbox>
        </Form.Item>
        <Form.Item label="颜色" name="outlineColor">
          <ColorPicker showText size="small" />
        </Form.Item>
        <Form.Item label="粗细" name="outlineWidth">
          <Slider />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Panel;
