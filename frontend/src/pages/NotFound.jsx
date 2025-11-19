import FourZeroFour from '../assets/404.png'
import useWindowWidth from '../hooks/useWindowWidth'
import useWindowHeight from '../hooks/useWindowHeight'
import { Button, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const NotFound = ({ mobile }) => {
    const width = useWindowWidth()
    const height = useWindowHeight()

    const navigate = useNavigate()

    const baseStyle = {                                         // Desktop
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-45%, -40%) scale(0.8)',
        width: width,
        height: height,
        objectFit: 'contain',
        zIndex: -1
    }

    const horizontalStyle = {                                   // Puhelin, pystynäkymä
        ...baseStyle,
        transform: 'translate(-36%, -34%) scale(2)',
    }

    const landscapeStyle = {                                    // Puhelin, vaakanäkymä
        ...baseStyle,
        transform: 'translate(-47.2%, -44%) scale(0.6)',
    }

    const getBackButtonPosition = () => {
        if (mobile && (width >= 576)) {                         // Puhelin, vaakanäkymä
            return { width: width, height: height, marginTop: '25vh' }
        } else if (mobile) {                                    // Puhelin, pystynäkymä
            return { width: width, height: height, marginTop: '10vh' }
        } else {                                                // Desktop
            return { width: width, height: height, marginTop: '25vh' }             
        }
    }

  return (
    <div className='ms-3' style={{ overflow: 'hidden', }}>
        <img
            src={FourZeroFour}
            alt="404-virhe"
            style={(mobile && (width > 576)) ? landscapeStyle : !mobile ? baseStyle : horizontalStyle}
        />
        <Row className='d-flex justify-content-center' style={getBackButtonPosition()}>
            <Col className='col-3 text-center'>
                <Button variant='info' className='shadow' onClick={() => navigate('/')} style={{zIndex: '9999', border: '1px solid black'}}>Etusivulle</Button>
            </Col>
        </Row>
    </div>
  )
}

export default NotFound