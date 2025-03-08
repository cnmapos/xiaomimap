import { createViewer, HZViewer } from '@hztx/core';
import React, { useEffect, useRef } from 'react';
import MapContainer from '../components/map-container';

function Vector() {
  const container = useRef<HTMLElement | null>();
  const context = useRef<{ viewer: HZViewer | null }>({ viewer: null });

  useEffect(() => {
    const viewer = createViewer(container.current!, {
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5YjliYjIwYi0zMWE0LTQ4MTgtYWU4NC0wNWZmNTFmZjVhYmMiLCJpZCI6MjY1NzYxLCJpYXQiOjE3MzU1NzA3MTl9.BOJDK-WqsLV-QcQhbnAEf-wG1mtkftG1BYV6JIv0VoI',
    });
    context.current.viewer = viewer;

    return () => {
      viewer.destroy();
    };
  }, []);

  return (
    <MapContainer>
      <div
        ref={(e) => (container.current = e)}
        style={{ width: '100%', height: '100%' }}
        id="map"
      ></div>
      <div>
        <div className="hz-player">
          <div></div>
          <div></div>
        </div>
        <div className="hz-style"></div>
      </div>
    </MapContainer>
  );
}

export default Vector;
