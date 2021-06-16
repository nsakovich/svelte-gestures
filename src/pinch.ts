'use strict';

import { setPointerControls, GestureName } from './shared';

function getPointersDistance(activeEvents: PointerEvent[]) {
  return Math.hypot(
    activeEvents[0].clientX - activeEvents[1].clientX,
    activeEvents[0].clientY - activeEvents[1].clientY
  );
}

export function pinch(node: HTMLElement): { destroy: () => void } {
  const gestureName: GestureName = 'pinch';

  let prevDistance: number = null;
  let initDistance = 0;

  function onUp(activeEvents: PointerEvent[]) {
    if (activeEvents.length === 1) {
      prevDistance = null;
    }
  }

  function onDown(activeEvents: PointerEvent[]) {
    if (activeEvents.length === 2) {
      initDistance = getPointersDistance(activeEvents);
    }
  }

  function onMove(activeEvents: PointerEvent[]) {
    if (activeEvents.length === 2) {
      const curDistance = getPointersDistance(activeEvents);

      if (prevDistance !== null && curDistance !== prevDistance) {
        const scale = curDistance / initDistance;
        node.dispatchEvent(
          new CustomEvent(gestureName, {
            detail: { scale },
          })
        );
      }
      prevDistance = curDistance;
    }
  }

  return setPointerControls(gestureName, node, onMove, onDown, onUp);
}