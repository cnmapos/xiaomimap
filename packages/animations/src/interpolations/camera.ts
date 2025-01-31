import { linearInterpolate } from './common';
import { coordinatesInterpolate } from './degree';

type CameraViewState = {
  position: [number, number, number];
  direction: [number, number, number?];
};

export function cameraFlyInterpolate(
  start: CameraViewState,
  end: CameraViewState,
  t: number
): any {
  const startPosition =
    start.position.length > 2 ? start.position : [...start.position, 0];
  const endPosition =
    end.position.length > 2 ? end.position : [...end.position, 0];

  const heading = linearInterpolate(start.direction[0], end.direction[0], t);
  const pitch = linearInterpolate(start.direction[1], end.direction[1], t);
  const roll = linearInterpolate(
    start.direction[2] || 0,
    end.direction[2] || 0,
    t
  );

  const position = coordinatesInterpolate(startPosition, endPosition, t);

  console.log('cameraFlyInterpolate', t, position, heading, pitch, roll);

  return {
    position: position as any,
    direction: [heading, pitch, roll],
  };
}
