import { Link, useLocation } from "react-router-dom"
import Button from "react-bootstrap/Button"
import { handleEndPoint, getAnimation, getButtonStyle } from "./formatButtons"
import NewTopics from "./NewTopics"
import { useState } from "react"

const NavigationBar = ({ mobile, setConfirmTitle, setOnConfirm, formatCounter, portrait }) => {
    const [show, setShow] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    const location = useLocation()

    const buttonFontSize = portrait ? '20px' : '28px'

    return (
        <>
            {(!mobile || !portrait) &&
                <nav className="d-flex gap-5 flex-wrap justify-content-center">
                    <Link to="/" className="text-decoration-none header-link">
                        <Button
                            style={{ ...handleEndPoint('koti', mobile, portrait), fontSize: buttonFontSize }}
                            className={getButtonStyle('koti', 'class', location, show ? 'ajankohtaista' : null)}
                        >
                            <div className="border-mask">
                                <div className="border-glow"></div>
                            </div>
                            Etusivu
                            {getButtonStyle('koti', 'class', location, show ? 'ajankohtaista' : null).includes('active-button') && getAnimation()}
                        </Button>
                    </Link>

                    <Link to="/arvot" className="text-decoration-none header-link">
                        <Button
                            style={{ ...handleEndPoint('arvot', mobile, portrait), fontSize: buttonFontSize }}
                            className={getButtonStyle('arvot', 'class', location, show ? 'ajankohtaista' : null)}
                        >
                            <div className="border-mask">
                                <div className="border-glow"></div>
                            </div>
                            Arvot
                            {getButtonStyle('arvot', 'class', location, show ? 'ajankohtaista' : null).includes('active-button') && getAnimation()}
                        </Button>
                    </Link>

                    <Link to="/yhdistys" className="text-decoration-none header-link">
                        <Button
                            style={{ ...handleEndPoint('yhdistys', mobile, portrait), fontSize: buttonFontSize }}
                            className={getButtonStyle('yhdistys', 'class', location, show ? 'ajankohtaista' : null)}
                        >
                            <div className="border-mask">
                                <div className="border-glow"></div>
                            </div>
                            Yhdistys
                            {getButtonStyle('yhdistys', 'class', location, show ? 'ajankohtaista' : null).includes('active-button') && getAnimation()}
                        </Button>
                    </Link>

                    <Link to="/yhteystiedot" className="text-decoration-none header-link">
                        <Button
                            style={{ ...handleEndPoint('yhteystiedot', mobile, portrait), fontSize: buttonFontSize }}
                            className={getButtonStyle('yhteystiedot', 'class', location, show ? 'ajankohtaista' : null)}
                        >
                            <div className="border-mask">
                                <div className="border-glow"></div>
                            </div>
                            Yhteystiedot
                            {getButtonStyle('yhteystiedot', 'class', location, show ? 'ajankohtaista' : null).includes('active-button') && getAnimation()}
                        </Button>
                    </Link>

                    <Link to="/hakemukset" className="text-decoration-none header-link">
                        <Button
                            style={{ ...handleEndPoint('hakemukset', mobile, portrait), fontSize: buttonFontSize }}
                            className={getButtonStyle('hakemukset', 'class', location, show ? 'ajankohtaista' : null)}
                        >
                            <div className="border-mask">
                                <div className="border-glow"></div>
                            </div>
                            Hakemukset
                            {getButtonStyle('hakemukset', 'class', location, show ? 'ajankohtaista' : null).includes('active-button') && getAnimation()}
                        </Button>
                    </Link>

                    <Link to="/lasten_suusta" className="text-decoration-none header-link">
                        <Button
                            style={{ ...handleEndPoint('lasten_suusta', mobile, portrait), fontSize: buttonFontSize }}
                            className={getButtonStyle('lasten_suusta', 'class', location, show ? 'ajankohtaista' : null)}
                        >
                            <div className="border-mask">
                                <div className="border-glow"></div>
                            </div>
                            Lasten suusta
                            {getButtonStyle('lasten_suusta', 'class', location, show ? 'ajankohtaista' : null).includes('active-button') && getAnimation()}
                        </Button>
                    </Link>

                    <div className="text-decoration-none header-link">
                        <Button
                            onClick={() => {
                                setShow(true)
                                setUnreadCount(0)
                            }}
                        style={{ ...handleEndPoint('ajankohtaista', mobile, portrait), fontSize: buttonFontSize }}
                        className={getButtonStyle('ajankohtaista', 'class', location, show ? 'ajankohtaista' : null)}
                    >
                            <div className="border-mask">
                                <div className="border-glow"></div>
                            </div>
                        <span className='align-items-center justify-content-center d-flex ms-1'>Ajankohtaista{formatCounter(unreadCount)}</span>
                        {getButtonStyle('ajankohtaista', 'class', location, show ? 'ajankohtaista' : null).includes('active-button') && getAnimation()}
                    </Button>
                    </div>

                    <NewTopics 
                        mobile={mobile} 
                        show={show} 
                        setShow={setShow} 
                        setConfirmTitle={setConfirmTitle} 
                        setOnConfirm={setOnConfirm} 
                        setUnreadCount={setUnreadCount}
                        portrait={portrait} 
                    />
                </nav>
            }
        </>
    )
}

export default NavigationBar
