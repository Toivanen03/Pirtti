import { useState, useEffect } from "react"

export default function useIsMobile() {
    const breakPoint = 960
    const [mobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' ? window.innerWidth <= breakPoint : false
    )

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= breakPoint)
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return mobile
}