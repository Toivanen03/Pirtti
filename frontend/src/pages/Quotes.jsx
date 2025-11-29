import { Row, Col, Container, Button } from 'react-bootstrap'
import pollo from '../assets/images/pollo.jpg'
import vesileikkeja from '../assets/images/vesileikkeja.jpg'
import keinumassa from '../assets/images/keinumassa.jpg'
import hiekkalaatikko from '../assets/images/hiekkalaatikko.jpg'
import { GET_QUOTES } from '../queries/queries'
import { useQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { useState } from 'react'
import ImageCarousel from '../layout/ImageCarousel'

const Quotes = ({ mobile }) => {
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
    }, 180)
    return () => {
      clearInterval(interval)
    }
    }, [])

  const flipPage = (book) => {
    switch(book){
      case 1:
        if (currentPage_1 < quotes_1.length + 1) {
          setCurrentPage_1(prev => prev + 1)
        } else {
          setCurrentPage_1(0)
        }
        break

      case 2:
        if (currentPage_2 < quotes_2.length + 1) {
          setCurrentPage_2(prev => prev + 1)
        } else {
          setCurrentPage_2(0)
        }
        break
      
      case 3:
        if (currentPage_3 < quotes_3.length + 1) {
          setCurrentPage_3(prev => prev + 1)
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
        <Container fluid className="h-100 p-0 d-flex align-items-center justify-content-center content mt-5 mb-5 content-text">
          <Container className="text-center quotes">
            <Row className='mb-3'>
              <h2 className="quotes-headline">{header}</h2>
            </Row>

            <Row className="text-center mb-5">
              <strong>{description}</strong>
            </Row>

{/* KIRJA 1 */}
            <Row className='d-flex align-items-center justify-content-end'>
              <Col className='col-6'>
                <div className='book' id='book1'>
                  <div className={`page ${currentPage_1 > 0 ? "flipped" : ""}`}>
                    <div className="front front-1">
                      <h3 className="quotes-header">{headline_1}</h3>
                      <img src={vesileikkeja} alt="Vesileikkejä" className="quotes-image tilt-left border border-2 light-border" />
                    </div>
                    <div className="back back-1"></div>
                  </div>

                  {quotes_1.map((quote, index) =>
                    <div className={`page ${currentPage_1 > index + 1 ? "flipped" : ""}`} key={index}>
                      <div className="front front-1 container d-flex flex-column h-100 justify-content-between">
                        <div className='d-flex justify-content-center mt-5'>
                          <h5>{quote.text}</h5>
                        </div>
                        <div className='d-flex justify-content-center mb-4'>
                          <ImageCarousel home={false} book={true} count={currentPage_1} />
                        </div>
                      </div>
                      <div className='back back-1' />
                    </div>
                  )}
                </div>
              </Col>

              <Col className='d-flex align-self-end justify-content-start col-2'>
                <Button className='book-button mb-5' onClick={() => flipPage(1)}>
                  <span className='shine' />
                  Käännä sivua
                </Button>
              </Col>
            </Row>

{/* KIRJA 2 */}
            <Row className='d-flex align-items-center justify-content-end mt-5'>
              <Col className='col-6'>
                <div className='book' id='book2'>
                  <div className={`page ${currentPage_2 > 0 ? "flipped" : ""}`}>
                    <div className="front front-2">
                      <h3 className="quotes-header mb-3">{headline_2}</h3>
                      <img src={hiekkalaatikko} alt="Leluja hiekkalaatikolla" className="quotes-image tilt-left border border-2 light-border"/>
                    </div>
                    <div className="back back-2"></div>
                  </div>

                  {quotes_2.map((quote, index) =>
                    <div className={`page ${currentPage_2 > index + 1 ? "flipped" : ""}`} key={index}>
                      <div className="front front-2 container d-flex flex-column h-100 justify-content-between">
                        <div className='d-flex justify-content-center mt-5'>
                          <h5>{quote.text}</h5>
                        </div>
                        <div className='d-flex justify-content-center mb-4'>
                          <ImageCarousel home={false} book={true} count={currentPage_2} />
                        </div>
                      </div>
                      <div className='back back-2' />
                    </div>
                  )}
                </div>
              </Col>

              <Col className='d-flex align-self-end justify-content-start col-2'>
                <Button className='book-button mb-5' onClick={() => flipPage(2)}>
                  <span className='shine' />
                  Käännä sivua
                </Button>
              </Col>
            </Row>

{/* KIRJA 3 */}
            <Row className='d-flex align-items-center justify-content-end mt-5'>
              <Col className='col-6'>
                <div className='book' id='book3'>
                  <div className={`page ${currentPage_3 > 0 ? "flipped" : ""}`}>
                    <div className="front front-3">
                      <h3 className="quotes-header mb-3">{headline_3}</h3>
                      <img src={pollo} alt="Lasten askartelema pöllö" className="quotes-image tilt-left border border-2 light-border"/>
                    </div>
                    <div className="back back-3"></div>
                  </div>

                  {quotes_3.map((quote, index) =>
                    <div className={`page ${currentPage_3 > index + 1 ? "flipped" : ""}`} key={index}>
                      <div className="front front-3 container d-flex flex-column h-100 justify-content-between">
                        <div className='d-flex justify-content-center mt-5'>
                          <h5>{quote.text}</h5>
                        </div>
                        <div className='d-flex justify-content-center mb-4'>
                          <ImageCarousel home={false} book={true} count={currentPage_3} />
                        </div>
                      </div>
                      <div className='back back-3' />
                    </div>
                  )}
                </div>
              </Col>

              <Col className='d-flex align-self-end justify-content-start col-2'>
                <Button className='book-button mb-5' onClick={() => flipPage(3)}>
                  <span className='shine' />
                  Käännä sivua
                </Button>
              </Col>
            </Row>
          </Container>
        </Container>
      ) : (
        <Container fluid className="p-2 mb-5 content-text" style={{maxWidth: '80%'}}>
          <Row>
            <h2 className="quotes-headline text-center">Lasten suusta kuultua</h2>
          </Row>

          <Row className="text-center mb-3">
            <strong>{description}</strong>
          </Row>

          <Row className='mt-5'>
            <Col xs={12} className="p-0 offset-1 d-flex flex-column text-center">
              <h2 className="quotes-header p-2 text-start mb-3">{headline_1}</h2>
              <Col xs={10} className="d-flex flex-column text-start">
                {quotes_1.map(quote =>
                  <ul key={quote.id}>
                    <li>{quote.text}</li>
                  </ul>
                )}
              </Col>
            </Col>
          </Row>

          <Row className="justify-content-center mt-5 mb-5">
            <img src={keinumassa} alt="Lapsi keinumassa" className="quotes-image tilt-right border border-2 light-border p-0" style={{ maxWidth: '70vw' }} />
          </Row>

          <Row>
            <Col xs={12} className="p-0 offset-1 d-flex flex-column text-center">
              <h2 className="quotes-header p-2 text-start mb-3">{headline_2}</h2>
              <Col xs={10} className="d-flex flex-column text-start">
                {quotes_2.map(quote =>
                  <ul key={quote.id}>
                    <li>{quote.text}</li>
                  </ul>
                )}
              </Col>
            </Col>
          </Row>

          <Row className="justify-content-center mt-5 mb-5">
            <img src={pollo} alt="Pöllö" className="quotes-image tilt-left border border-2 light-border p-0" />
          </Row>

          <Row>
            <Col xs={12} className="p-0 offset-1 d-flex flex-column text-center">
              <h2 className="quotes-header p-2 text-start mb-3">{headline_3}</h2>
              <Col xs={10} className="d-flex flex-column text-start">
                {quotes_3.map(quote =>
                  <ul key={quote.id}>
                    <li>{quote.text}</li>
                  </ul>
                )}
              </Col>
            </Col>
          </Row>

          <Row className="justify-content-center mt-5">
            <img src={hiekkalaatikko} alt="Leluja hiekkalaatikolla" className="quotes-image tilt-right border border-2 light-border p-0" style={{ maxWidth: '70vw' }} />
          </Row>
        </Container>
      )}
    </>
  )
}

export default Quotes