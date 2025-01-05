import React from 'react';
import config from './config'; // 假设config.ts在上级目录
import { Link } from 'react-router-dom'; // 假设使用react-router进行路由

const DemoNavigation: React.FC = () => {
    return (
        <div>
            {config.map((group) => (
                <div key={group.name}>
                    <h2>{group.name}</h2>
                    <ul>
                        {group.children.map((demo) => (
                            <li key={demo.path}>
                                <Link to={demo.path}>
                                    <img src={demo.thumbnail} alt={demo.name} />
                                    {demo.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default DemoNavigation;
