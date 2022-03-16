import { useRef, useState } from 'react';
import useEventListener from "./useEventListener"

const useModalMove = (handle, element) => {
  const { onStart, onMove, onEnd } = handle
  const [canMove, setCanMove] = useState(false);
  const originPositon = useRef(null);

  function onEndHandle({ clientX, clientY }) {
    setCanMove(false);
    onEnd({ clientX: clientX - originPositon.current.clientX, clientY: clientY - originPositon.current.clientY })
  }

  useEventListener('mousedown', ({ clientX, clientY }) => {
    setCanMove(true);
    originPositon.current = { clientX, clientY }
    onStart()
  }, element);

  useEventListener('mousemove', ({ clientX, clientY }) => {
    if (canMove) {
      onMove({ clientX: clientX - originPositon.current.clientX, clientY: clientY - originPositon.current.clientY })
    }
  }, element);

  useEventListener('mouseup', ({ clientX, clientY }) => {
    onEndHandle({ clientX, clientY })
  }, element);

  useEventListener('mouseout', ({ clientX, clientY }) => {
    if (canMove) {
      onEndHandle({ clientX, clientY })
    }
  }, element);

  useEventListener('mouseup', () => {
    setCanMove(false);
  }, document.body);
}


export default useModalMove;