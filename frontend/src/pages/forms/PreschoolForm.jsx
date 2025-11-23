import { useState, useEffect, useRef } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { preSchoolFormValues, preschoolDaycare, preSchoolTransportation } from "./formFields/formValues"
import ChildData from "./formFields/ChildData"
import FirstParentData from "./formFields/FirstParentData"
import SecondParentData from "./formFields/SecondParentData"
import FamilyConnections from "./formFields/FamilyConnections"
import ChildHealthData from "./formFields/ChildHealthData"
import { CREATE_FORM } from "../../queries/queries"
import { useMutation } from '@apollo/client/react'
import ApplicationModal from "../../modals/ApplicationModal"
import { runMutation } from "../../utils/runMutation"

const PreSchoolForm = ({ setShowFormArea, formType, setFormType, setConfirmTitle, setOnConfirm, mobile, width, portrait }) => {
    const [otherLanguage, setOtherLanguage] = useState(false)
    const [formData, setFormData] = useState(preSchoolFormValues)
    const [otherParent, setOtherParent] = useState(false)
    const [application, setApplication] = useState()
    const [allFilled, setAllFilled] = useState(false)
    const preSchoolFormRef = useRef(null)
    const [createForm] = useMutation(CREATE_FORM)
    const [onlyChild, setOnlyChild] = useState('')

    useEffect(() => {
        if (formData.kieli === "Muu...") {
            setFormData(prev => ({ ...prev, kieli: "" }))
            setOtherLanguage(true)
        }

        if (formData.asuminen === "Lapsi asuu toisen huoltajan kanssa") {
            setOtherParent(true)
        }

        setFormData(prev => ({
            ...prev,
            muut_lapset: onlyChild === 'Ainoa lapsi' ? 'Ainoa lapsi' : prev.muut_lapset
        }))
    }, [formData.kieli, formData.asuminen, onlyChild])

    const handleChange = (e) => {
        const preSchoolForm = preSchoolFormRef.current
        let { name, value } = e.target

        if (name === "sotu") {
            if (/[a-zA-Z]$/.test(value)) {
                value = value.slice(0, -1) + value.slice(-1).toUpperCase()
            }
        }
        
        setFormData(prev => ({
            ...prev,
            [name]: value === "true" ? true : value === "false" ? false : value
        }))

        const filled = Array.from(preSchoolForm.querySelectorAll('[required]'))
            .every(input => input.value.trim() !== '')

        if (filled) setAllFilled(true)
    }

    const handleConfirm = async (e) => {
        e.preventDefault()
        setConfirmTitle(`Tarkista, että antamasi tiedot ovat oikein.`)
        setOnConfirm(() => async () => {
            setApplication(formData)
        })
    }

    const handleSubmit = async () => {
        const response = await runMutation(createForm, {
            variables: {
                formType,
                input: formData
            }
        })

        if (!response.ok) {
            setConfirmTitle(`Virhe: ${response.error}`)
            return
        }
        
        setConfirmTitle("Lomake lähetetty.")
        setFormData(preSchoolFormValues)
        setFormType(null)
        setAllFilled(false)
        setShowFormArea(false)
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-3 position-relative">
                {!mobile ? (
                    <>
                        <h3 className="m-0 position-absolute top-50 start-50 translate-middle">
                            Esikouluhakemus
                        </h3>
                        <Button 
                            className="ms-auto"
                            style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }}
                            variant="secondary"
                            onClick={() => {
                                setShowFormArea(false)
                                setFormType(null)
                            }}
                        >
                            Sulje
                        </Button>
                    </>
                ) : (
                    <Row className={(width < 576) ? "d-flex align-items-center mb-2" : "d-flex align-items-center mt-3 ms-5"}>
                        <Col className="col-9 ms-1">
                            <h4 className="text-center">
                                Esikouluhakemus
                            </h4>
                        </Col>
                        <Col className="col-2">
                            <Button
                                className="align-self-end"
                                style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }}
                                variant="secondary"
                                onClick={() => {
                                    setShowFormArea(false)
                                    setFormType(null)
                                }}
                            >
                                Sulje
                            </Button>
                        </Col>
                    </Row>
                )}
            </div>
            <div className={!mobile ? "d-flex flex-column justify-content-center text-start" : "mobile-form mb-5"}>
            <Form ref={preSchoolFormRef} onSubmit={handleConfirm} className="text-start" style={{ width: "100%", margin: "0 auto" }}>
{/* LAPSEN TIEDOT */}
                <Row className="mb-2">
                    <Col>  
                        <p className={allFilled ? "text-success" : "text-danger"}>HUOM! * merkityt ovat pakollisia tietoja!</p>
                        <Form.Label><strong>Lapsen henkilötiedot</strong></Form.Label>
                    </Col>
                </Row>

                <ChildData formData={formData} handleChange={handleChange} otherLanguage={otherLanguage} formType={formType} mobile={mobile} />

