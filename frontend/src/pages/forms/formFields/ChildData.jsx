import { useState } from "react"
import { Form, Row, Col } from "react-bootstrap"

const ChildData = ({ formData, handleChange, otherLanguage, formType, mobile }) => {
    const [foreignSSN, setForeignSSN] = useState(false)
    const languages = [
        "Suomi", "Ruotsi", "Venäjä", "Viro", "Ukraina", "Farsi", "Arabia", "Muu..."
    ]

    const birthdayMin = formType === 'ekh' ? new Date(new Date().setFullYear(new Date().getFullYear() - 8))
                                                .toISOString()
                                                .split("T")[0]
                                            : new Date(new Date().setFullYear(new Date().getFullYear() - 7))
                                                .toISOString()
                                                .split("T")[0]

    const birthdayMax = formType === 'ekh' ? new Date(new Date().setFullYear(new Date().getFullYear() - 4))
                                                .toISOString()
                                                .split("T")[0]
                                            : new Date(new Date().setFullYear(new Date().getFullYear()))
                                                .toISOString()
                                                .split("T")[0]

    return (
        <div className="text-start">
            <Row>
                <Col className="col-6">
                    <Form.Group controlId="formEtunimet_lapsi" className="mb-3">
                        <small>Etunimet *</small>
                        <Form.Control
                            type="text"
                            name="etunimet_lapsi"
                            value={formData.etunimet_lapsi}
                            onChange={handleChange}
                            placeholder="Etunimet"
                            required
                        />
                    </Form.Group>
                </Col>
                <Col className="col-6">
                    <Form.Group controlId="formSukunimi_lapsi" className="mb-3">
                        <small>Sukunimi *</small>
                        <Form.Control
                            type="text"
                            name="sukunimi_lapsi"
                            value={formData.sukunimi_lapsi}
                            onChange={handleChange}
                            placeholder="Sukunimi"
                            required
                        />
                    </Form.Group>
                </Col>
            </Row>

            <Row>
                {!mobile ? (
                    <>
                        <Col>
                            <Form.Group controlId="formSyntymaaika" className="mb-3">  
                                <small>Syntymäaika *</small>
                                <Form.Control
                                    type="date"
                                    name="syntymaaika"
                                    value={formData.syntymaaika}
                                    onChange={handleChange}
                                    min={birthdayMin}
                                    max={birthdayMax}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        {!foreignSSN ? (
                            <Col className="col-3">
                                <Form.Group controlId="formSotu" className="mb-3">  
                                    <small>{!mobile ? "Henkilötunnuksen loppuosa *" : "Loppuosa *"}</small>
                                    <Form.Control
                                        type="text"
                                        name="sotu"
                                        value={formData.sotu.startsWith("A") ? formData.sotu : "A" + formData.sotu}
                                        onChange={handleChange}
                                        maxLength={5}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        ) : (
                            <Col>
                                <Form.Group controlId="formUlkomainen_henkilotunnus" className="mb-3">  
                                    <small>Ulkomainen henkilötunnus *</small>
                                    <Form.Control
                                        type="text"
                                        name="ulkomainen_henkilotunnus"
                                        value={formData.ulkomainen_henkilotunnus}
                                        placeholder="Henkilötunnus"
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        )}

                        <Col className="col-1 d-flex justify-content-center text-center">
                            <Form.Group controlId="formUlkomainen_ssn" className="mb-3">
                                <Row>
                                    <small className="text-start">Ulkomainen henkilötunnus?</small> 
                                    <Form.Check
                                        type="switch"
                                        id="ulkomainen_ssn"
                                        name="ulkomainen_ssn"
                                        checked={foreignSSN}
                                        onChange={(e) => {
                                            const checked = e.target.checked
                                            setForeignSSN(checked)
                                            handleChange({
                                                target: {
                                                    name: "ulkomainen_ssn",
                                                    value: checked
                                                }
                                            })
                                        }}
                                    />
                                </Row>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formKieli" className="mb-3">
                                <small>Äidinkieli *</small>
                                {!otherLanguage ? (
                                    <Form.Select
                                        name="kieli"
                                        value={formData.kieli}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Äidinkieli *</option>
                                        {languages.map((lang, index) => (
                                            <option key={index} value={lang}>
                                                {lang}
                                            </option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Group controlId="formKieli" className="mb-3">
                                        <Form.Control
                                            type="text" 
                                            name="kieli" 
                                            value={formData.kieli}
                                            onChange={handleChange}
                                            placeholder="Muu, mikä?" 
                                            required 
                                        /> 
                                    </Form.Group>
                                )}
                            </Form.Group>
                        </Col>
                    </>
                ) : (
                    <>
                        <Col className="col-6">
                            <Form.Group controlId="formSyntymaaika">  
                                <small>Syntymäaika *</small>
                                <Form.Control
                                    type="date"
                                    name="syntymaaika"
                                    value={formData.syntymaaika}
                                    onChange={handleChange}
                                    min={birthdayMin}
                                    max={birthdayMax}
                                    required
                                />
                            </Form.Group>
                        </Col>

                        {!foreignSSN ? (
                            <Col className="col-6">
                                <Form.Group controlId="formSotu" className="mb-3">  
                                    <small>{!mobile ? "Henkilötunnuksen loppuosa *" : "Loppuosa *"}</small>
                                    <Form.Control
                                        type="text"
                                        name="sotu"
                                        value={formData.sotu.startsWith("A") ? formData.sotu : "A" + formData.sotu}
                                        onChange={handleChange}
                                        maxLength={5}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        ) : (
                            <Col className="col-6">
                                <Form.Group controlId="formUlkomainen_henkilotunnus" className="mb-3">  
                                    <small>Henkilötunnus *</small>
                                    <Form.Control
                                        type="text"
                                        name="ulkomainen_henkilotunnus"
                                        value={formData.ulkomainen_henkilotunnus}
                                        placeholder="Ulkomainen henkilötunnus"
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        )}

                        <Col className="col-4 d-flex justify-content-center text-center">
                            <Form.Group controlId="formUlkomainen_ssn" className="mb-3">
                                <Row>
                                    <small className="text-start">Ulkomainen henkilötunnus?</small> 
                                    <Form.Check
                                        type="switch"
                                        id="ulkomainen_ssn"
                                        name="ulkomainen_ssn"
                                        checked={foreignSSN}
                                        onChange={(e) => {
                                            const checked = e.target.checked
                                            setForeignSSN(checked)
                                            handleChange({
                                                target: {
                                                    name: "ulkomainen_ssn",
                                                    value: checked
                                                }
                                            })
                                        }}
                                    />
                                </Row>
                            </Form.Group>
                        </Col>

                        <Col className="col-8">
                            <Form.Group controlId="formKieli" className="mb-3">
                                <small>Äidinkieli *</small>
                                {!otherLanguage ? (
                                    <Form.Select
                                        name="kieli"
                                        value={formData.kieli}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Äidinkieli *</option>
                                        {languages.map((lang, index) => (
                                            <option key={index} value={lang}>
                                                {lang}
                                            </option>
                                        ))}
                                    </Form.Select>
                                ) : (
                                    <Form.Group controlId="formKieli" className="mb-3">
                                        <Form.Control
                                            type="text" 
                                            name="kieli" 
                                            value={formData.kieli}
                                            onChange={handleChange}
                                            placeholder="Muu, mikä?" 
                                            required 
                                        /> 
                                    </Form.Group>
                                )}
                            </Form.Group>
                        </Col>
                    </>
                )}
            </Row>

            <Row>
                <Col className={!mobile ? "col-4" : "col-6"}>
                    <Form.Group controlId="formOsoite" className="mb-3">  
                        <small>Katuosoite *</small>
                        <Form.Control
                            type="text"
                            name="katuosoite"
                            value={formData.katuosoite}
                            onChange={handleChange}
                            placeholder="Kotiosoite"
                            required
                        />
                    </Form.Group>
                </Col>
                <Col className={!mobile ? "col-4" : "col-6"}>
                    <Form.Group controlId="formPostinumero" className="mb-3">  
                        <small>Postinumero *</small>
                        <Form.Control
                            type="text"
                            name="postinumero"
                            value={formData.postinumero}
                            onChange={handleChange}
                            placeholder="Postinumero"
                            required
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group controlId="formLemmikit" className="mb-3">
                        <small>Lemmikkieläimet</small>
                        <Form.Control
                            type="text"
                            name="lemmikit"
                            value={formData.lemmikit}
                            onChange={handleChange}
                            placeholder="Lemmikkieläimet"
                        />
                    </Form.Group>
                </Col>
            </Row>
        </div>
    )
}

export default ChildData