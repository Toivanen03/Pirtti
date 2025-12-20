import { Form, Button, Row, Col } from "react-bootstrap"
import { GET_CONTACTS } from "../../../../queries/queries"
import { useQuery } from '@apollo/client/react'
import { useRef } from "react"
import { getPhone } from "../../../Contacts"

const ContactUpdate = ({ handleSubmit, handleChange, formData, portrait }) => {
    const { data } = useQuery(GET_CONTACTS)
    const contactFormRef = useRef(null)

    return (
        <Col className="d-flex flex-column justify-content-center text-start mt-4">
                <Form onSubmit={handleSubmit} ref={contactFormRef} style={{ width: "100%", margin: "0 auto" }}>
                    <div className='d-flex flex-column align-items-center'>
                        {!portrait && <Col className="offset-7 text-center"><strong>Nykyiset tiedot:</strong></Col>}
                        <Row style={{ width: "100%" }}>
                            <Col>
                                <Form.Group controlId="formPuhelin1">
                                    <Row className="mb-3">
                                        <Col className={portrait ? "col-12" : "col-7"}>
                                            <Form.Control
                                                type="text"
                                                name="puhelin_1"
                                                value={formData.puhelin_1}
                                                onChange={handleChange}
                                                placeholder={!portrait ? "Johtaja" : `Johtaja: ${getPhone(data?.getContacts?.puhelin_1, 'clean')}`}
                                            />
                                        </Col>
                                        {!portrait &&
                                            <Col className="col-5 d-flex align-items-center">
                                                <small className="ms-4">{getPhone(data?.getContacts?.puhelin_1, 'clean')}</small>
                                            </Col>
                                        }
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row style={{ width: "100%" }}>
                            <Col>
                                <Form.Group controlId="formPuhelin2">  
                                    <Row className="mb-3">
                                        <Col className={portrait ? "col-12" : "col-7"}>
                                            <Form.Control
                                                type="text"
                                                name="puhelin_2"
                                                value={formData.puhelin_2}
                                                onChange={handleChange}
                                                placeholder={!portrait ? "Yläkerta" : `Yläkerta: ${getPhone(data?.getContacts?.puhelin_2, 'clean')}`}
                                            />
                                        </Col>
                                        {!portrait &&
                                            <Col className="col-5 d-flex align-items-center">
                                                <small className="ms-4">{getPhone(data?.getContacts?.puhelin_2, 'clean')}</small>
                                            </Col>
                                        }
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row style={{ width: "100%" }}>
                            <Col>
                                <Form.Group controlId="formPuhelin3">  
                                    <Row className="mb-3">
                                        <Col className={portrait ? "col-12" : "col-7"}>
                                            <Form.Control
                                                type="text"
                                                name="puhelin_3"
                                                value={formData.puhelin_3}
                                                onChange={handleChange}
                                                placeholder={!portrait ? "Alakerta" : `Alakerta: ${getPhone(data?.getContacts?.puhelin_3, 'clean')}`}
                                            />
                                        </Col>
                                        {!portrait &&
                                            <Col className="col-5 d-flex align-items-center">
                                                <small className="ms-4">{getPhone(data?.getContacts?.puhelin_3, 'clean')}</small>
                                            </Col>
                                        }
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row style={{ width: "100%" }}>
                            <Col>
                                <Form.Group controlId="formSahkoposti" className="mb-5">  
                                    <Row>
                                        <Col className={portrait ? "col-12" : "col-7"}>
                                            <Form.Control
                                                type="text"
                                                name="sahkoposti"
                                                value={formData.sahkoposti}
                                                onChange={handleChange}
                                                placeholder={!portrait ? "Sähköpostiosoite" : data?.getContacts?.sahkoposti}
                                            />
                                        </Col>
                                        {!portrait &&
                                            <Col className="col-5 d-flex align-items-center">
                                                <small className="ms-4">{data?.getContacts?.sahkoposti}</small>
                                            </Col>
                                        }
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row style={{ width: "100%" }}>
                            <Col className={!portrait ? "col-3 offset-2 text-center align-items-center justify-content-center d-flex" : "text-center mt-3"}>
                                <Button variant="success" type="submit" style={{ width: portrait ? '10vw' : '6vw' }}>Lähetä</Button>
                            </Col>
                        </Row>
                    </div>
                </Form>
            </Col>
    )
}

export default ContactUpdate