import React from 'react';
import config from './config'; // 假设config.ts在上级目录
import { Link } from 'react-router-dom'; // 假设使用react-router进行路由

const DemoNavigation: React.FC = () => {
  return (
    <div className="flex flex-col">
      {config.map((group) => (
        <div className="flex flex-col" key={group.name}>
          <h2 className="font-bold font-14">{group.name}</h2>
          <ul className="flex flex-wrap ">
            {group.children.map((demo) => (
              <li className="w-1/4" key={demo.path}>
                <Link to={demo.path}>
                  <div className="border-2" style={{ width: 200, height: 200 }}>
                    {demo.thumbnail ? <img src={demo.thumbnail} /> : null}
                  </div>
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
