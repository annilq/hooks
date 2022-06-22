import { useState, useEffect } from 'react';

function useFullScreen(elementRef) {
  const [isFullScreen, setFullScreen] = useState(false);
  function fullscreenchange() {
    setFullScreen(!!document.fullscreenElement);
  }
  useEffect(() => {
    document.addEventListener('fullscreenchange', fullscreenchange);
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
      document.removeEventListener('fullscreenchange', fullscreenchange);
    };
  }, []);

  function setFullScreenHandle(openFullScreen) {
    if (openFullScreen) {
      if (elementRef.current) {
        elementRef.current.requestFullscreen();
      }
    } else if (elementRef.current) {
      document.exitFullscreen();
    }
  }

  return [isFullScreen, setFullScreenHandle];
}
export default useFullScreen;