import { useRef, useEffect } from 'react';

const useEventListener = (eventName, handler, element = global) => {
  const savedHandler = useRef(null);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(
    () => {
      const eventListener = event => savedHandler.current(event);
      element && element.addEventListener(eventName, eventListener);
      return () => {
        element && element.removeEventListener(eventName, eventListener);
      };
    },
    [eventName, element]
  );
};

export default useEventListener;