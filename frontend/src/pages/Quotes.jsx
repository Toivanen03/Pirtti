import { Row, Col, Container, Button } from 'react-bootstrap'
import pollo from '../assets/images/pollo.jpg'
import vesileikkeja from '../assets/images/vesileikkeja.jpg'
import hiekkalaatikko from '../assets/images/hiekkalaatikko.jpg'
import { GET_QUOTES } from '../queries/queries'
import { useQuery } from '@apollo/client/react'
import { useState, useEffect } from 'react'
import ImageCarousel from '../layout/ImageCarousel'

const Quotes = ({ mobile, portrait }) => {
  const { data, loading } = useQuery(GET_QUOTES)
  const [description, setDescription] = useState("")
  const [book_1, setBook_1] = useState([])
  const [book_2, setBook_2] = useState([])
  const [book_3, setBook_3] = useState([])
  const [currentPage_1, setCurrentPage_1] = useState(0)
  const [currentPage_2, setCurrentPage_2] = useState(0)
  const [currentPage_3, setCurrentPage_3] = useState(0)
  const [header, setHeader] = useState("")
  const [activeBook, setActiveBook] = useState(1)

  useEffect(() => {
    if (!loading && data?.quotes) {
      setDescription(data.quotes.quotes_kuvaus)
      setBook_1([
        { id: "0", text: data.quotes.quotes_lohkot.lohko_1?.quotes_otsikko },
        ...(data.quotes.quotes_lohkot?.lohko_1?.quotes ?? [])
      ])
      setBook_2([
        { id: "0", text: data.quotes.quotes_lohkot.lohko_2?.quotes_otsikko },
        ...(data.quotes.quotes_lohkot?.lohko_2?.quotes ?? [])
      ])
      setBook_3([
        { id: "0", text: data.quotes.quotes_lohkot.lohko_3?.quotes_otsikko },
        ...(data.quotes.quotes_lohkot?.lohko_3?.quotes ?? [])
      ])
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

  const flipPage = (bookNumber) => {
    const quotesArrays = [book_1, book_2, book_3]
    const setPages = [setCurrentPage_1, setCurrentPage_2, setCurrentPage_3]

    const index = bookNumber - 1

    if (!quotesArrays[index]) return

    setPages[index](prev => {
      const next = prev + 1
      return next >= quotesArrays[index].length ? 0 : next
    })
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
              {book_1.map((page, index) =>        
                <div className={`page ${currentPage_1 > index ? "flipped" : ""}`} key={page.id} style={{ zIndex: book_1.length - index }}>
                  <div className="front front-1 container d-flex flex-column h-100 justify-content-between">
                    <Row className='d-flex justify-content-center'>
                      {currentPage_1 === 0 ? (
                        <h3 className="quotes-header quote">{page.text}</h3>
                      ) : (
                        <h5 className='quotes-header quote'>{page.text}</h5> 
                      )}
                    </Row>
                      {confirmHeight(1, index) && (
                        <Row className='quote-carousel'>
                            <ImageCarousel home={false} bookNumber={1} pageNumber={currentPage_1} />
                        </Row>
                      )}
                      
                      </div>
                    <div className='back back-1' />
                  </div>
                )}

                <Button
                  className='book-button bb1'
                  onClick={() => flipPage(1) }
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    zIndex: '9999'
                  }}
                >
                  <span className='shine' />
                  <span>{currentPage_1 < book_1.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
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
                {book_2.map((page, index) =>        
                  <div className={`page ${currentPage_2 > index ? "flipped" : ""}`} key={page.id} style={{ zIndex: book_2.length - index }}>
                    <div className="front front-2 container d-flex flex-column h-100 justify-content-between">
                      <Row className='d-flex justify-content-center'>
                      {currentPage_2 === 0 ? (
                        <h3 className="quotes-header quote">{page.text}</h3>
                      ) : (
                        <h5 className='quotes-header quote'>{page.text}</h5> 
                      )}
                    </Row>
                      {confirmHeight(2, index) && (
                        <Row className='quote-carousel'>
                            <ImageCarousel home={false} bookNumber={2} pageNumber={currentPage_2} />
                        </Row>
                      )}
                      
                      </div>
                    <div className='back back-2' />
                  </div>
                )}

                <Button
                  className='book-button bb2'
                  onClick={() => flipPage(2) }
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    zIndex: '9999'
                  }}
                >
                  <span className='shine' />
                  <span>{currentPage_2 < book_2.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
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
              {book_3.map((page, index) =>        
                <div className={`page ${currentPage_3 > index ? "flipped" : ""}`} key={page.id} style={{ zIndex: book_3.length - index }}>
                  <div className="front front-3 container d-flex flex-column h-100 justify-content-between">
                    <Row className='d-flex justify-content-center'>
                      {currentPage_3 === 0 ? (
                        <h3 className="quotes-header quote">{page.text}</h3>
                      ) : (
                        <h5 className='quotes-header quote'>{page.text}</h5> 
                      )}
                    </Row>
                      {confirmHeight(3, index) && (
                        <Row className='quote-carousel'>
                            <ImageCarousel home={false} bookNumber={3} pageNumber={currentPage_3} />
                        </Row>
                      )}
                      
                      </div>
                    <div className='back back-3' />
                  </div>
                )}

                <Button
                  className='book-button bb3'
                  onClick={() => flipPage(3) }
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    right: '10px',
                    zIndex: '9999'
                  }}
                >
                  <span className='shine' />
                  <span>{currentPage_3 < book_3.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
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
              {book_1.map((page, index) =>        
                <div className={`page ${currentPage_1 > index ? "flipped" : ""}`} key={page.id} style={{ zIndex: book_1.length - index }}>
                  <div className="front front-1 container d-flex flex-column h-100 justify-content-between">
                    <Row className='d-flex justify-content-center'>
                      {currentPage_1 === 0 ? (
                        <h3 className="quotes-header quote">{page.text}</h3>
                      ) : (
                        <h5 className='quotes-header quote' style={{ fontSize: getFontSize(1, index) }}>{page.text}</h5> 
                      )}
                    </Row>
                      {confirmHeight(1, index) && (
                        <Row className='quote-carousel'>
                            <ImageCarousel home={false} bookNumber={1} pageNumber={currentPage_1} />
                        </Row>
                      )}
                  </div>
                  <div className='back back-1' />
                </div>
              )}
            </div>
          </Row>

          <Row className='d-flex align-items-center justify-content-center mt-5'>
            <Button className='book-button bb1 mb-5' onClick={() => flipPage(1)}>
              <span className='shine' />
              <span>{currentPage_1 < book_1.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
            </Button>
          </Row>


{/* KIRJA 2 */}
          <Row className='d-flex justify-content-center align-items-center offset-2 mt-5 tilt-right'>
            <div className='book' id='book2'>
              {book_2.map((page, index) =>        
                <div className={`page ${currentPage_2 > index ? "flipped" : ""}`} key={page.id} style={{ zIndex: book_2.length - index }}>
                  <div className="front front-2 container d-flex flex-column h-100 justify-content-between">
                    <Row className='d-flex justify-content-center'>
                      {currentPage_2 === 0 ? (
                        <h3 className="quotes-header quote">{page.text}</h3>
                      ) : (
                        <h5 className='quotes-header quote' style={{ fontSize: getFontSize(2, index) }}>{page.text}</h5> 
                      )}
                    </Row>
                      {confirmHeight(2, index) && (
                        <Row className='quote-carousel'>
                            <ImageCarousel home={false} bookNumber={2} pageNumber={currentPage_2} />
                        </Row>
                      )}
                  </div>
                  <div className='back back-2' />
                </div>
              )}
            </div>
          </Row>

          <Row className='d-flex align-items-center justify-content-center mt-5'>
            <Button className='book-button bb2 mb-5' onClick={() => flipPage(2)}>
              <span className='shine' />
              <span>{currentPage_2 < book_2.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
            </Button>
          </Row>

{/* KIRJA 3 */}
          <Row className='d-flex justify-content-center align-items-center offset-2 mt-5 tilt-left'>
            <div className='book' id='book3'>
              {book_3.map((page, index) =>        
                <div className={`page ${currentPage_3 > index ? "flipped" : ""}`} key={page.id} style={{ zIndex: book_3.length - index }}>
                  <div className="front front-3 container d-flex flex-column h-100 justify-content-between">
                    <Row className='d-flex justify-content-center'>
                      {currentPage_3 === 0 ? (
                        <h3 className="quotes-header quote">{page.text}</h3>
                      ) : (
                        <h5 className='quotes-header quote' style={{ fontSize: getFontSize(3, index) }}>{page.text}</h5> 
                      )}
                    </Row>
                      {confirmHeight(3, index) && (
                        <Row className='quote-carousel'>
                          <ImageCarousel home={false} bookNumber={3} pageNumber={currentPage_3} />
                        </Row>
                      )}
                  </div>
                  <div className='back back-3' />
                </div>
              )}
            </div>
          </Row>

          <Row className='d-flex align-items-center justify-content-center mt-5'>
            <Button className='book-button bb3 mb-5' onClick={() => flipPage(3)}>
              <span className='shine' />
              <span>{currentPage_3 < book_3.length ? 'Käännä sivua' : 'Aloita alusta'}</span>
            </Button>
          </Row>
        </Container>
      )}
    </>
  )
}

export default Quotes