import React, { useRef } from 'react'

import { useFullScreen } from 'jqbhooks'

const App = () => {
  const ref = useRef()
  const [isFullScreen, setFullScreenHandle] = useFullScreen(ref)
  console.log(isFullScreen);
  return (
    <div ref={ref} onClick={() => setFullScreenHandle(!isFullScreen)}>
      是否全屏 {isFullScreen}
    </div>
  )
}
export default App
