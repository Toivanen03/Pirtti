import { Form, Row, Col } from "react-bootstrap"

const SecondParentData = ({ formData, handleChange }) => {
    const employmentStatus = [
        "Työssä", "Opiskelija", "Työtön", "Eläkkeellä"
    ]

    return (
        <div className="text-start">
            <Row>
                <Col>
                    <Form.Group controlId="formEtunimet_aikuinen_2" className="mb-3">  
                        <small>Etunimet</small>
                        <Form.Control
                            type="text"
                            name="etunimet_aikuinen_2"
                            value={formData.etunimet_aikuinen_2}
                            onChange={handleChange}
                            placeholder="Etunimet"                           
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formSukunimi_aikuinen_2" className="mb-3">
                        <small>Sukunimi</small>
                        <Form.Control
                            type="text"
                            name="sukunimi_aikuinen_2"
                            value={formData.sukunimi_aikuinen_2}
                            onChange={handleChange}
                            placeholder="Sukunimi"                            
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group controlId="formTyollisyys_aikuinen_2" className="mb-3">
                        <small>Työllisyystilanne</small>
                        <Form.Select
                            name="tyollisyys_aikuinen_2"
                            value={formData.tyollisyys_aikuinen_2}
                            onChange={handleChange}                            
                        >
                            <option value="" disabled>Valitse:</option>
                            {employmentStatus.map((status, index) => (
                                <option key={index} value={status}>
                                    {status}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col>
                {(formData.tyollisyys_aikuinen_2 === "Työssä" || formData.tyollisyys_aikuinen_2 === "Opiskelija") && 
                    <Form.Group controlId="formTyonantaja_tai_oppilaitos_aikuinen_2" className="mb-3">
                        {formData.tyollisyys_aikuinen_2 === "Työssä" ? <small>Työnantaja</small> : <small>Oppilaitos</small>}
                        <Form.Control
                            type="text" 
                            name="tyonantaja_tai_oppilaitos_aikuinen_2" 
                            value={formData.tyonantaja_tai_oppilaitos_aikuinen_2}
                            onChange={handleChange}
                            placeholder={formData.tyollisyys_aikuinen_2 === "Työssä" ? "Työnantaja" : "Oppilaitos"}                             
                        /> 
                    </Form.Group>}
                </Col>
            </Row>

            <Row>
                <Col className="col-6 mb-3">
                    <Form.Group controlId="formPuhelinnumero_aikuinen_2">  
                        <small>Puhelinnumero lapsen hoitoaikana</small>
                        <Form.Control
                            type="text"
                            name="puhelinnumero_aikuinen_2"
                            value={formData.puhelinnumero_aikuinen_2}
                            onChange={handleChange}
                            placeholder="Puhelinnumero"
                            style={{ width: 'calc(100% - 0.75rem)' }}                         
                        />
                    </Form.Group>
                </Col>
                {(formData.tyollisyys_aikuinen_2 === "Työssä" || formData.tyollisyys_aikuinen_2 === "Opiskelija") &&
                    <Col>
                        <Form.Group controlId="formTyoaika_aikuinen_2" className="mb-3">
                            <small>{formData.tyollisyys_aikuinen_2 === "Työssä" ? 'Työaika' : 'Kouluaika'} * (esim. 8.00-16.00)</small> 
                            <Form.Control
                                type="text"
                                name="tyoaika_aikuinen_2"
                                value={formData.tyoaika_aikuinen_2}
                                onChange={handleChange}
                                placeholder={formData.tyollisyys_aikuinen_2 === "Työssä" ? 'Työaika' : 'Kouluaika'}
                            />
                        </Form.Group>
                    </Col>
                }
            </Row>

            <Col className="col-6">
                <Form.Group controlId="formSahkoposti_aikuinen_2" className="mb-3">
                    <small>Sähköpostiosoite</small>
                    <Form.Control
                        type="text"
                        name="sahkoposti_aikuinen_2"
                        value={formData.sahkoposti_aikuinen_2}
                        onChange={handleChange}
                        placeholder="Sähköposti"  
                        style={{ width: 'calc(100% - 0.75rem)' }}    
                    />
                </Form.Group>
            </Col>
        </div>
    )
}

export default SecondParentData