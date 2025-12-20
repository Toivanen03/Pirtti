import { Form, Row, Col } from "react-bootstrap"

const ChildHealthData = ({ formData, handleChange, mobile }) => {
    return (
        <div className="text-start">
            <Row className="mb-2 mt-4">
                <Col>  
                    <Form.Label><strong>Lapsen terveydentila</strong></Form.Label>
                </Col>
            </Row>

            <Row>
                <Col className={!mobile ? "col-6" : "col-12"}>
                    <Form.Group controlId="formSuostumus" className={!mobile ? "mb-3" : ""}>
                        <small>Saammeko tarvittaessa olla yhteydessä päivähoidon eri yhteistyötahojen (kuten neuvolan) kanssa lapsen kehitystä ja terveyttä koskevissa asioissa? *</small>
                        <Form.Select
                            name="suostumus"
                            value={formData.suostumus}
                            onChange={handleChange}
                            className="mt-2"
                            required
                        >
                            <option value="" default disabled>Valitse: *</option>
                            <option value={true}>Kyllä</option>
                            <option value={false}>Ei</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col className={!mobile ? "col-6" : "col-12"}>
                    {formData.suostumus && <Form.Group controlId="formNeuvola" className={!mobile ? "mt-5" : "mt-2"}> 
                        <Form.Control
                            type="text"
                            name="neuvola"
                            value={formData.neuvola}
                            onChange={handleChange}
                            placeholder="Viimeksi käyttämänne lastenneuvola, osoite? *"
                            required={formData.suostumus}
                        />
                    </Form.Group>}
                </Col>
            </Row>

            <Row className="mb-3">
                <Col className={!mobile ? "col-6" : "col-12"}>
                    <Form.Group controlId="formAllergiat" className={!mobile ? "mb-3" : "mt-3"}>
                        <small>Allergiat, sairaudet, erityisruokavaliot? *</small>
                        <Form.Select
                            name="allergiat"
                            value={formData.allergiat}
                            onChange={handleChange}
                            className="mt-2"
                            required
                        >
                            <option value="" default disabled>Valitse: *</option>
                            <option value={true}>Kyllä</option>
                            <option value={false}>Ei ole</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                <Col className={!mobile ? "col-6" : "col-12"}>
                    {formData.allergiat && <Form.Group controlId="formMuut_terveystiedot" className={!mobile ? "mb-3 mt-4" : "mt-2"}>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="muut_terveystiedot"
                            value={formData.muut_terveystiedot}
                            onChange={handleChange}
                            placeholder="Sairaudet, allergiat, ruokavalio yms. *"
                            required={formData.allergiat}
                        />
                    </Form.Group>}
                </Col>
            </Row>

            <Row className="mb-3">
                <Col className={!mobile ? "col-6" : "col-12"}>
                    <Form.Group controlId="formSairaalahoito" className={!mobile ? "mb-3" : ""}>
                        <small>Onko lapsi ollut sairaalahoidossa tai jatkuvassa lääkärinhoidossa? *</small>
                        <Form.Select
                            name="sairaalahoito"
                            value={formData.sairaalahoito}
                            onChange={handleChange}
                            className="mt-2"
                            required
                        >
                            <option value="" default disabled>Valitse: *</option>
                            <option value={true}>Kyllä</option>
                            <option value={false}>Ei</option>
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col className={!mobile ? "col-6" : "col-12"}>
                    {formData.sairaalahoito && <Form.Group controlId="formSairaala" className={!mobile ? "mb-3 mt-4" : "mt-2"}>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="sairaala"
                            value={formData.sairaala}
                            onChange={handleChange}
                            placeholder="Milloin ja miksi? *"
                            required={formData.sairaalahoito}
                        />
                    </Form.Group>}
                </Col>
            </Row>

            <Row className="mb-3">
                <Col className="col-12">
                    <Form.Group controlId="formLisatiedot" className="mb-3">
                        <small>Lisätiedot:</small>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name="lisatiedot"
                            value={formData.lisatiedot}
                            onChange={handleChange}
                            className="mt-2"
                            placeholder="Voit halutessasi antaa lisätietoja hoitopaikan tarpeen perusteiksi."
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    )
}

export default ChildHealthData