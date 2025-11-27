import './styles/shiny-button.scss'

export const getButtonStyle = (endPoint, property, location, activeOtherLink, mobile) => {
    const buttonProperties = {
        active: {
            style: '2px solid orange',
            class: 'active-button shadow h-button shiny-button'
        },
        passive: {
            style: '1px solid brown',
            class: mobile ? 'shadow h-button' : 'shadow h-button shiny-button-passive'
        }
    }

    if (activeOtherLink === "ajankohtaista") {
        if (endPoint === activeOtherLink) {
            return buttonProperties[property === 'style' ? 'active' : 'active'][property]
        } else {
            return buttonProperties[property === 'style' ? 'passive' : 'passive'][property]
        }
    }

    if (location) {
        if ((location.pathname === '/' || location.pathname === '/pirtti') && endPoint === 'koti') {
            return buttonProperties[property === 'style' ? 'active' : 'active'][property]
        } else if ((location.pathname?.split('/')[1] === endPoint) || (location.pathname?.split('/pirtti/')[1] === endPoint)) {
            return buttonProperties[property === 'style' ? 'active' : 'active'][property]
        }
    }

    return buttonProperties[property === 'style' ? 'passive' : 'passive'][property]
}

export const handleEndPoint = (endPoint, mobile, portrait, width, show) => {
    const linkButtonColors = {
        koti: "#ff6f3c",
        arvot: "#ff9a76",
        yhdistys: "#b5651d",
        lasten_suusta: "#ffb347",
        hakemukset: "#c85e3c",
        yhteystiedot: "#d99a6c",
        ajankohtaista: "#8b3d2e"
    }

    const border = getButtonStyle(endPoint, 'style', location, ((endPoint === 'ajankohtaista') && show) ? 'ajankohtaista' : null, mobile)

    return {
        backgroundColor: linkButtonColors[endPoint],
        width: width < 1253 ? '10vw' : mobile ? '16vw' : portrait ? '10vw' : '11vw',
        border,
        padding: '2px',
        marginTop: mobile ? '0px' : '10px',
        marginBottom: (mobile || portrait) ? '0px' : '20px',
    }
}

export const getAnimation = () => {
    return Array.from({ length: 15 }).map((_, i) => {
        const top = Math.random() * 100 + "%"
        const left = Math.random() * 100 + "%"
        const delay = Math.random() * 1 + "s"
        const size = Math.random() * 1 + 2 + "px"
        return (
            <span
                key={i}
                className="sparkle"
                style={{
                    top,
                    left,
                    width: size,
                    height: size,
                    animationDelay: delay
                }}
            />
        )
    })
}