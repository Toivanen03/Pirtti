import { Row, Col, Container } from 'react-bootstrap'
import pollo from '../assets/images/pollo.jpg'
import vesileikkeja from '../assets/images/vesileikkeja.jpg'
import keinumassa from '../assets/images/keinumassa.jpg'
import hiekkalaatikko from '../assets/images/hiekkalaatikko.jpg'
import { GET_QUOTES } from '../queries/queries'
import { useQuery } from '@apollo/client/react'
import { useEffect } from 'react'
import { useState } from 'react'

const Quotes = ({ mobile }) => {
  const { data, loading } = useQuery(GET_QUOTES)
  const [description, setDescription] = useState("")
  const [headline_1, setHeadline_1] = useState("")
  const [headline_2, setHeadline_2] = useState("")
  const [headline_3, setHeadline_3] = useState("")
  const [quotes_1, setQuotes_1] = useState([])
  const [quotes_2, setQuotes_2] = useState([])
  const [quotes_3, setQuotes_3] = useState([])

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

  return (
    <>
      {!mobile ? (
        <Container fluid className="h-100 p-0 d-flex align-items-center justify-content-center content mt-5 mb-5 content-text" style={{ width: '100vw' }}>
          <Container className="text-center">
            <Row className='mb-3'>
              <h2 className="quotes-headline">Lasten suusta kuultua</h2>
            </Row>

            <Row className="text-center mb-5">
              <strong>{description}</strong>
            </Row>

            <Row>
              <Col xs={4} className="d-flex flex-column mt-3">
                <img src={vesileikkeja} alt="Vesileikkejä" className="quotes-image tilt-left" />
              </Col>

              <Col xs={8} className="text-start">
                <h3 className="quotes-header mb-4 mt-4">{headline_1}</h3>
                <Row className="d-flex flex-row text-start">
                  {quotes_1.map(quote =>
                    <ul key={quote.id}>
                      <li>{quote.text}</li>
                    </ul>
                  )}
                </Row>
              </Col>
            </Row>

            <Row className="mt-5 p-0">
              <h3 className="quotes-header text-start ms-3 mb-4 mt-3">{headline_2}</h3>
              {(() => {
                const midpoint = Math.ceil(quotes_2.length / 2)
                const firstHalf = quotes_2.slice(0, midpoint)
                const secondHalf = quotes_2.slice(midpoint)

                return (
                  <>
                    <Col className="d-flex flex-column">
                      {firstHalf.map(quote => (
                        <ul key={quote.id}>
                          <li className="text-start">{quote.text}</li>
                        </ul>
                      ))}
                    </Col>

                    <Col className="d-flex flex-column">
                      {secondHalf.map(quote => (
                        <ul key={quote.id}>
                          <li className="text-start">{quote.text}</li>
                        </ul>
                      ))}
                    </Col>
                  </>
                )
              })()}
            </Row>

            <Row className='mt-5'>
              <h3 className="quotes-header mb-4 mt-5">{headline_3}</h3>
              <Col xs={7} className="offset-1">
                <Row className="d-flex flex-row text-start">
                  <Col className="d-flex flex-column mt-4">
                    {quotes_3.map(quote =>
                      <ul key={quote.id}>
                        <li>{quote.text}</li>
                      </ul>
                    )}
                  </Col>
                </Row>
              </Col>

              <Col xs={4}>
                <Row className="d-flex flex-row align-items-start justify-content-center">
                  <img src={pollo} alt="Pöllö" className="quotes-image tilt-right" />
                </Row>
              </Col>
            </Row>
          </Container>
        </Container>
      ) : (
        <Container fluid className="p-2 mx-auto mb-5 content-text" style={{ width: '100vw' }}>
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
            <img src={keinumassa} alt="Lapsi keinumassa" className="quotes-image tilt-right" style={{ maxWidth: '70vw' }} />
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
            <img src={pollo} alt="Pöllö" className="quotes-image tilt-left" />
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
            <img src={hiekkalaatikko} alt="Leluja hiekkalaatikolla" className="quotes-image tilt-right" style={{ maxWidth: '70vw' }} />
          </Row>
        </Container>
      )}
    </>
  )
}

export default Quotes