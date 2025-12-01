import { Row, Col, Container, Button } from 'react-bootstrap'
import pollo from '../assets/images/pollo.jpg'
import vesileikkeja from '../assets/images/vesileikkeja.jpg'
import hiekkalaatikko from '../assets/images/hiekkalaatikko.jpg'
import ruska from '../assets/ruska.png'
import { GET_QUOTES } from '../queries/queries'
import { useQuery } from '@apollo/client/react'
import { useState, useEffect } from 'react'
import ImageCarousel from '../layout/ImageCarousel'

const Quotes = ({ mobile, portrait }) => {
  const { data, loading } = useQuery(GET_QUOTES)
  const [description, setDescription] = useState("")
  const [headline_1, setHeadline_1] = useState("")
  const [headline_2, setHeadline_2] = useState("")
  const [headline_3, setHeadline_3] = useState("")
  const [quotes_1, setQuotes_1] = useState([])
  const [quotes_2, setQuotes_2] = useState([])
  const [quotes_3, setQuotes_3] = useState([])
  const [currentPage_1, setCurrentPage_1] = useState(0)
  const [currentPage_2, setCurrentPage_2] = useState(0)
  const [currentPage_3, setCurrentPage_3] = useState(0)
  const [header, setHeader] = useState("")

  useEffect(() => {
    if (!loading && data?.quotes) {
      setDescription(data.quotes.quotes_kuvaus)
      setHeadline_1(data.quotes.quotes_lohkot.lohko_1?.quotes_otsikko)
      setHeadline_2(data.quotes.quotes_lohkot.lohko_2?.quotes_otsikko)
      setHeadline_3(data.quotes.quotes_lohkot.lohko_3?.quotes_otsikko)
      setQuotes_1(data.quotes.quotes_lohkot.lohko_1?.quotes)
      setQuotes_2(data.quotes.quotes_lohkot.lohko_2?.quotes)
      setQuotes_3(data.quotes.quotes_lohkot.lohko_3?.quotes)
    }
  }, [data, loading])

  useEffect(() => {
    const headerText = "Lasten suusta kuultua"
    let i = 0
    const interval = setInterval(() => {
      setHeader(headerText.slice(0, i + 1))
      i++

      if (i >= headerText.length) {
          clearInterval(interval)
      }
    }, 150)
    return () => {
      clearInterval(interval)
    }
  }, [])

  const confirmHeight = (bookNumber, index) => {
    const book = document.querySelector(`#book${bookNumber}`)
    const quotesElements = book?.querySelectorAll('.quote')
    const imageHeight = mobile ? 170 : 270
    if (!book || !quotesElements || !quotesElements[index]) return false

    return quotesElements[index].offsetHeight + imageHeight <= book.offsetHeight
  }

  const getFontSize = (bookNumber, index) => {
    const book = document.querySelector(`#book${bookNumber}`)
    const quotesElements = book?.querySelectorAll('.quote')
    if (!book || !quotesElements || !quotesElements[index]) return '1.6rem'

    const quoteEl = quotesElements[index]

    const textLength = quoteEl.textContent.length
    if (textLength > 250) return '1.2rem'
    if (textLength > 150) return '1.3rem'
    if (textLength > 80)  return '1.5rem'
    return '1.6rem'
  }

  const flipPage = (book) => {
    switch(book){
      case 1:
        if (currentPage_1 < quotes_1.length + 1) {
          setCurrentPage_1(prev => prev + 1)
          if (currentPage_1 === quotes_1.length) setCurrentPage_1(0)
        } else {
          setCurrentPage_1(0)
        }
        break

      case 2:
        if (currentPage_2 < quotes_2.length + 1) {
          setCurrentPage_2(prev => prev + 1)
          if (currentPage_2 === quotes_2.length) setCurrentPage_2(0)
        } else {
          setCurrentPage_2(0)
        }
        break
      
      case 3:
        if (currentPage_3 < quotes_3.length + 1) {
          setCurrentPage_3(prev => prev + 1)
          if (currentPage_3 === quotes_3.length) setCurrentPage_3(0)
        } else {
          setCurrentPage_3(0)
        }
        break

      default: return
    }
  }

  return (
    <>
      {!mobile ? (
        <Container fluid className="text-center quotes mb-5 p-0">
          <div className='quotes-banner'>
            <h2 className='quotes-headline'>
              {header}
            </h2>
            <strong className="text-center quotes-description">
              {description}
            </strong>
          </div>

{/* KIRJA 1 */}
          <Row className='d-flex align-items-center justify-content-center mt-5 tilt-left'>
            <Col
              className={portrait ? 'col-5 mb-5' : 'col-auto mb-5'}
              style={{
                transition: 'transform 0.5s ease',
                transform: !portrait && currentPage_1 > 0 ? 'translateX(33%)' : 'translateX(0%)',
              }}
            >
              <div className='book' id='book1' style={{ position: 'relative' }}>
                <div className={`page ${currentPage_1 > 0 ? "flipped" : ""}`}>
                  <div className="front front-1">
                    <h3 className="quotes-header">{headline_1}</h3>
                      <img src={vesileikkeja} alt="Vesileikkejä" className="quotes-image border border-2 light-border" />
                  </div>
                <div className="back back-1"></div>
              </div>

              {quotes_1.map((quote, index) => (
                <div className={`page ${currentPage_1 > index + 1 ? "flipped" : ""}`} key={index}>
                  <div className="front front-1 container d-flex flex-column h-100 justify-content-between">
                    <div className='d-flex justify-content-center'>
                      <h5 className='quotes-header quote text-start'>{quote.text}</h5>
                    </div>
                      {confirmHeight(1, index) && (
                        <div className='d-flex justify-content-center quote-carousel'>
                          <ImageCarousel home={false} bookNumber={1} />
                        </div>
                      )}
                      </div>
                    <div className='back back-1' />
                  </div>
                ))}

                <Button
                  className='book-button bb1'
                  onClick={() => flipPage(1)}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    zIndex: '9999'
                  }}
                >
                  <span className='shine' />
                  <span>{currentPage_1 < quotes_1.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
                </Button>

              </div>
            </Col>
          </Row>

{/* KIRJA 2 */}
          <Row className='d-flex align-items-center justify-content-center mt-4 tilt-right mb-5'>
            <Col
              className={portrait ? 'col-5 mb-5' : 'col-auto mb-5'}
              style={{
                transition: 'transform 0.5s ease',
                transform: !portrait && currentPage_2 > 0 ? 'translateX(33%)' : 'translateX(0%)',
              }}
            >
              <div className='book' id='book2' style={{ position: 'relative' }}>
                <div className={`page ${currentPage_2 > 0 ? "flipped" : ""}`}>
                  <div className="front front-2">
                    <h3 className="quotes-header">{headline_2}</h3>
                      <img src={hiekkalaatikko} alt="Leluja hiekkalaatikolla" className="quotes-image border border-2 light-border" />
                  </div>
                <div className="back back-2"></div>
              </div>

              {quotes_2.map((quote, index) => (
                <div className={`page ${currentPage_2 > index + 1 ? "flipped" : ""}`} key={index}>
                  <div className="front front-2 container d-flex flex-column h-100 justify-content-between">
                    <div className='d-flex justify-content-center'>
                      <h5 className='quotes-header quote text-start'>{quote.text}</h5>
                    </div>
                      {confirmHeight(2, index) && (
                        <div className='d-flex justify-content-center quote-carousel'>
                          <ImageCarousel home={false} bookNumber={2} />
                          </div>
                        )}
                      </div>
                    <div className='back back-2' />
                  </div>
                ))}

                <Button
                  className='book-button bb2'
                  onClick={() => flipPage(2)}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    zIndex: '9999'
                  }}
                >
                  <span className='shine' />
                  <span>{currentPage_2 < quotes_2.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
                </Button>

              </div>
            </Col>
          </Row>

{/* KIRJA 3 */}
          <Row className='d-flex align-items-center justify-content-center mt-4 mb-5 tilt-left'>
            <Col
              className={portrait ? 'col-5' : 'col-auto'}
              style={{
                transition: 'transform 0.5s ease',
                transform: !portrait && currentPage_3 > 0 ? 'translateX(33%)' : 'translateX(0%)',
              }}
            >
              <div className='book' id='book3' style={{ position: 'relative' }}>
                <div className={`page ${currentPage_3 > 0 ? "flipped" : ""}`}>
                  <div className="front front-3">
                    <h3 className="quotes-header">{headline_3}</h3>
                    <img src={pollo} alt="Lasten askartelema pöllö" className="quotes-image border border-2 light-border" />
                  </div>
                <div className="back back-3"></div>
              </div>

              {quotes_3.map((quote, index) => (
                <div className={`page ${currentPage_3 > index + 1 ? "flipped" : ""}`} key={index}>
                  <div className="front front-3 container d-flex flex-column h-100 justify-content-between">
                    <div className='d-flex justify-content-center'>
                      <h5 className='quotes-header quote text-start'>{quote.text}</h5>
                    </div>
                      {confirmHeight(3, index) && (
                        <div className='d-flex justify-content-center quote-carousel'>
                          <ImageCarousel home={false} bookNumber={3} />
                        </div>
                      )}
                      </div>
                    <div className='back back-3' />
                  </div>
                ))}

                <Button
                  className='book-button bb3'
                  onClick={() => flipPage(3)}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    zIndex: '9999'
                  }}
                >
                  <span className='shine' />
                  <span>{currentPage_3 < quotes_3.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
                </Button>

              </div>
            </Col>
          </Row>
        </Container>
      ) : (
        <Container fluid className="text-center quotes mb-5 p-0">
          <div className='quotes-banner'>
            <h2 className='quotes-headline'>
              {header}
            </h2>
            <strong className="text-center quotes-description"
              style={{
                  position: 'absolute',
                  top: '60%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  color: 'white',
                }}
              >
              {description}
            </strong>
          </div>

{/* KIRJA 1 */}
          <Row className='d-flex justify-content-center align-items-center offset-2 mt-5 tilt-left'>
            <div className='book' id='book1'>
              <div className={`page ${currentPage_1 > 0 ? "flipped" : ""}`}>
                <div className="front front-1">
                  <h3 className="quotes-header" style={{ fontSize: headline_1.length > 80 ? '1.3rem' : headline_1.length > 60 ? '1.4rem' : '1.6rem' }}>{headline_1}</h3>
                  <img src={vesileikkeja} alt="Vesileikkejä" className="quotes-image border border-2 light-border" />
                </div>
                <div className="back back-1"></div>
              </div>

              {quotes_1.map((quote, index) =>
                <div className={`page ${currentPage_1 > index + 1 ? "flipped" : ""}`} key={index}>
                  <div className="front front-1 container d-flex flex-column h-100 justify-content-between p-2">
                    <div className='d-flex justify-content-center'>
                      <h5 className='quotes-header quote text-start'
                        style={{ fontSize: getFontSize(1, index) }}>
                        {quote.text}
                      </h5>
                    </div>
                      {confirmHeight(1, index) &&
                        <div className='d-flex justify-content-center quote-carousel'>
                          <ImageCarousel home={false} bookNumber={1} />
                        </div>
                      }
                  </div>
                  <div className='back back-1' />
                </div>
              )}
            </div>
          </Row>

          <Row className='d-flex align-items-center justify-content-center mt-5'>
            <Button className='book-button bb1 mb-5' onClick={() => flipPage(1)}>
              <span className='shine' />
              <span>Käännä sivua</span>
            </Button>
          </Row>


{/* KIRJA 2 */}
          <Row className='d-flex justify-content-center align-items-center offset-2 mt-1 tilt-right'>
            <div className='book' id='book2'>
              <div className={`page ${currentPage_2 > 0 ? "flipped" : ""}`}>
                <div className="front front-2">
                  <h3 className="quotes-header" style={{ fontSize: headline_2.length > 80 ? '1.3rem' : headline_2.length > 60 ? '1.4rem' : '1.6rem' }}>{headline_2}</h3>
                  <img src={hiekkalaatikko} alt="Leluja hiekkalaatikolla" className="quotes-image border border-2 light-border" />
                </div>
                <div className="back back-2"></div>
              </div>

              {quotes_2.map((quote, index) =>
                <div className={`page ${currentPage_2 > index + 1 ? "flipped" : ""}`} key={index}>
                  <div className="front front-2 container d-flex flex-column h-100 justify-content-between p-2">
                    <div className='d-flex justify-content-center'>
                      <h5 className='quotes-header quote text-start'
                        style={{ fontSize: getFontSize(2, index) }}>
                        {quote.text}
                      </h5>
                    </div>
                      {confirmHeight(2, index) &&
                        <div className='d-flex justify-content-center quote-carousel'>
                          <ImageCarousel home={false} bookNumber={2} />
                        </div>
                      }
                  </div>
                  <div className='back back-2' />
                </div>
              )}
            </div>
          </Row>

          <Row className='d-flex align-items-center justify-content-center mt-5'>
            <Button className='book-button bb2 mb-5' onClick={() => flipPage(2)}>
              <span className='shine' />
              <span>Käännä sivua</span>
            </Button>
          </Row>

{/* KIRJA 3 */}
          <Row className='d-flex justify-content-center align-items-center offset-2 mt-1 tilt-left'>
            <div className='book' id='book3'>
              <div className={`page ${currentPage_3 > 0 ? "flipped" : ""}`}>
                <div className="front front-3">
                  <h3 className="quotes-header" style={{ fontSize: headline_3.length > 80 ? '1.3rem' : headline_3.length > 60 ? '1.4rem' : '1.6rem' }}>{headline_3}</h3>
                  <img src={pollo} alt="Lapsen askartelema pöllö" className="quotes-image border border-2 light-border" />
                </div>
                <div className="back back-3"></div>
              </div>

              {quotes_3.map((quote, index) =>
                <div className={`page ${currentPage_3 > index + 1 ? "flipped" : ""}`} key={index}>
                  <div className="front front-3 container d-flex flex-column h-100 justify-content-between p-2">
                    <div className='d-flex justify-content-center'>
                      <h5 className='quotes-header quote text-start'
                        style={{ fontSize: getFontSize(3, index) }}>
                        {quote.text}
                      </h5>
                    </div>
                      {confirmHeight(3, index) &&
                        <div className='d-flex justify-content-center quote-carousel'>
                          <ImageCarousel home={false} bookNumber={3} />
                        </div>
                      }
                  </div>
                  <div className='back back-3' />
                </div>
              )}
            </div>
          </Row>

          <Row className='d-flex align-items-center justify-content-center mt-5'>
            <Button className='book-button bb3 mb-5' onClick={() => flipPage(3)}>
              <span className='shine' />
              <span>Käännä sivua</span>
            </Button>
          </Row>
        </Container>
      )}
    </>
  )
}

export default Quotes