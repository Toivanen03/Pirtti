import { Form, Row, Col } from "react-bootstrap"

const FirstParentData = ({ formData, handleChange, otherParent, setOtherParent }) => {
    const employmentStatus = [
        "Työssä", "Opiskelija", "Työtön", "Eläkkeellä"
    ]

    return (
        <div className="text-start">
            <Row>
                <Col>
                    <Form.Group controlId="formEtunimet_aikuinen_1" className="mb-3">  
                        <small>Etunimet *</small>
                        <Form.Control
                            type="text"
                            name="etunimet_aikuinen_1"
                            value={formData.etunimet_aikuinen_1}
                            onChange={handleChange}
                            placeholder="Etunimet"
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formSukunimi_aikuinen_1" className="mb-3">
                        <small>Sukunimi *</small>
                        <Form.Control
                            type="text"
                            name="sukunimi_aikuinen_1"
                            value={formData.sukunimi_aikuinen_1}
                            onChange={handleChange}
                            placeholder="Sukunimi"
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group controlId="formTyollisyys_aikuinen_1" className="mb-3">
                        <small>Työllisyys *</small>
                        <Form.Select
                            name="tyollisyys_aikuinen_1"
                            value={formData.tyollisyys_aikuinen_1}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Valitse: *</option>
                            {employmentStatus.map((status, index) => (
                                <option key={index} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col>
                {(formData.tyollisyys_aikuinen_1 === "Työssä" || formData.tyollisyys_aikuinen_1 === "Opiskelija") && 
                    <Form.Group controlId="formTyonantaja_tai_oppilaitos_aikuinen_1" className="mb-3">
                        {formData.tyollisyys_aikuinen_1 === "Työssä" ? <small>Työnantaja *</small> : <small>Oppilaitos *</small>}
                        <Form.Control
                            type="text" 
                            name="tyonantaja_tai_oppilaitos_aikuinen_1" 
                            value={formData.tyonantaja_tai_oppilaitos_aikuinen_1}
                            onChange={handleChange}
                            placeholder={formData.tyollisyys_aikuinen_1 === "Työssä" ? "Työnantaja" : "Oppilaitos"}
                        /> 
                    </Form.Group>}
                </Col>
            </Row>

            <Row>
                <Col className="col-6">
                    <Form.Group controlId="formPuhelinnumero_aikuinen_1" className="mb-3">
                        <small>Puhelinnumero lapsen hoitoaikana *</small>  
                        <Form.Control
                            type="text"
                            name="puhelinnumero_aikuinen_1"
                            value={formData.puhelinnumero_aikuinen_1}
                            onChange={handleChange}
                            placeholder="Puhelinnumero"
                            required
                        />
                    </Form.Group>
                </Col>
                {(formData.tyollisyys_aikuinen_1 === "Työssä" || formData.tyollisyys_aikuinen_1 === "Opiskelija") &&
                    <Col>
                        <Form.Group controlId="formTyoaika_aikuinen_1" className="mb-3">
                            <small>{formData.tyollisyys_aikuinen_1 === "Työssä" ? 'Työaika' : 'Kouluaika'} * (esim. 8.00-16.00)</small> 
                            <Form.Control
                                type="text"
                                name="tyoaika_aikuinen_1"
                                value={formData.tyoaika_aikuinen_1}
                                onChange={handleChange}
                                placeholder={formData.tyollisyys_aikuinen_1 === "Työssä" ? 'Työaika' : 'Kouluaika'}
                            />
                        </Form.Group>
                    </Col>
                }
            </Row>

            <Row className="align-items-center">
                <Col>
                    <Form.Group controlId="formSahkoposti_aikuinen_1" className="mb-3">  
                        <small>Sähköpostiosoite *</small> 
                        <Form.Control
                            type="text"
                            name="sahkoposti_aikuinen_1"
                            value={formData.sahkoposti_aikuinen_1}
                            onChange={handleChange}
                            placeholder="Sähköposti"
                            required
                        />
                    </Form.Group>
                </Col>

                <Col className="d-flex justify-content-center text-center">
                    <Form.Group controlId="formToinen_aikuinen" className="mb-3">
                        <small>Lisää toinen huoltaja</small> 
                        <Form.Check
                            type="switch"
                            id="toinen_aikuinen"
                            name="toinen_aikuinen"
                            checked={otherParent}
                            onChange={() => setOtherParent(!otherParent)}
                            disabled={formData.asuminen === "Lapsi asuu toisen huoltajan kanssa"}
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    )
}

export default FirstParentData