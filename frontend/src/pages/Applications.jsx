import { Button, Row, Col } from "react-bootstrap"
import { useState, useEffect } from "react"
import ServiceVoucher from "./forms/ServiceVoucher"
import DayCareForm from "./forms/DayCareForm"
import PreSchoolForm from "./forms/PreschoolForm"
import elama from '../assets/elama_on_kasvun_aikaa.png'
import useWindowWidth from "../hooks/useWindowWidth"
import { Modal } from "react-bootstrap"
import { useLocation } from "react-router-dom"

const Applications = ({ setConfirmTitle, setOnConfirm, mobile, portrait }) => {
    const [showModal, setShowModal] = useState(false)
    const [showFormArea, setShowFormArea] = useState(false)
    const [formType, setFormType] = useState(null)
    const { state } = useLocation()
    const width = useWindowWidth()

    useEffect(() => {
        if (state === 'fromFrontPage') {
            setFormType('psh')
            setShowFormArea(true)
        }
    }, [state])

    const buttonStyle = {
        width: (mobile && width > 576 && !portrait) ? '30vw' : mobile ? "55vw" : "20vw",
        height: (mobile && width > 576 && !portrait) ? '10vh' : mobile ? "6vh" : "4vh",
        border: '1px solid green',
        padding: '0px',
        margin: mobile ? '10px' : '0px'
    }

    useEffect(() => {
        const read = sessionStorage.getItem("appInfo") === "true"

        if (mobile && !read) {
            setShowModal(true)
            sessionStorage.setItem("appInfo", "true")
        }

    }, [mobile])

    const handleFormVisibility = (formName) => {
        setShowFormArea(true)
        setFormType(formName)
    }

    return (
        <>
            {!mobile ? (
                <>
                    <div className="container-fluid h-100 p-0 d-flex justify-content-center content content-text mt-5" style={{ width: '100vw' }}>
                        <div className="container applications-container text-center">
                            <div className="row">
                                {formType === null && <h2 className="mt-4 mb-4">Hakemukset</h2>}
                                {formType === 'psh' && <h2 className="mt-4 mb-2">Palvelusetelihakemus</h2>}
                            </div>
                            {!showFormArea && 
                                <>
                                    <div className="row d-flex justify-content-center gap-5">
                                        <Button variant="warning" style={buttonStyle} onClick={() => handleFormVisibility('vkh')}>
                                            <strong className="text-white">Varhaiskasvatushakemus</strong>
                                        </Button>

                                        <Button variant="info" style={buttonStyle} onClick={() => handleFormVisibility('ekh')}>
                                            <strong className="text-white">Esikouluhakemus</strong>
                                        </Button>

                                        <Button variant="success" style={buttonStyle} onClick={() => handleFormVisibility('psh')}>
                                            <strong className="text-white">Palvelusetelihakemus</strong>
                                        </Button>
                                    </div>

                                    <div className="row mt-4">
                                        <div className="col-8 offset-2">
                                            <strong>Voit täyttää esi- tai varhaiskasvatuksen hakemuksen yllä olevista painikkeista ja lähettää sen meille,
                                                tai tutustua yksityisen päiväkodin varhaiskaskasvatuksen palveluseteliin Mikkelin kaupungin sivuilta.
                                            </strong>
                                        </div>
                                    </div>
                                </>
                            }

                            {showFormArea && (
                                <div
                                    className="container-fluid h-100 p-0 d-flex align-items-center justify-content-center content"
                                    style={formType !== 'psh' ? { width: '100%' } : { width: '576px', height: '400px' }}
                                >
                                <div className="container text-center mt-5 form-area p-5 form-shadow"
                                    style={formType === 'psh' ? { height: '300px' } : {}}
                                >
                                    {formType === 'psh' && <ServiceVoucher setShowFormArea={setShowFormArea} setFormType={setFormType} mobile={mobile} state={state} />}
                                    {formType === 'vkh' && <DayCareForm
                                        setShowFormArea={setShowFormArea} formType={formType}
                                        setFormType={setFormType} setConfirmTitle={setConfirmTitle}
                                        setOnConfirm={setOnConfirm} portrait={portrait}
                                    />}
                                    {formType === 'ekh' && <PreSchoolForm
                                        setShowFormArea={setShowFormArea} formType={formType}
                                        setFormType={setFormType} setConfirmTitle={setConfirmTitle}
                                        setOnConfirm={setOnConfirm} portrait={portrait}
                                    />}
                                </div>
                            </div>)}
                        </div>
                    </div>
                    <div className="position-relative">
                        <img 
                            src={elama} 
                            alt="Elämä on kasvun aikaa"
                            style={{
                                position: 'fixed',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -15%)',
                                width: 500,
                                height: 400,
                                zIndex: -1
                            }}
                        />
                    </div>
                </>
            ) : (
                <Row className="applications-container mobile-form content-text mt-3">
                    <Row className={(formType === null) && (width < 576) ? "text-start" : "text-center mt-3"}>
                        {formType === 'psh' && <h2>Palvelusetelihakemus</h2>}
                    </Row>
                    {!showFormArea && 
                        <>
                            <Row className="mt-2">
                                <Col className="col-7 text-end">
                                    <h2 className={portrait ? "mb-5" : ""}>Hakemukset</h2>
                                </Col>

                                <Col className={(width < 576 || portrait) ? "text-start ms-3" : "text-end"}>
                                    <Button variant="warning" style={buttonStyle} onClick={() => handleFormVisibility('vkh')}>
                                        <strong className="text-white">Varhaiskasvatushakemus</strong>
                                    </Button>
                                </Col>
                            </Row>

                            <Row>
                                <Col className={(width < 576 || portrait) ? "ms-2 text-center" : "text-end"}>
                                    <Button variant="info" style={buttonStyle} onClick={() => handleFormVisibility('ekh')}>
                                        <strong className="text-white">Esikouluhakemus</strong>
                                    </Button>
                                </Col>
                            </Row>

                            <Row className="me-3">
                                <Col className="ms-1 text-end">
                                    <Button variant="success" style={buttonStyle} onClick={() => handleFormVisibility('psh')}>
                                        <strong className="text-white">Palvelusetelihakemus</strong>
                                    </Button>
                                </Col>
                            </Row>
                        </>
                    }

                    {showFormArea && (
                        <div>
                            {formType === 'psh' && <ServiceVoucher setShowFormArea={setShowFormArea} setFormType={setFormType} mobile={mobile} />}
                            {formType === 'vkh' && <DayCareForm
                                setShowFormArea={setShowFormArea} formType={formType}
                                setFormType={setFormType} setConfirmTitle={setConfirmTitle}
                                setOnConfirm={setOnConfirm} mobile={mobile} width={width}
                            />}
                            {formType === 'ekh' && <PreSchoolForm
                                setShowFormArea={setShowFormArea} formType={formType}
                                setFormType={setFormType} setConfirmTitle={setConfirmTitle}
                                setOnConfirm={setOnConfirm} mobile={mobile}
                            />}
                        </div>
                    )}


                    {formType === null &&
                        <img 
                            src={elama} 
                            alt="Elämä on kasvun aikaa"
                            style={{
                                position: 'absolute',
                                bottom: portrait ? '35%' : (width < 576) ? '11vh' : '17vh',
                                left: portrait ? '25%' : 0,
                                maxWidth: portrait ? '50%' : (width < 576) ? width : (width / 3),
                                zIndex: -1
                            }}
                        />
                    }
                </Row>
            )}

            {mobile && !state &&
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body className="content-text">
                    Voit täyttää esi- tai varhaiskasvatuksen hakemuksen sivun painikkeista ja lähettää sen meille,
                        tai tutustua yksityisen päiväkodin varhaiskaskasvatuksen palveluseteliin Mikkelin kaupungin sivuilta.
                </Modal.Body>
                <Modal.Footer className="align-items-center justify-content-center">
                    <Button variant="primary" onClick={() => setShowModal(false)}>
                        Sulje
                    </Button>
                </Modal.Footer>
            </Modal>}
        </>
    )
}


export default Applications