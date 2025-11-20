import { useState, useEffect, useRef } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { dayCareFormValues, daycareOptions } from "./formFields/formValues"
import ChildData from "./formFields/ChildData"
import FirstParentData from "./formFields/FirstParentData"
import SecondParentData from "./formFields/SecondParentData"
import FamilyConnections from "./formFields/FamilyConnections"
import ChildHealthData from "./formFields/ChildHealthData"
import { CREATE_FORM } from "../../queries/queries"
import { useMutation } from '@apollo/client/react'
import ApplicationModal from "../../modals/ApplicationModal"

const DayCareForm = ({ setShowFormArea, formType, setFormType, setConfirmTitle, setOnConfirm, mobile, width, portrait }) => {
    const [otherLanguage, setOtherLanguage] = useState(false)
    const [formData, setFormData] = useState(dayCareFormValues)
    const [otherParent, setOtherParent] = useState(false)
    const [allFilled, setAllFilled] = useState(false)
    const dayCareFormRef = useRef(null)
    const [application, setApplication] = useState()
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
        const dayCareForm = dayCareFormRef.current
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

        const filled = Array.from(dayCareForm.querySelectorAll('[required]'))
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
        try {
            const response = await createForm({
                variables: {
                    formType,
                    input: formData
                }
            })

            if (response.error.errors?.length > 0) {
                throw new Error(response.error.errors.map(e => e.message).join('; '))
            }
            
            if (response.data) {
                setConfirmTitle("Lomake lähetetty.")
                setFormData(dayCareFormValues)
                setFormType(null)
                setAllFilled(false)
                setShowFormArea(false)
            }
        } catch (err) { setConfirmTitle(`Virhe: ${err}`) }
    }

    const generateTimes = (start = 6.5, end = 17, step = 0.5) => {
        const times = []
        for (let t = start; t <= end; t += step) {
            const hours = Math.floor(t)
            const minutes = t % 1 === 0.5 ? "30" : "00"
            const value = `${hours}:${minutes}`
            times.push(value)
        }
        return times
    }

    const times = generateTimes()

    const toMinutes = (time) => {
        if (!time) return 0
        const [hours, minutes] = time.split(':').map(Number)
        return hours * 60 + minutes
    }


    return (
        <>
            <div className="d-flex align-items-center justify-content-between mb-3 position-relative">
                {!mobile ? (
                    <>
                        <h3 className="m-0 position-absolute top-50 start-50 translate-middle">
                            Varhaiskasvatushakemus
                        </h3>
                        <Button 
                            className="ms-auto"

                            style={{ width: '10vw' }}
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
                                Varhaiskasvatushakemus
                            </h4>
                        </Col>
                        <Col className="col-2">
                            <Button
                                className="align-self-end"
                                style={{ width: '20vw' }}
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
            <Form onSubmit={handleConfirm} className="text-start" ref={dayCareFormRef} style={{ width: "100%", margin: "0 auto" }}>
{/* LAPSEN TIEDOT */}
                <Row className="mb-2">
                    <Col>  
                        <p className={allFilled ? "text-success" : "text-danger"}>HUOM! * merkityt ovat pakollisia tietoja!</p>
                        <Form.Label><strong>Lapsen henkilötiedot</strong></Form.Label>
                    </Col>
                </Row>
    {/* LAPSEN HENKILÖTIEDOT*/}
                <ChildData formData={formData} handleChange={handleChange} otherLanguage={otherLanguage} formType={formType} mobile={mobile} />
{/* VANHEMPIEN TIEDOT */ }
                <Row className="mb-3 mt-3">
                    <Col>  
                        <Form.Label><strong>Huoltajien henkilötiedot</strong></Form.Label><br />
                        <strong><small>Huoltajan tiedot</small></strong>
                    </Col>
                </Row>
    {/* ENSIMMÄISEN VANHEMMAN HENKILÖTIEDOT*/}
                <FirstParentData formData={formData} handleChange={handleChange} otherParent={otherParent} setOtherParent={setOtherParent} />
    {/* TOISEN VANHEMMAN HENKILÖTIEDOT (TARVITTAESSA)*/}
                {otherParent && 
                <>
                    <Row className="mb-3 mt-3">
                        <Col>  
                            <strong><small>Toisen huoltajan tiedot</small></strong>
                        </Col>
                    </Row>

                    <SecondParentData formData={formData} handleChange={handleChange} />
                </>}
{/* PERHESUHDE JA ASUMINEN */}

                <FamilyConnections formData={formData} handleChange={handleChange} />

{/* HOITOAIKA */}
                <div className="text-start">
                    <Row className="mb-2 mt-4">
                        <Col>  
                            <Form.Label><strong>Toivottu päivähoitomuoto ja -aika</strong></Form.Label>
                        </Col>
                    </Row>
    {/* HOITOMUOTO */}                            
                    <Row>
                        <Col>
                            <Form.Group controlId="formTarve" className="mb-3">
                                <small>Varhaiskasvatuksen tarve *</small>
                                <Form.Select
                                    name="tarve"
                                    value={formData.tarve}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Valitse *</option>
                                    {daycareOptions.map((need, index) => (
                                        <option key={index} value={need}>
                                            {need}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
        {/* HOITOPÄIVÄT */}                            
                        <Col>
                            <Form.Group controlId="formPaivat" className="mb-3">
                                <small>Hoitopäivien lukumäärä / kk *</small>
                                <Form.Select
                                    name="paivat"
                                    value={formData.paivat}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="" disabled>Valitse *</option>
                                    {(() => {
                                    let max = 10
                                    if (formData.tarve === "Enintään 15 pv/kk") {
                                        max = 15
                                    } else if (formData.tarve === "Kokopäivähoito") max = 23
                                    return Array.from({ length: max }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>
                                        {i + 1 + (i+1 === 1 ? ' päivä / kk' : ' päivää / kk')}
                                        </option>
                                    ))
                                    })()}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
        {/* HOITOAJAT */}                            
                    <Row>
                        <Col>
                            <Form.Group controlId="formAlkamispaiva" className="mb-3">
                                <small>Hoidon tarpeen alkamispäivä *</small>
                                <Form.Control
                                    type="date"
                                    name="alkamispaiva"
                                    value={formData.alkamispaiva}
                                    onChange={handleChange}
                                    required
                                    min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]}
                                />
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formAlkamisaika" className="mb-3">
                                <small value="">Hoitopäivä alkaa *</small>
                                <Form.Select
                                    name="alkamisaika"
                                    value={formData.alkamisaika}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">klo: *</option>
                                    {times.map((time) => (
                                        <option 
                                            key={time} 
                                            value={time}
                                            disabled={
                                                formData.paattymisaika &&
                                                toMinutes(time) >= toMinutes(formData.paattymisaika)
                                            }
                                        >
                                            {time}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                        <Col>
                            <Form.Group controlId="formPaattymisaika" className="mb-3">
                                <small value="">Hoitopäivä päättyy *</small>
                                <Form.Select
                                    name="paattymisaika"
                                    value={formData.paattymisaika}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">klo: *</option>
                                    {times.map((time) => (
                                        <option 
                                            key={time} 
                                            value={time}
                                            disabled={
                                                formData.alkamisaika &&
                                                toMinutes(time) <= toMinutes(formData.alkamisaika)
                                            }
                                        >
                                            {time}
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

                    {!onlyChild &&<Row className="mb-3">
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

export default DayCareForm