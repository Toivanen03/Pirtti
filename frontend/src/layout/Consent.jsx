import { useState, useEffect } from "react"
import { Button, Row, Col } from "react-bootstrap"

export const COOKIE_KEY = "cookiesConsent"

const Consent = ({ setCookieChoiceMade, setConsent, mobile, portrait }) => {    // Lisätty valmius evästeilmoituksen näyttämiseksi tulevaisuudessa myös mobiilissa.
  const [showBanner, setShowBanner] = useState(false)                           // Nyt evästeilmoitusta ei tarvita mobiilissa, sillä mobiililaitteilla
  const buttonStyle = { width: mobile ? '30vw' : portrait ? '8vw' : '6vw'}      // ei näytetä Facebookin sivupalkkia. Asettelu on tehty valmiiksi.
                                                
  useEffect(() => {                                                             // Evästekyselyn voi ottaa käyttöön poistamalla mobile-rajoitteet App.jsx:ssä
    const stored = JSON.parse(localStorage.getItem(COOKIE_KEY))
    const maxAge = 1000 * 60 * 60 * 24 * 30
    if (!stored || (Date.now() - stored.date) > maxAge) {
      setShowBanner(true)
      setCookieChoiceMade(false)
    } else {
      setShowBanner(false)
      setCookieChoiceMade(true)
    }
  }, [])

  useEffect(() => {
      const stored = JSON.parse(localStorage.getItem(COOKIE_KEY))
      if (!stored || !stored.consent) {
          setShowBanner(true)
      }

  }, [])

  const handleAccept = () => {
      localStorage.setItem(
          COOKIE_KEY,
          JSON.stringify({ consent: true, date: Date.now() })
      )
      setConsent(true)
      setShowBanner(false)
      setCookieChoiceMade(true)
  }

  const handleReject = () => {
      localStorage.setItem(
          COOKIE_KEY,
          JSON.stringify({ consent: false, date: Date.now() })
      )
      setConsent(false)
      setShowBanner(false)
      setCookieChoiceMade(true)
  }

  return (
    <>
      {showBanner && (
        <div
          className="cookie-banner"
        >
          <Row className="d-flex align-items-center content-text" style={{ width: '100vw' }}>
            {!portrait ? (
              <Col className={mobile ? "col-8 me-4" : "col-6"}>
                <span className={mobile ? '' : 'ms-5'}>Tämä sivusto käyttää evästeitä kolmannen osapuolen sisällön hallintaan.</span>
              </Col>
            ) : (
            <Col className="col-7">
              <span className='ms-2'>Tämä sivusto käyttää evästeitä kolmannen osapuolen sisällön hallintaan.</span>
            </Col>
            )}

            {!mobile ? (
              <>
                <Col className="col-1">
                  <Button onClick={handleAccept} style={ buttonStyle }>
                    Hyväksy
                  </Button>
                </Col>

                <Col className="col-1">
                  <Button variant="secondary" onClick={handleReject} style={ buttonStyle }>
                    Hylkää
                  </Button>
                </Col>
              </>
            ) : (
              <Col className="col-2 d-flex flex-column justify-content-center align-items-center gap-2">
                  <Button onClick={handleAccept} style={ buttonStyle }>
                    Hyväksy
                  </Button>

                  <Button variant="secondary" onClick={handleReject} style={ buttonStyle }>
                    Hylkää
                  </Button>
              </Col>
            )}

            <Col className={mobile ? 'col-12 text-center mt-3' : 'text-center'}>
              <a 
                href="https://www.facebook.com/policies/cookies/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Lisätietoja evästeistä
              </a>
            </Col>
          </Row>
        </div>
      )}
    </>
  )
}

export default Consent
