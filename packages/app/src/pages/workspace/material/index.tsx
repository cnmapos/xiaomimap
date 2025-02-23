import { Select, DatePicker, Button, Form, Input } from "antd";
import React from "react";
import "./index.less";
import { DeleteOutlined } from "@ant-design/icons";
import MaterialList from "./component/MaterialList";

const { Option } = Select;
const { RangePicker } = DatePicker;
const Main: React.FC = () => {
  const [form] = Form.useForm();

  return (
    <div className="material">
      <div className="flex-between mb-4">
        <Form layout="inline" form={form} initialValues={{}}>
          <Form.Item label="素材名称">
            <Input placeholder="请输入关键字" />
          </Form.Item>
          <Form.Item label="素材类型" style={{ width: "250px" }}>
            <Select>
              <Option value="1">全部</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Field B2">
            <RangePicker placeholder={["开始时间", "结束时间"]} />
          </Form.Item>
        </Form>
        <div className="flex-center">
          <div className="delete pr-2 pl-2 h-8 rounded flex-center bg-gray-200 mr-12">
            <DeleteOutlined />
          </div>
          <Button type="primary">上传</Button>
        </div>
      </div>
      <MaterialList/>
    </div>
  );
};

export default Main;
