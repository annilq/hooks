import {
  useCallback,
  useRef,
} from 'react';

const useDoubleClick = (
  doubleClick = (e, record) => { },
  click = (e, record) => { },
  options = {
    timeout: 200,
  }) => {
  const clickTimeout = useRef();

  const clearClickTimeout = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
  };

  return useCallback((event, rest) => {
    clearClickTimeout();
    if (click && (event).detail === 1) {
      clickTimeout.current = setTimeout(() => {
        click(event, rest);
      }, options.timeout);
    }
    if ((event).detail % 2 === 0) {
      doubleClick(event, rest);
    }
  }, [click, doubleClick, options.timeout]);
};

export default useDoubleClick