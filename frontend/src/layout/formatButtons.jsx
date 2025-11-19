import './styles/shiny-button.scss'

export const getButtonStyle = (endPoint, property, location, activeOtherLink, mobile) => {

    const buttonProperties = {
        active: {
            style: '1px solid lightblue',
            class: 'active-button shadow h-button shiny-button'
        },
        passive: {
            style: '1px solid pink',
            class: mobile ? 'shadow h-button' : 'shadow h-button shiny-button-passive'
        }
    }

    if (activeOtherLink) {
        if (endPoint === activeOtherLink) {
            return buttonProperties[property === 'style' ? 'active' : 'active'][property]
        } else {
            return buttonProperties[property === 'style' ? 'passive' : 'passive'][property]
        }
    }

    if (location) {
        if (location.pathname === '/' && endPoint === 'koti') {
            return buttonProperties[property === 'style' ? 'active' : 'active'][property]
        } else if (location.pathname?.split('/')[1] === endPoint) {
            return buttonProperties[property === 'style' ? 'active' : 'active'][property]
        }
    }

    return buttonProperties[property === 'style' ? 'passive' : 'passive'][property]
}

export const handleEndPoint = (endPoint, mobile, portrait) => {
    const linkButtonColors = {
        koti: "#66cccc",
        arvot: "#ff99cc",
        yhdistys: "#b399ff",
        lasten_suusta: "#ff9933",
        hakemukset: "#99cc99",
        yhteystiedot: "#99ccff",
        ajankohtaista: "#ff6666"
    }

    const border = getButtonStyle(endPoint, 'style')
    
    return {
        backgroundColor: linkButtonColors[endPoint],
        width: mobile ? '16vw' : portrait ? '10vw' : '11vw',
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