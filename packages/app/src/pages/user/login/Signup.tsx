// 注册
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const Signup: React.FC = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        const { userName, userMobile, password, rePassword } = values;

        axios.post('/hz-users/register', {
            userName,
            userMobile,
            password,
            rePassword,
        }).then(({data}) => {
            if (!data.code) {
                navigate('/home'); // 注册成功后跳转到主页
            } else {
                message.error(data.message);
            }
        })
    };

    return (
        <Form form={form} onFinish={onFinish} style={{ width: '300px' }}>
            <Form.Item label="" name="userName">
                <Input placeholder="请输入用户名" />
            </Form.Item>
            <Form.Item label="" name="userMobile" rules={[{ required: true, message: '请输入手机号' }]}>
                <Input placeholder="请输入手机号" />
            </Form.Item>
            <Form.Item label="" name="password" rules={[
                { required: true, message: '请输入密码!' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, message: '密码必须包含大小写字母和数字,长度8-16位!' }
            ]}>
                <Input.Password placeholder="必须包含大小写字母和数字，8-16位" />
            </Form.Item>
            <Form.Item label="" name="rePassword" dependencies={['password']}
            rules={[
                { required: true, message: '请再次输入密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次输入的密码不一致'));
                  },
                }),
              ]}>
                <Input.Password placeholder="请再次输入密码" />
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '300px', height: '40px', fontWeight: 'bolder' }}>
                    注册
                </Button>
            </Form.Item>
            <Form.Item label="" name="privacy" valuePropName="checked" rules={[{ required: true, message: '请同意《服务条款》和《隐私政策》' }]}>
                <Checkbox>阅读并接受《服务条款》和《隐私政策》</Checkbox>
            </Form.Item>
        </Form>
    )
};

export default Signup;
