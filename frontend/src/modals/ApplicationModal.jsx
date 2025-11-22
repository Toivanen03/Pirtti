import { Form, Modal, Row, Col, Button } from 'react-bootstrap'
import { useState } from 'react'
import html2pdf from 'html2pdf.js'

const ApplicationModal = ({ application, setApplication, handler, handleSubmit, handleMarkRead }) => {
    if (!application) return null

    const [print, setPrint] = useState(false)
    const show = !!application

    const handleClose = () => setApplication(null)

    const formatDate = (date) => {
        return new Date(Number(date)).toLocaleDateString('fi-FI')
    }

    const formatSSN = (date) => {
        const dateStr = date.replace(/\-/g, '')
        const dd = dateStr.slice(6, 8)
        const mm = dateStr.slice(4, 6)
        const yy = dateStr.slice(2, 4)
        return dd + mm + yy + application.sotu
    }

    const handlePrint = (task) => {
        setPrint(true)
        const element = document.getElementById('application-modal')
        const options = {
            margin: 0.5,
            filename: `${application.sukunimi_lapsi}_${application.etunimet_lapsi}_${formatDate(application.syntymaaika)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().from(element).set(options).toPdf().get('pdf').then((pdf) => {
            if (task === 'print') {
                const blobUrl = pdf.output('bloburl')
                const printWindow = window.open(blobUrl)
                printWindow.focus()
            } else {
                pdf.save()
            }
        }).finally(() => {
            setPrint(false)
            handleClose()
        })
    }

    return (
        <Modal id="application-modal" show={show} onHide={handleClose} size="xl" centered>
            <Modal.Header closeButton>
                <Modal.Title>{application.formType === 'vkh' ? 'Päivähoitohakemus' : 'Esikouluhakemus'}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <h5>Lapsen tiedot</h5>
                    <Row>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Etunimet</Form.Label>
                                <Form.Control type="text" readOnly value={application.etunimet_lapsi} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Sukunimi</Form.Label>
                                <Form.Control type="text" readOnly value={application.sukunimi_lapsi} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Syntymäaika</Form.Label>
                                <Form.Control type="text" readOnly value={formatDate(application.syntymaaika)} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Henkilötunnus</Form.Label>
                                <Form.Control type="text" readOnly value={application.ulkomainen_ssn ? application.ulkomainen_henkilotunnus : formatSSN(application.syntymaaika)} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Kieli</Form.Label>
                                <Form.Control type="text" readOnly value={application.kieli} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-2">
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Kotiosoite</Form.Label>
                                <Form.Control type="text" readOnly value={application.katuosoite} />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Postinumero</Form.Label>
                                <Form.Control type="text" readOnly value={application.postinumero} />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Lemmikit</Form.Label>
                                <Form.Control type="text" readOnly value={application.lemmikit || 'Ei ole'} />
                            </Form.Group>
                        </Col>
                    </Row>

                    <h5 className="mt-3">{application.etunimet_aikuinen_2 ? 'Ensimmäisen huoltajan tiedot' : 'Huoltajan tiedot'}</h5>

                    <Row className="mt-2">
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Etunimet</Form.Label>
                                <Form.Control type="text" readOnly value={application.etunimet_aikuinen_1} />
                            </Form.Group>
                        </Col>
                        <Col md={3}>
                            <Form.Group>
                                <Form.Label>Sukunimi</Form.Label>
                                <Form.Control type="text" readOnly value={application.sukunimi_aikuinen_1} />
                            </Form.Group>
                        </Col>
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>Puhelin</Form.Label>
                                <Form.Control type="text" readOnly value={application.puhelinnumero_aikuinen_1} />
                            </Form.Group>
                        </Col>
                        <Col md={4}>
                            <Form.Group>
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="text" readOnly value={application.sahkoposti_aikuinen_1} />
                            </Form.Group>
                        </Col>
                    </Row>

                    {application.etunimet_aikuinen_2 && (
                        <>
                            <h5 className="mt-3">Toisen huoltajan tiedot</h5>
                            <Row className="mt-2">
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Etunimet</Form.Label>
                                        <Form.Control type="text" readOnly value={application.etunimet_aikuinen_2} />
                                    </Form.Group>
                                </Col>
                                <Col md={3}>
                                    <Form.Group>
                                        <Form.Label>Sukunimi</Form.Label>
                                        <Form.Control type="text" readOnly value={application.sukunimi_aikuinen_2} />
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label>Puhelin</Form.Label>
                                        <Form.Control type="text" readOnly value={application.puhelinnumero_aikuinen_2} />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="text" readOnly value={application.sahkoposti_aikuinen_2} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}

                    {application.lisatiedot && (
                        <Row className="mt-3">
                            <Col>
                                <Form.Group>
                                    <Form.Label>Muut lisätiedot</Form.Label>
                                    <Form.Control as="textarea" readOnly value={application.lisatiedot} rows={3} />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}
                </Form>
            </Modal.Body>

            <Modal.Footer>
                {handleSubmit && <Button variant="primary" onClick={handleSubmit}>Hyväksy</Button>}
                <Button variant="secondary" onClick={handleClose}>Sulje</Button>
                <Button variant="success" onClick={() => handlePrint('download')}>Lataa PDF</Button>
                <Button variant="info" onClick={() => handlePrint('print')}>Tulosta</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default ApplicationModal