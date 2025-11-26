import { useEffect, useState } from 'react'
import InstaLogo from '../assets/insta_with_white.png' // insta_transparent.png
import FbLogo from '../assets/fb_with_white.png'       // fb_transparent.png
import PPmodal from '../modals/PPmodal'

const Footer = ({ mobile, scrolling, portrait }) => {
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const instaLogoSize = !mobile ? '50px' : '40px'

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
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

  return (
    
    <>
      {!mobile ? ( 
        <footer className='d-flex align-items-center justify-content-center content-text'>
          <div className='col-4 d-flex flex-column justify-content-start'>
              <span className='ms-3'>© Päiväkotiyhdistys Pirtti ry {`${new Date().getFullYear()}`}</span>
              <span className='ms-3' 
                    style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                    onClick={() => setShowModal(true)}
              >
                Tietosuojaseloste
              </span>
          </div>
        
          <div className='col-3 d-flex justify-content-start'>
            {showScrollTop && (
              <button className='btn btn-primary ms-5' onClick={scrollToTop}>Sivun alkuun ↑</button>
            )}
          </div>

          <div className="col d-flex flex-row offset-1">
            <a
              href="https://www.facebook.com/paivakotiyhdistyspirttiry/"
              target="_blank"
              className="text-decoration-none me-5"
            >
              <img 
                src={FbLogo}
                style={{ width: instaLogoSize, height: instaLogoSize }}
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
                style={{ width: instaLogoSize, height: instaLogoSize }}
                className='me-2'
              />
              {!portrait && <span className="instagram mt-2">Pirtin Instagram</span>}
            </a>
          </div>
        </footer>
      ) : (
        <>
          {!scrolling &&
            <footer className='d-flex align-items-center justify-content-center content-text'>
              <div className='col-7 d-flex flex-column justify-content-start'>
                  <small>© Päiväkotiyhdistys Pirtti ry</small>
                  <small style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                        onClick={() => setShowModal(true)}
                  >
                    Tietosuojaseloste
                  </small>
              </div>

              <div className='col-5 d-flex flex-column align-items-end'>
                <div className="row">
                  <div className="d-flex gap-4 flex-wrap justify-content-end">
                    <a
                      href="https://www.facebook.com/paivakotiyhdistyspirttiry/"
                      target="_blank"
                      className="text-decoration-none"
                    >
                      <div className="d-flex flex-column justify-content-center align-items-center">
                        <img 
                          src={FbLogo}
                          style={{ width: instaLogoSize, height: instaLogoSize }}
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
                          style={{ width: instaLogoSize, height: instaLogoSize }}
                        />
                      </div>
                    </a>
                  </div>

                  <div className="col-1" />
                </div>
              </div>
            </footer>
          }
        </>
      )}
      <PPmodal showModal={showModal} setShowModal={setShowModal} mobile={mobile} portrait={portrait} />
    </>
  )
}

export default Footer