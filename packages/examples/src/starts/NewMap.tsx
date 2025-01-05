import { useState, useEffect } from 'react'
import { HZViewer } from '@hztx/core'


function NewMap() {
  const [, setViewer] = useState<HZViewer>();

  // 在组件挂载时实例化HZViewer
  useEffect(() => {
    const newViewer = new HZViewer('map');
    setViewer(newViewer);
    // 清理函数
    return () => {
      newViewer.destroy();
    };
  }, []);

  return (
    <>
      <div id="map" style={{ width: '100vw', height: '100vh' }}></div>
    </>
  )
}

export default NewMap
