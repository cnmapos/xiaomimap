import { Slider, Checkbox, ColorPicker, Form } from "antd";

import "./index.less";

const Main: React.FC = () => {
  const handleValuesChange = (_, values: any) => {
    console.log(values);
  };
  return (
    <div className="bg-neutral-800/90 rounded-sm p-4 min-w-60">
      <h3 className="font-bold text-base mb-4">样式属性</h3>
      <Form
        name="basic"
        initialValues={{
          fillColor: "#fff",
          fill: true,
          stroke: true,
          strokeColor: "#fff",
          strokeWidth: 15,
        }}
        className="geometry-style-form"
        onValuesChange={handleValuesChange}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
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
        <Form.Item name="stroke" valuePropName="checked" label={null}>
          <Checkbox className="!text-white">描边</Checkbox>
        </Form.Item>
        <Form.Item label="颜色" name="strokeColor">
          <ColorPicker showText size="small" />
        </Form.Item>
        <Form.Item label="粗细" name="strokeWidth">
          <Slider />
        </Form.Item>
      </Form>
    </div>
  );
};

export default Main;
