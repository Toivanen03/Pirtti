import { Navbar, Nav, Container, Button } from "react-bootstrap"
import { handleEndPoint, getButtonStyle } from "../formatButtons"
import { FaBars } from 'react-icons/fa'
import "./mobileNavigation.scss"
import { useLocation, Link } from "react-router-dom"
import useIsMobile from "../../hooks/useIsMobile"
import { useState, useEffect, useRef } from "react"
import NewTopics from "../NewTopics"

const MobileNavigation = ({ setConfirmTitle, setOnConfirm, formatCounter }) => {
    const [expanded, setExpanded] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)
    const [show, setShow] = useState(false)
    const location = useLocation()
    const mobile = useIsMobile()
    const buttonFontSize = "24px"
    const navRef = useRef(null)

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (navRef.current && !navRef.current.contains(event.target)) {
                setExpanded(false)
            }
        }
        if (expanded) {
            document.addEventListener("click", handleClickOutside)
        }
        return () => {
            document.removeEventListener("click", handleClickOutside)
        }
    }, [expanded])

    const navItems = [
        { to: "/", text: "Etusivu", key: "koti" },
        { to: "/arvot", text: "Arvot", key: "arvot" },
        { to: "/yhdistys", text: "Yhdistys", key: "yhdistys" },
        { to: "/yhteystiedot", text: "Yhteystiedot", key: "yhteystiedot" },
        { to: "/hakemukset", text: "Hakemukset", key: "hakemukset" },
        { to: "/lasten_suusta", text: "Lasten suusta", key: "lasten_suusta" },
    ]

    return (
        <>
            <Navbar
                expand={false}
                expanded={expanded}
                className="mobile-navbar"
                ref={navRef}
            >
                <Container fluid>
                    <div className="mobile-nav-row d-flex align-items-center py-2 gap-5">
                        <h1 className="align-self-end mb-0">Päiväkoti Pirtti</h1>
                        <Navbar.Toggle
                            aria-controls="main-nav"
                            onClick={() => setExpanded(prev => !prev)}
                            className="p-1 position-relative d-flex align-items-center justify-content-center"
                        >
                            <FaBars size={'30px'} />
                            {!expanded && unreadCount > 0 && (
                                <span className="counter-pulse">
                                    {formatCounter(unreadCount)}
                                </span>
                            )}
                        </Navbar.Toggle>
                    </div>

                    <Navbar.Collapse
                        id="main-nav"
                        className={`mobile-collapse ${expanded ? "show" : ""}`}
                    >
                        <Nav className="mobile-nav flex-column">
                            {navItems.map((item) => (
                                <Nav.Link
                                    as={Link}
                                    to={item.to}
                                    key={item.key}
                                    className="d-flex justify-content-center"
                                    onClick={() => setExpanded(false)}
                                >
                                    <Button
                                        style={{
                                            ...handleEndPoint(item.key, mobile, location),
                                            fontSize: buttonFontSize,
                                            width: "70%",
                                        }}
                                        className={getButtonStyle(item.key, "class", location, show, mobile)}
                                    >
                                        <div className="border-mask">
                                            <div className="border-glow"></div>
                                        </div>
                                        {item.text}
                                        {getButtonStyle(item.key, 'class', location, show ? 'ajankohtaista' : null, mobile).includes('active-button')}
                                    </Button>
                                </Nav.Link>
                            ))}

                            <div className="d-flex justify-content-center mt-2">
                                <Button
                                    onClick={() => {
                                        setExpanded(false)
                                        setShow(true)
                                        setUnreadCount(0)
                                    }}
                                    style={{
                                        ...handleEndPoint("ajankohtaista", mobile),
                                        fontSize: buttonFontSize,
                                        width: "70%",
                                    }}
                                    className={getButtonStyle("ajankohtaista", "class", "/ajankohtaista", show, mobile)}
                                >
                                    <div className="border-mask">
                                        <div className="border-glow"></div>
                                    </div>
                                    <span>Ajankohtaista {formatCounter(unreadCount)}</span>
                                </Button>
                            </div>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <NewTopics
                mobile={mobile}
                show={show}
                setShow={setShow}
                setConfirmTitle={setConfirmTitle}
                setOnConfirm={setOnConfirm}
                setUnreadCount={setUnreadCount}
            />
        </>
    )
}

export default MobileNavigation