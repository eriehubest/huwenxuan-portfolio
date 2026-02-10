import React, { useEffect, useRef, useState } from 'react'
import Home from './pages/home/home'
import Application from './javascript/three/application';
import AnimationTracker from './javascript/three/AnimationTracker';

const App = () => {
  const jsCanvasRef = useRef(null);
  const appRef = useRef(null);
  const animationTrackerRef = useRef(null);

  const [isDebugMode, setIsDebugMode] = useState(false);

  addEventListener('keydown', (e) => {
    if (e.key === 't') {
      setIsDebugMode(!isDebugMode);
    }
  })

  useEffect(() => {
    if (!jsCanvasRef.current)
      return;

    if (appRef.current)
      return;

    appRef.current = new Application({
      $canvas: jsCanvasRef.current,
    })
  })

  return (
    <main>
      <canvas ref={jsCanvasRef} className={`js-canvas fixed w-dvw h-dvh top-0 left-0 ${isDebugMode ? 'z-1000' : 'z-0'}`}></canvas>
      <Home />
    </main>
  )
}

export default App