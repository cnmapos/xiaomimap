// 用户信息面板
import React, { useState } from "react";
import { Button, Modal, Avatar, Popover, message, Divider } from 'antd';
import { UserInfo as UserInfoType } from './types';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import axios from '@/service/axiosConfig';
import './index.css';

const UserInfo: React.FC<UserInfoType> = (userInfos) => {
    const [outModal, setOutModal] = useState(false);
    const navigate = useNavigate();

    const outConfirm = () => {
        setOutModal(true);
    };

    // 退出登录二次确认
    const handleOutOK = () => {
        axios.get('/hz-users/logout').then(({ data }) => {
            if (!data.code) {
                localStorage.removeItem('clientKey');
                setOutModal(false);
                navigate('/');
            } else {
                message.error(data.message);
            }
        });
    };

    const content = (
        <div>
            <Divider style={{ margin: 0, backgroundColor: '#dee0e3' }}></Divider>
            <Button type="text" onClick={outConfirm} className="logout">退出登录</Button>
        </div>
    );
    return (
        <>
            <Popover placement="topLeft" title={userInfos.userName} content={content} arrow={false}>
                <Button shape="circle"><Avatar style={{ backgroundColor: '#6ba1ec' }} icon={<UserOutlined />} /></Button>
            </Popover>
            <Modal title="确认退出登录账号吗？" open={outModal} onOk={handleOutOK} onCancel={() => setOutModal(false)}>
                退出登录后，你将无法收到账号的通知
            </Modal>
        </>

    );
};

export default UserInfo;