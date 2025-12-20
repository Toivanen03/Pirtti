import { parentsRelation, parentsRelationBasic } from "../formFields/formValues"
import { Form, Row, Col } from "react-bootstrap"

const FamilyConnections = ({ formData, handleChange }) => {
    return (
        <div className="text-start">
            <Row className="mb-2 mt-5">
                <Col>  
                    <Form.Label><strong>Perhesuhde</strong></Form.Label>
                </Col>
            </Row>

            <Row>
                <Col>
                    <Form.Group controlId="formSuhde" className="mb-3">
                        <small>Vanhempien suhde *</small>
                        <Form.Select
                            name="suhde"
                            value={formData.suhde}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Valitse: *</option>
                            {parentsRelationBasic.map((relation, index) => (
                                <option key={index} value={relation}>
                                    {relation}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>

                <Col>
                    <Form.Group controlId="formAsuminen" className="mb-3">
                        <small>Lapsen asuminen *</small>
                        <Form.Select
                            name="asuminen"
                            value={formData.asuminen}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Valitse: *</option>
                            {parentsRelation.map((living, index) => (
                                <option key={index} value={living}>
                                    {living}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Col>
            </Row>
        </div>
    )
}

export default FamilyConnections