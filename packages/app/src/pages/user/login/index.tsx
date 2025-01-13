// 登录 & 注册
import React, { useState } from "react";
import Signin from "./Signin";
import Signup from "./Signup";
import viteLogo from '/vite.svg'
import resumePic from '@/assets/resume.png';
import './index.css';

const SignInAndUp: React.FC = () => {
    const [status, setStatus] = useState<Boolean>(true); // true 登录 false 注册

    const jumpToSignup = () => {
        setStatus(false);
    }

    return (
        <div className="container">
            <div className="header">
                <img src={viteLogo} className="logo" alt="Vite logo" />
                <div>
                    <a href="#">帮助 ｜</a>
                    <a href="#">反馈</a>
                </div>
            </div>
            <div className="content">
                <img src={resumePic} className="resume" alt="Resume logo" />
                <div className="sign">
                    <div className="signTitle">账号{status ? '登录' : '注册'}</div>
                    {status ? <Signin jumpToSignup={jumpToSignup} /> : <Signup />}
                </div>
            </div>
            <div className="footer">
                Copyright © 2025-2026 版权所有：惠泽图行  备案编号：蜀ICP备09012342421号
                <div>
                    <a href="#">服务协议 ｜</a>
                    <a href="#">隐私政策</a>
                </div>
            </div>
        </div>
    );
}

export default SignInAndUp;