import {Form, Row, Col, Button } from 'react-bootstrap'
import { useRef, useEffect, useState } from 'react'
import QuotesModal from '../../../../modals/QuotesModal'

const UpdateQuotes = ({ handleSubmit, handleChange, formData, setFormData, quotesFields, setConfirmTitle, portrait }) => {
    const quotesFormRef = useRef()
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        if (formData.quotes_kuvaus) {
            setFormData(prev => ({
                ...prev,
                quotes_lohko: 0
            }))
        }
    }, [formData.quotes_kuvaus])

    return (
        <Col className="d-flex flex-column justify-content-center align-items-center mt-4 mb-5">
                <Form onSubmit={handleSubmit} ref={quotesFormRef} style={{ width: "100%", margin: "0 auto" }}>
                    <div className='d-flex flex-column align-items-center'>
                        <Row style={{ width: "100%" }}>
                            <Col>
                                <Form.Group controlId="formKuvaus">  
                                    <Row>
                                        <Form.Control
                                            as="textarea"
                                            name="quotes_kuvaus"
                                            value={formData.quotes_kuvaus}
                                            onChange={handleChange}
                                            placeholder="Muokkaa koko osion kuvaustekstiä. Kuvausteksti on heti sivun otsikon alla oleva kappale."
                                            disabled={formData.quote || formData.quotes_otsikko}
                                            rows={2}
                                            maxLength={200}
                                        />
                                    </Row>
                                    <Row className="text-start mb-3"><small>{`${formData.quotes_kuvaus.length}/200`}</small></Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row style={{ width: "100%" }}>
                            <Col className='col-3'>
                                <Form.Group controlId="formLohko">  
                                    <Row className="mb-3">
                                        <Form.Select
                                            name="quotes_lohko"
                                            value={formData.quotes_lohko}
                                            onChange={handleChange}
                                            disabled={formData.quotes_kuvaus}
                                        >
                                            <option value={0} disabled>{portrait ? 'Muokattava lohko:' : 'Valitse muokattava lohko:'}</option>
                                            <option value={1}>Lohko 1</option>
                                            <option value={2}>Lohko 2</option>
                                            <option value={3}>Lohko 3</option>
                                        </Form.Select>
                                    </Row>
                                </Form.Group>
                            </Col>

                            <Col className='col-9'>
                                <Form.Group controlId="formQuotesOtsikko">  
                                    <Row>
                                        <Form.Control
                                            type="text"
                                            className='text-center'
                                            name="quotes_otsikko"
                                            value={formData.quotes_otsikko}
                                            onChange={handleChange}
                                            placeholder={portrait ? "Valitse lohko muokataksesi sen alaotsikkoa." : "Muokkaa vain, jos haluat vaihtaa valitun lohkon alaotsikkoa. Valitse ensin muokattava lohko."}
                                            disabled={!formData.quotes_lohko || formData.quote || formData.quotes_kuvaus}
                                            maxLength={100}
                                        />
                                    </Row>
                                    <Row className="text-start mb-3"><small>{`${formData.quotes_otsikko.length}/100`}</small></Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row style={{ width: "100%" }}>
                            <Col>
                                <Form.Group controlId="formQuote" className="mb-4">  
                                    <Row>
                                        <Form.Control
                                            as="textarea"
                                            name="quote"
                                            value={formData.quote}
                                            onChange={handleChange}
                                            placeholder={portrait ? "Valitse lohko lisätäksesi lainauksen." : "Tähän voit kirjoittaa haluamasi lainauksen, ja se asetetaan valitun lohkon otsikon alle. Otsikkoa ei tarvitse antaa erikseen, vaan pelkkä lohkon valinta määrittää siteerauksen sijainnin sivulla. Valitse ensin lohko, johon haluat sijoittaa uuden lainauksen."}
                                            disabled={!formData.quotes_lohko || formData.quotes_otsikko || formData.quotes_kuvaus}
                                            rows={2}
                                            maxLength={300}
                                        />
                                    </Row>
                                    <Row className="text-start"><small>{`${formData.quote.length}/300`}</small></Row>
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Row style={{ width: "100%" }}>
                            <Col className="col-4 text-end">
                                <Button variant="success" type="submit" style={{ width: '10vw' }}>Lähetä</Button>
                            </Col>
                            <Col className="col-4">
                                <Button variant="secondary" style={{ width: '10vw' }} onClick={() => setFormData(quotesFields)}>Tyhjennä</Button>
                            </Col>
                            <Col className="col-4 text-start">
                                <Button variant="warning" style={{ width: portrait ? '16vw' : '10vw' }} onClick={() => setShowModal(true)}>Näytä nykyiset</Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
                <QuotesModal showModal={showModal} setShowModal={setShowModal} setConfirmTitle={setConfirmTitle} />
            </Col>
    )
}

export default UpdateQuotes