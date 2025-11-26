import { useState, useEffect } from 'react'

const useWindowHeight = () => {
  const [height, setHeight] = useState(window.innerHeight)

  useEffect(() => {
    const handleResize = () => setHeight(window.innerHeight)
    window.addEventListener('resizeHeight', handleResize)
    return () => window.removeEventListener('resizeHeight', handleResize)
  }, [])

  return height + 170     // Headerin korkeus
}

export default useWindowHeight