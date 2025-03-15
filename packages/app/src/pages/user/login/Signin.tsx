// 登录
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Checkbox, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const Signin: React.FC<{ jumpToSignup: () => void }> = ({ jumpToSignup }) => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values: any) => {
        const { userMobile, password } = values;
        navigate('/home');

        axios.post('/hz-users/login', {
            userMobile,
            password,
        }).then(({data}) => {
            if (!data.code) {
                localStorage.setItem('clientKey', data.data.clientKey);
                localStorage.setItem('user', JSON.stringify(data.data.userSessionInfo));
                navigate('/home', { state: { userInfo: data.data.userSessionInfo } }); // 登录成功后跳转到主页
            } else {
                message.error(data.message);
            }
        })
    };

    // 30天内免登录

    return (
        <Form form={form} onFinish={onFinish} style={{ width: '300px', textAlign: 'center' }}>
            <Form.Item label="" name="userMobile" rules={[{ required: true, message: '请输入手机号' }]}>
                <Input placeholder='请输入手机号' autoComplete="userMobile" />
            </Form.Item>
            <Form.Item label="" name="password" rules={[
                { required: true, message: '请输入密码' },
                { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/, message: '密码必须包含大小写字母和数字,长度8-16位' }
            ]}>
                <Input.Password placeholder='请输入密码' autoComplete="current-password" />
            </Form.Item>
            <Form.Item>
                <Checkbox>30天内免登陆</Checkbox>
                <Button type="link" href="#forgot-password" style={{ marginLeft: '90px' }}>忘记密码</Button>
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" style={{ width: '300px', height: '40px', fontWeight: 'bolder' }}>
                    登录
                </Button>
            </Form.Item>
            <Form.Item>
                <Button type="link" href="#register" onClick={() => jumpToSignup()} style={{}}>注册新账号</Button>
            </Form.Item>
            <Form.Item label="" name="privacy" valuePropName="checked" rules={[
                {
                    required: true,
                    message: '请同意《服务条款》和《隐私政策》',
                },
            ]}>
                <Checkbox>阅读并同意《服务条款》和《隐私政策》</Checkbox>
            </Form.Item>
        </Form>
    )
};

export default Signin;
