import { useEffect, useState } from 'react'
import InstaLogo from '../assets/insta_with_white.png' // insta_transparent.png
import FbLogo from '../assets/fb_with_white.png'       // fb_transparent.png
import PPmodal from '../modals/PPmodal'
import { FaArrowUp } from 'react-icons/fa'

const Footer = ({ mobile, portrait }) => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const ToTop = () => {
    return (
      <FaArrowUp onClick={scrollToTop} 
        style={{ 
          border: '1px solid black',
          borderRadius: '50%',
          padding: '10px',
          fontSize: '60px',
          position: 'fixed',
          bottom: 40,
          right: mobile ? '40%' : 40,
          cursor: 'pointer',
          zIndex: '999',
          background: 'linear-gradient(180deg, #9b5300ff, #3a1a00ff)',
          color: 'white'
        }}/>
    )
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true)
      } else {
        setShowScrollTop(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getLogoStyle = () => {
    const instaLogoSize = !mobile ? '70px' : '50px'

    return mobile ? {
       width: instaLogoSize, height: instaLogoSize, border: '1px solid brown', borderRadius: '14px'
    } : { width: instaLogoSize, height: instaLogoSize, border: '1px solid brown', borderRadius: '20px' }
  }

  return (
    
    <>
      {!mobile ? ( 
        <footer className='d-flex align-items-center justify-content-center content-text'>
          <div className='col-5 d-flex flex-column justify-content-center align-items-center'>
              <h5 className='ms-3'>© Päiväkotiyhdistys Pirtti ry {`${new Date().getFullYear()}`}</h5>
              <span className='ms-3' 
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    onClick={() => setShowModal(true)}
              >
                Tietosuojaseloste
              </span>
          </div>
        
          <div className='col-1 d-flex justify-content-start'>
            {showScrollTop && (
              <ToTop />
            )}
          </div>

          <div className="col-6 d-flex flex-row">
            <a
              href="https://www.facebook.com/paivakotiyhdistyspirttiry/"
              target="_blank"
              className="text-decoration-none me-5"
            >
              <img 
                src={FbLogo}
                style={{...getLogoStyle()}}
                className='me-2'
              />
              {!portrait && <span className="facebook mt-1">Pirtin facebook</span>}
            </a>

            <a
              href="https://www.instagram.com/paivakotipirtti/#"
              target="_blank"
              className="text-decoration-none"
            >
              <img 
                src={InstaLogo}
                style={{...getLogoStyle()}}
                className='me-2'
              />
              {!portrait && <span className="instagram mt-2">Pirtin Instagram</span>}
            </a>
          </div>
        </footer>
      ) : (
        <footer className='d-flex align-items-center justify-content-center content-text'>
          <div className='col-5 d-flex flex-column justify-content-start'>
              <small>© Päiväkotiyhdistys Pirtti ry</small>
              <small style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    onClick={() => setShowModal(true)}
              >
                Tietosuojaseloste
              </small>
          </div>

          <div className='col-1 d-flex justify-content-start'>
            {showScrollTop && (
              <ToTop />
            )}
          </div>

          <div className='col-5 offset-2 d-flex flex-column align-items-end'>
            <div className="row">
              <div className="d-flex gap-2 flex-wrap justify-content-end">
                <a
                  href="https://www.facebook.com/paivakotiyhdistyspirttiry/"
                  target="_blank"
                  className="text-decoration-none"
                >
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <img 
                      src={FbLogo}
                      style={{...getLogoStyle()}}
                    />
                  </div>
                </a>

                <a
                  href="https://www.instagram.com/paivakotipirtti/#"
                  target="_blank"
                  className="text-decoration-none"
                >
                  <div className="d-flex flex-column justify-content-center align-items-center">
                    <img 
                      src={InstaLogo}
                      style={{...getLogoStyle()}}
                    />
                  </div>
                </a>
              </div>

              <div className="col-1" />
            </div>
          </div>
        </footer>
      )}
      <PPmodal showModal={showModal} setShowModal={setShowModal} mobile={mobile} portrait={portrait} />
    </>
  )
}

export default Footer