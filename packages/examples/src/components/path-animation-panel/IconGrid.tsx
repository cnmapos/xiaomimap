import React from 'react';
import { Tabs } from 'antd';

const iconGroups = {
  normal: Array(24).fill('⚪'),
  vip: Array(12).fill('🔵'),
  '3d': Array(8).fill('🟣'),
};

export const IconGrid: React.FC = () => {
  return (
    <Tabs
      defaultActiveKey="normal"
      items={[
        {
          key: 'normal',
          label: '普通',
          children: (
            <div className="grid grid-cols-8 gap-2 p-2 bg-gray-600 rounded">
              {iconGroups.normal.map((icon, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
                >
                  {icon}
                </div>
              ))}
            </div>
          ),
        },
        {
          key: 'vip',
          label: 'VIP',
          children: (
            <div className="grid grid-cols-8 gap-2 p-2 bg-gray-600 rounded">
              {iconGroups.vip.map((icon, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
                >
                  {icon}
                </div>
              ))}
            </div>
          ),
        },
        {
          key: '3d',
          label: '3D',
          children: (
            <div className="grid grid-cols-8 gap-2 p-2 bg-gray-600 rounded">
              {iconGroups['3d'].map((icon, index) => (
                <div
                  key={index}
                  className="w-8 h-8 bg-gray-500 rounded flex items-center justify-center cursor-pointer hover:bg-gray-400"
                >
                  {icon}
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
};
