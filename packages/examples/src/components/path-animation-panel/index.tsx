import React, { useState } from 'react';
import { Card, Slider, Input, Select, Checkbox, Row, Col } from 'antd';
import { IconGrid } from './IconGrid';

function PathAnimationPanel() {
  const [settings, setSettings] = useState({
    startAngle: 11,
    viewDistance: 5,
    angle: 5,
    tiltAngle: 5,
    viewPosition: 'center',
    startDuration: 5,
    totalDuration: 5,
    lineOpacity: 50,
    enableAnimation: true,
  });

  const handleInputChange = (key, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [key]: value,
    }));
  };

  const handleSliderChange = (value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      lineOpacity: value,
    }));
  };

  const handleSelectChange = (value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      viewPosition: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      enableAnimation: e.target.checked,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <Card
        title="线路轨迹动画"
        className="max-w-5xl mx-auto bg-gray-700"
        headStyle={{
          backgroundColor: '#374151',
          color: 'white',
          borderBottom: '1px solid #4B5563',
        }}
        bodyStyle={{ backgroundColor: '#374151' }}
      >
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-1">
            <div className="mb-6">
              <h3 className="text-white mb-4">图标设置</h3>
              <Checkbox checked={true} className="text-white mb-4">
                跟随轨迹旋转
              </Checkbox>
              <IconGrid />
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white mb-4">摄像机</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white block mb-2">视点距离(米)</label>
                <Input
                  value={settings.viewDistance}
                  onChange={(e) => handleInputChange('viewDistance', e.target.value)}
                />
              </div>
              <div>
                <label className="text-white block mb-2">方位(度)</label>
                <Input
                  value={settings.angle}
                  onChange={(e) => handleInputChange('angle', e.target.value)}
                />
              </div>
              <div>
                <label className="text-white block mb-2">倾斜(度)</label>
                <Input
                  value={settings.tiltAngle}
                  onChange={(e) => handleInputChange('tiltAngle', e.target.value)}
                />
              </div>
              <div>
                <label className="text-white block mb-2">视点位置</label>
                <Select
                  value={settings.viewPosition}
                  className="w-full"
                  onChange={handleSelectChange}
                  options={[
                    { value: 'center', label: '居中' },
                    { value: 'start', label: '起点' },
                    { value: 'end', label: '终点' },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="col-span-1">
            <h3 className="text-white mb-4">其他</h3>
            <div className="space-y-4">
              <div>
                <label className="text-white block mb-2">起始停留(秒)</label>
                <Input
                  value={settings.startDuration}
                  onChange={(e) => handleInputChange('startDuration', e.target.value)}
                />
              </div>
              <div>
                <label className="text-white block mb-2">总时长(秒)</label>
                <Input
                  value={settings.totalDuration}
                  onChange={(e) => handleInputChange('totalDuration', e.target.value)}
                />
              </div>
              <div>
                <label className="text-white block mb-2">线路透明度</label>
                <Slider
                  value={settings.lineOpacity}
                  onChange={handleSliderChange}
                />
              </div>
              <div>
                <Checkbox
                  checked={settings.enableAnimation}
                  onChange={handleCheckboxChange}
                  className="text-white"
                >
                  轨迹前进动画
                </Checkbox>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export {
    PathAnimationPanel
}