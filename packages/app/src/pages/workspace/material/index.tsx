import { Select, DatePicker, Button, Form, Input, Checkbox } from "antd";
import type { GetProp } from "antd";
import React, { useState } from "react";
import "./index.less";
import { DeleteOutlined } from "@ant-design/icons";
import MaterialList from "./component/MaterialList";

const { Option } = Select;
const { RangePicker } = DatePicker;
const Main: React.FC = () => {
  const [form] = Form.useForm();
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [list, setList] = useState<any[]>(Array(7).fill(null));

  const checkAll = list.length === checkedList.length;
  const indeterminate =
    checkedList.length > 0 && checkedList.length < list.length;

  const handleValuesChange = (changedValues: any, allValues: any) => {
    console.log(changedValues, allValues);
  };

  const onChange = (checkedValues: number[]) => {
    setCheckedList(checkedValues);
    console.log("checked = ", checkedValues);
  };
  const onCheckAllChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ids = list.map((_, i) => i);
    setCheckedList(e.target.checked ? ids : []);
  };
  return (
    <div className="material">
      <div className="flex-between mb-4">
        <Form
          layout="inline"
          form={form}
          onValuesChange={handleValuesChange}
          initialValues={{}}
        >
          <Form.Item label="素材名称">
            <Input placeholder="请输入关键字" />
          </Form.Item>
          <Form.Item label="素材类型" style={{ width: "250px" }}>
            <Select>
              <Option value="1">全部</Option>
            </Select>
          </Form.Item>
          <Form.Item label="上传时间">
            <RangePicker placeholder={["开始时间", "结束时间"]} />
          </Form.Item>
        </Form>
        <div className="flex-center">
          <Checkbox
            indeterminate={indeterminate}
            onChange={onCheckAllChange}
            checked={checkAll}
          >
            全选（已选 {checkedList.length}）
          </Checkbox>
          <div className="delete pr-2 pl-2 h-8 rounded flex-center bg-gray-200 !mr-4 !ml-4">
            <DeleteOutlined />
          </div>
          <Button type="primary">上传</Button>
        </div>
      </div>
      <Checkbox.Group
        style={{ width: "100%" }}
        value={checkedList}
        onChange={onChange}
      >
        <MaterialList data={list} />
      </Checkbox.Group>
    </div>
  );
};

export default Main;
