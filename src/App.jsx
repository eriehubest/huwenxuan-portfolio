import React, { useEffect, useRef, useState } from 'react'
import Home from './pages/home/home'
import Application from './javascript/three/application';

const App = () => {
  const jsCanvasRef = useRef(null);
  const appRef = useRef(null);

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
  }, [])

  return (
    <main>
      <Home className="z-10000"/>
      <canvas ref={jsCanvasRef} className={`js-canvas absolute w-dvw h-dvh top-0 left-0 z-0 pointer-events-none`}></canvas>
    </main>
  )
}

export default App