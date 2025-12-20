import { useState, useEffect } from "react"

export const useIsPortrait = (minWidth = 577) => {
    const getState = () => {
        const portrait = window.matchMedia("(orientation: portrait)").matches
        const wideEnough = window.innerWidth >= minWidth
        return portrait && wideEnough
    }

    const [isPortrait, setIsPortrait] = useState(getState)

    useEffect(() => {
        const onResize = () => setIsPortrait(getState())
        window.addEventListener("resize", onResize)
        return () => window.removeEventListener("resize", onResize)
    }, [])

    return isPortrait
}