{/* HUOLTAJAT */}
                <Row className="mb-3 mt-3">
                    <Col>  
                        <Form.Label><strong>Huoltajien henkilötiedot</strong></Form.Label><br />
                        <strong><small>Huoltajan tiedot</small></strong>
                    </Col>
                </Row>

                <FirstParentData formData={formData} handleChange={handleChange} otherParent={otherParent} setOtherParent={setOtherParent} />

                {otherParent && 
                <>
                    <Row className="mb-3 mt-3">
                        <Col>  
                            <strong><small>Toisen huoltajan tiedot</small></strong>
                        </Col>
                    </Row>

                    <SecondParentData formData={formData} handleChange={handleChange} />
                </>}

{/* PERHESUHDE */}
                <FamilyConnections formData={formData} handleChange={handleChange} />

{/* VARHAISKASVATUS JA KULJETUS */}
                <div className="text-start">
                    <Row className="mb-2 mt-4">
                        <Col>  
                            <Form.Label><strong>Varhaiskasvatuksen ja kuljetuksen tarve</strong></Form.Label>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formPaivahoito" className="mb-3">
                                <small>Päivähoidon tarve *</small>
                                <Form.Select
                                    name="paivahoito"
                                    value={formData.paivahoito}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Valitse *</option>
                                    {preschoolDaycare.map((need, index) => (
                                        <option key={index} value={need}>
                                            {need}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formKuljetus" className="mb-3">
                                <small>Kuljetuksen tarve *</small>
                                <Form.Select
                                    name="kuljetus"
                                    value={formData.kuljetus}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Valitse *</option>
                                    {preSchoolTransportation.map((transportation, index) => (
                                        <option key={index} value={transportation}>
                                            {transportation}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

{/* MUUT LAPSET */}
                    <Row className="mb-3 mt-3">
                        <Col className="d-flex flex-row">
                            <Col className={!mobile ? "col-2" : "col-7"}>
                                <Form.Label><strong>Perheen muut lapset *</strong></Form.Label>
                            </Col>

                            <Col className={!mobile ? "col-1" : "col-3"}>
                                <small>Ainoa lapsi</small>
                            </Col>

                            <Col className={!mobile ? "col-1" : "col-2"}>
                                <Form.Group controlId="formEi_muita_lapsia">
                                    <Form.Check
                                        type="switch"
                                        id="ei_muita_lapsia"
                                        name="ei_muita_lapsia"
                                        checked={onlyChild === 'Ainoa lapsi'}
                                        onChange={() => setOnlyChild(onlyChild === '' ? 'Ainoa lapsi' : '')}
                                    />
                                </Form.Group>
                            </Col>
                        </Col>
                    </Row>

                    {!onlyChild && <Row className="mb-3">
                        <Col>
                            <Form.Group controlId="formMuut_lapset" className="mb-3">
                                <small>Kotona asuvien alle 18-vuotiaiden lasten nimet, syntymäajat sekä alle kouluikäisten päivähoitopaikat: *</small>
                                <Form.Control
                                    as="textarea"
                                    rows={!mobile ? 4 : 2}
                                    name="muut_lapset"
                                    value={onlyChild === '' ? formData.muut_lapset : onlyChild}
                                    onChange={handleChange}
                                    placeholder="Nimet, syntymäajat sekä päivähoitopaikat:"
                                    required
                                    disabled={onlyChild}
                                />
                            </Form.Group>
                        </Col>
                    </Row>}

{/* TERVEYDENTILA */}
                    <ChildHealthData formData={formData} handleChange={handleChange} mobile={mobile} />

{/* PAINIKKEET */}
                    <div className="d-flex gap-3 align-items-center">
                        <Button variant="primary" type="submit" style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }}>Lähetä</Button>
                        <Button variant="secondary" style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }} onClick={() => { setShowFormArea(false); setFormType(null); }}>Peruuta</Button>
                        {(!allFilled && !mobile) && <span className="text-danger ms-4">Täytä kaikki pakolliset kentät ennen lähettämistä.</span>}
                    </div>
                </div>
            </Form>
            </div>
            <ApplicationModal application={application} setApplication={setApplication} handleSubmit={handleSubmit} mobile={mobile} portrait={portrait} />
        </>
    )
}

export default PreSchoolForm