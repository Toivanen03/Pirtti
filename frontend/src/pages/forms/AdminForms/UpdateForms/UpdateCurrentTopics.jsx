import {Form, Row, Col, Button } from 'react-bootstrap'
import { useRef } from 'react'

const UpdateTopics = ({ handleSubmit, handleChange, formData, portrait }) => {
    const topicsFormRef = useRef()

    return (
        <Col className={portrait ? "d-flex flex-column justify-content-center text-start mt-4" : "d-flex flex-column justify-content-center text-start mt-5"}>
                <Form onSubmit={handleSubmit} ref={topicsFormRef} style={{ width: "100%", margin: "0 auto" }}>
                    <div className='d-flex flex-column align-items-center'>
                        <Row style={{ width: "100%" }}>
                            <Col>
                                <Form.Group controlId="formAjankohtaista">  
                                    <Row className="mb-3">
                                        <Form.Control
                                            type="text"
                                            name="otsikko"
                                            value={formData.otsikko}
                                            onChange={handleChange}
                                            placeholder="Otsikko"
                                        />
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='justify-content-start align-items-center mb-3' style={{ width: "100%" }}>
                            <Col className='col-5'>
                                <span>Tapahtuman ajankohta <span style={{ color: 'blue' }}>(valinnainen)</span></span>
                            </Col>
                            <Col className='col-4'>
                                <Form.Group controlId="formAjankohtaistaPvm">  
                                    <Row>
                                        <Form.Control
                                            type="date"
                                            min={new Date().toISOString().split('T')[0]}
                                            name="ajankohta"
                                            value={formData.ajankohta}
                                            onChange={handleChange}
                                            placeholder="Tapahtumapäivä"
                                        />
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row style={{ width: "100%" }}>
                            <Col>
                                <Form.Group controlId="formTeksti">  
                                    <Row className="mb-3">
                                        <Form.Control
                                            as="textarea"
                                            name="teksti"
                                            value={formData.teksti}
                                            onChange={handleChange}
                                            placeholder="Vapaa teksti. Voit yhdistää muotoiluja esimerkiksi **##TEKSTI##**, kunhan muotoilumerkkien parit ovat oikeassa järjestyksessä.."
                                            rows={3}
                                        />
                                        <Form.Text className="text-muted">
                                            Voit korostaa tekstiä lisäämällä merkit haluamasi kohdan alkuun ja loppuun, esimerkiksi
                                            <i> ##kursivoitu teksti## </i> tai <b> **lihavoitu teksti**</b>.
                                        </Form.Text>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex flex-column align-items-center text-center">
                            <Button variant="success" type="submit" style={{ width: portrait ? '10vw' : '6vw' }}>Lähetä</Button>
                        </div>
                    </div>
                </Form>
            </Col>
    )
}

export default UpdateTopics