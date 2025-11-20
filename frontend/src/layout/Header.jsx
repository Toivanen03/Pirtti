import NavigationBar from "./NavigationBar"
import MobileNavigation from "./Mobile/MobileNavigation"
import { FaSignOutAlt } from 'react-icons/fa'
import { useContext } from "react"
import { AuthContext } from "../contexts/AuthContext"
import useIsMobile from "../hooks/useIsMobile"
import { Row, Col } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const pulse = document.createElement('style')

pulse.innerHTML = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
`
document.head.appendChild(pulse)

const Header = ({ setConfirmTitle, setOnConfirm, portrait, scrolling }) => {
  const { logout, isLoggedIn, currentUser } = useContext(AuthContext)
  const mobile = useIsMobile()
  const navigate = useNavigate()

  const handleLogout = () => {
    setConfirmTitle("Haluatko varmasti kirjautua ulos?")
    setOnConfirm(() => () => {
      logout()
    })
  }

  const formatCounter = (value) => value > 0 ? (
    <span style={{
      display: 'inline-flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'red',
      backgroundColor: 'yellow',
      border: '1px solid red',
      borderRadius: '50%',
      width: '24px',
      height: '24px',
      fontSize: '18px',
      position: 'relative',
      padding: '10px',
      animation: 'pulse 1s infinite',
      marginLeft: '6px'
    }}>{value}</span>
  ) : null

  return (
    <>
      {!mobile ? (
        <header>
          <div className="header-content">
              <Row className="justify-content-center d-flex align-items-center">
                <Col className={isLoggedIn ? "col-7 text-end" : "col-12 text-center"}>
                  <h1>Päiväkoti Pirtti</h1>
                </Col>
                  {isLoggedIn && 
                    <Col className={portrait ? "col-4" : "col-2 offset-2"}>
                      <small className="me-3" style={{ color: 'black', cursor: 'pointer' }} onClick={() => navigate('/admin')}>{currentUser.email}</small>
                        <FaSignOutAlt size={50} style={{border: '1px solid white', cursor: 'pointer', padding: '5px', borderRadius: '10px', color: 'black'}} onClick={() => handleLogout()} /><br />
                    </Col>}
              </Row>  
            <NavigationBar mobile={mobile} setConfirmTitle={setConfirmTitle} setOnConfirm={setOnConfirm} formatCounter={formatCounter} portrait={portrait} />
          </div>
        </header>
      ) : (
        !scrolling &&
        <header><MobileNavigation formatCounter={formatCounter} scrolling={scrolling} /></header>
      )}
    </>
  )
}

export default Header