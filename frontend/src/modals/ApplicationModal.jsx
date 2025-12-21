import { Form, Modal, Col, Row, Button } from 'react-bootstrap'
import { formatDate } from '../pages/Admin'
import html2pdf from 'html2pdf.js'
import { useState } from 'react'

const ApplicationModal = ({ application, setApplication, handler, handleSubmit, handleMarkRead, mobile, portrait, loading }) => {
    if (!application) return
    const show = !!application
    const handleClose = () => setApplication(null)
    const submitForm = () => handleSubmit()
    const [print, setPrint] = useState(false)

    const formatSSN = (date) => {
        const dateStr = date.replace(/\-/g, '')
        const dd = dateStr.slice(6, 8)
        const mm = dateStr.slice(4, 6)
        const yy = dateStr.slice(2, 4)
        return dd + mm + yy + application.sotu
    }

    const handlePrint = (task) => {
        const element = document.getElementById('application-modal')
        const options = {
            margin: 0.5,
            filename: `${application.formType === 'vkh' ? 'VK_HAKEMUS' : 'EK_HAKEMUS'}_${application.sukunimi_lapsi}_${application.etunimet_lapsi}_${formatDate(application.syntymaaika)}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        }

        html2pdf()
            .from(element)
            .set(options)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                const totalPages = pdf.internal.getNumberOfPages()
                const pageWidth = pdf.internal.pageSize.getWidth()
                const pageHeight = pdf.internal.pageSize.getHeight()
                const yFooter = pageHeight - 0.3
                const margin = 0.4
                const sectionWidth = (pageWidth - 2 * margin) / 4

                for (let i = 1; i <= totalPages; i++) {
                    pdf.setPage(i)
                    pdf.setFontSize(10)

                    pdf.text(`id: ${application.id}`, margin + sectionWidth / 2, yFooter, { align: 'center' })

                    if (i === totalPages) {
                        if (application.createdAt !== application.updatedAt) {
                            pdf.text(`Käsitelty ${formatDate(Number(application.updatedAt))}`, margin + 1.7 * sectionWidth, yFooter, { align: 'center' })
                        }
                        if (handler) {
                            pdf.text(`Käsittelijä: ${handler}`, margin + 2.9 * sectionWidth, yFooter, { align: 'center' })
                        }
                    }

                    pdf.text(`Sivu ${i}/${totalPages}`, margin + 3.9 * sectionWidth, yFooter, { align: 'center' })
                }

                if (task === 'print') {
                    const blobUrl = pdf.output('bloburl')
                    const printWindow = window.open(blobUrl)
                    printWindow.focus()
                } else {
                    pdf.save()
                }
            })
            .finally(() => {
                setPrint(false)
                handleClose()
            })
    }

    return (
        <Modal id="application-modal" show={show} onHide={handleClose} size="xl" centered>
            {!handleSubmit &&
                <Modal.Header className={print ? 'row mb-2' : 'row mb-2 me-2'} closeButton>
                    <Col className="col-4 text-start justify-content-center">
                        {application.formType === 'vkh' && <Modal.Title>Päivähoitohakemus</Modal.Title>}
                        {application.formType === 'ekh' && <Modal.Title>Esikouluhakemus</Modal.Title>}
                    </Col>

                    {print && <Col className='col-3 text-center justify-content-center'>
                        <small>Tulostettu {new Date().toLocaleDateString('fi-FI')}</small>
                    </Col>}

                    <Col className={print ? 'col-5 text-end fw-bold justify-content-center' : 'col-7 text-end fw-bold justify-content-center'}>
                        Lähetetty{' '}
                        {new Date(Number(application.createdAt)).toLocaleDateString('fi-FI', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Col>
                </Modal.Header>
            }

            {!loading ? (
                <Modal.Body className="text-start">
                    <strong>Lapsen tiedot</strong>
                    <Form>
                        {/* RIVI 1 */}
                        <Row className="mt-2">
                            <Form.Group className={mobile ? "col-6 mb-2" : "col-4 mb-2"}>
                                <Form.Label htmlFor="etunimet"><small>Etunimet</small></Form.Label>
                                <Form.Control type="text" readOnly value={application.etunimet_lapsi} id="etunimet" />
                            </Form.Group>

                            <Form.Group className={mobile ? "col-6 mb-2" : "col-4 mb-2"}>
                                <Form.Label htmlFor="sukunimi"><small>Sukunimi</small></Form.Label>
                                <Form.Control type="text" readOnly value={application.sukunimi_lapsi} id="sukunimi" />
                            </Form.Group>

                            <Form.Group className={mobile ? "col-6 mb-2" : "col-4 mb-2"}>
                                <Form.Label htmlFor="syntymaaika"><small>Syntymäaika</small></Form.Label>
                                <Form.Control type="text" readOnly value={formatDate(application.syntymaaika)} id="syntymaaika" />
                            </Form.Group>
                        </Row>

                        {/* RIVI 2 */}
                        <Row className="mt-2">
                            <Form.Group className="col-6 mb-2">
                                <Form.Label htmlFor="sotu"><small>Henkilötunnus {application.ulkomainen_ssn && '(ulkomaalainen)'}</small></Form.Label>
                                <Form.Control
                                    type="text"
                                    readOnly
                                    value={!application.ulkomainen_ssn ? formatSSN(application.syntymaaika) : application.ulkomainen_henkilotunnus}
                                    id="sotu"
                                />
                            </Form.Group>

                            <Form.Group className="col-6 mb-2">
                                <Form.Label htmlFor="kieli"><small>Kieli</small></Form.Label>
                                <Form.Control type="text" readOnly value={application.kieli} id="kieli" />
                            </Form.Group>
                        </Row>

                        {/* RIVI 3 */}
                        <Row className="mt-2 mb-2">
                            <Form.Group className={mobile ? "col-8 mb-2" : "col-4 mb-2"}>
                                <Form.Label htmlFor="osoite"><small>Kotiosoite</small></Form.Label>
                                <Form.Control type="text" readOnly value={application.katuosoite} id="osoite" />
                            </Form.Group>

                            <Form.Group className={mobile ? "col-4 mb-2" : "col-2 mb-2"}>
                                <Form.Label htmlFor="postinro"><small>Postinumero</small></Form.Label>
                                <Form.Control type="text" readOnly value={application.postinumero} id="postinro" />
                            </Form.Group>

                            <Form.Group className={mobile ? "col-12 mb-2" : "col-6 mb-2"}>
                                <Form.Label htmlFor="lemmikit"><small>Lemmikit</small></Form.Label>
                                <Form.Control type="text" style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }} readOnly value={application.lemmikit || 'Ei ole'} id="lemmikit" />
                            </Form.Group>
                        </Row>

                        <strong>{!application.etunimet_aikuinen_2 ? 'Huoltajan' : 'Ensimmäisen huoltajan'} tiedot</strong>

                        {/* RIVI 4 */}
                        {!print ? (
                            <Row className="mt-2">
                                <Form.Group className={mobile ? "col-6 mb-2" : "col-3 mb-2"}>
                                    <Form.Label htmlFor="etunimet_1"><small>Etunimet</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.etunimet_aikuinen_1} id="etunimet_1" />
                                </Form.Group>

                                <Form.Group className={mobile ? "col-6 mb-2" : "col-3 mb-2"}>
                                    <Form.Label htmlFor="sukunimi_1"><small>Sukunimi</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.sukunimi_aikuinen_1} id="sukunimi_1" />
                                </Form.Group>

                                <Form.Group className={mobile ? "col-6 mb-2" : "col-2 mb-2"}>
                                    <Form.Label htmlFor="puhelin_1"><small>Puhelinnumero</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.puhelinnumero_aikuinen_1} id="puhelin_1" />
                                </Form.Group>

                                <Form.Group className={mobile ? "col-6 mb-2" : "col-4 mb-2"}>
                                    <Form.Label htmlFor="email_1"><small>Sähköpostiosoite</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.sahkoposti_aikuinen_1} id="email_1" />
                                </Form.Group>
                            </Row>
                        ) : (
                            <>
                                <Row className="mt-2">
                                    <Form.Group className="col-5 mb-2">
                                        <Form.Label htmlFor="etunimet_1"><small>Etunimet</small></Form.Label>
                                        <Form.Control type="text" readOnly value={application.etunimet_aikuinen_1} id="etunimet_1" />
                                    </Form.Group>

                                    <Form.Group className="col-7 mb-2">
                                        <Form.Label htmlFor="sukunimi_1"><small>Sukunimi</small></Form.Label>
                                        <Form.Control type="text" readOnly value={application.sukunimi_aikuinen_1} id="sukunimi_1" />
                                    </Form.Group>
                                </Row>

                                <Row>
                                    <Form.Group className="col-5 mb-2">
                                        <Form.Label htmlFor="puhelin_1"><small>Puhelinnumero</small></Form.Label>
                                        <Form.Control type="text" readOnly value={application.puhelinnumero_aikuinen_1} id="puhelin_1" />
                                    </Form.Group>

                                    <Form.Group className="col-7 mb-2">
                                        <Form.Label htmlFor="email_1"><small>Sähköpostiosoite</small></Form.Label>
                                        <Form.Control type="text" readOnly value={application.sahkoposti_aikuinen_1} id="email_1" />
                                    </Form.Group>
                                </Row>
                            </>
                        )}

                        {/* RIVI 5 */}
                        {!print ? (
                            <Row className="mt-2">
                                <Form.Group className={mobile ? "col-5 mb-2" : "col-3 mb-2"}>
                                    <Form.Label htmlFor="tyo_1"><small>Työllisyystilanne</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.tyollisyys_aikuinen_1} id="tyo_1" />
                                </Form.Group>

                                {(application.tyollisyys_aikuinen_1 === 'Opiskelija' ||
                                    application.tyollisyys_aikuinen_1 === 'Työssä') && (
                                    <>
                                        <Form.Group className={mobile ? "col-7 mb-2" : "col-4 mb-2"}>
                                            <Form.Label htmlFor="tyo_tai_koulu_1">
                                                <small>{application.tyollisyys_aikuinen_1 === 'Opiskelija' ? 'Oppilaitos / koulu' : 'Työnantaja'}</small>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                readOnly
                                                value={application.tyonantaja_tai_oppilaitos_aikuinen_1}
                                                id="tyo_tai_koulu_1"
                                            />
                                        </Form.Group>

                                        <Form.Group className="col-5 mb-2">
                                            <Form.Label htmlFor="tyoaika_1"><small>Työaika</small></Form.Label>
                                            <Form.Control type="text" readOnly value={application.tyoaika_aikuinen_1} id="tyoaika_1" />
                                        </Form.Group>
                                    </>
                                )}
                            </Row>
                        ) : (
                            <Row className="mt-2">
                                <Form.Group className="col-2 mb-2">
                                    <Form.Label htmlFor="tyo_1"><small>Työllisyystilanne</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.tyollisyys_aikuinen_1} id="tyo_1" />
                                </Form.Group>

                                {(application.tyollisyys_aikuinen_1 === 'Opiskelija' ||
                                    application.tyollisyys_aikuinen_1 === 'Työssä') && (
                                    <>
                                        <Form.Group className="col-5 mb-2">
                                            <Form.Label htmlFor="tyo_tai_koulu_1">
                                                <small>{application.tyollisyys_aikuinen_1 === 'Opiskelija' ? 'Oppilaitos / koulu' : 'Työnantaja'}</small>
                                            </Form.Label>
                                            <Form.Control
                                                type="text"
                                                readOnly
                                                value={application.tyonantaja_tai_oppilaitos_aikuinen_1}
                                                id="tyo_tai_koulu_1"
                                            />
                                        </Form.Group>

                                        <Form.Group className="col-5 mb-2">
                                            <Form.Label htmlFor="tyoaika_1"><small>Työaika</small></Form.Label>
                                            <Form.Control type="text" readOnly value={application.tyoaika_aikuinen_1} id="tyoaika_1" />
                                        </Form.Group>
                                    </>
                                )}
                            </Row>
                        )}

                        {!print ? (
                            <>
                                {application.etunimet_aikuinen_2 && (
                                    <div className="mt-2">
                                        <strong>Toisen huoltajan tiedot</strong>

                                        {/* RIVI 6 */}
                                        <Row className="mt-2">
                                            <Form.Group className={mobile ? "col-6 mb-2" : "col-3 mb-2"}>
                                                <Form.Label htmlFor="etunimet_2"><small>Etunimet</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.etunimet_aikuinen_2} id="etunimet_2" />
                                            </Form.Group>

                                            <Form.Group className={mobile ? "col-6 mb-2" : "col-3 mb-2"}>
                                                <Form.Label htmlFor="sukunimi_2"><small>Sukunimi</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.sukunimi_aikuinen_2} id="sukunimi_2" />
                                            </Form.Group>

                                            <Form.Group className={mobile ? "col-6 mb-2" : "col-2 mb-2"}>
                                                <Form.Label htmlFor="puhelin_2"><small>Puhelinnumero</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.puhelinnumero_aikuinen_2} id="puhelin_2" />
                                            </Form.Group>

                                            <Form.Group className={mobile ? "col-6 mb-2" : "col-4 mb-2"}>
                                                <Form.Label htmlFor="email_2"><small>Sähköpostiosoite</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.sahkoposti_aikuinen_2} id="email_2" />
                                            </Form.Group>
                                        </Row>

                                        {/* RIVI 7 */}
                                        <Row className="mt-2 mb-2">
                                            <Form.Group className={mobile ? "col-5 mb-2" : "col-3 mb-2"}>
                                                <Form.Label htmlFor="tyo_2"><small>Työllisyystilanne</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.tyollisyys_aikuinen_2} id="tyo_2" />
                                            </Form.Group>

                                            {(application.tyollisyys_aikuinen_2 === 'Opiskelija' ||
                                                application.tyollisyys_aikuinen_2 === 'Työssä') && (
                                                <>
                                                    <Form.Group className={mobile ? "col-7 mb-2" : "col-4 mb-2"}>
                                                        <Form.Label htmlFor="tyo_tai_koulu_2">
                                                            <small>{application.tyollisyys_aikuinen_2 === 'Opiskelija' ? 'Oppilaitos / koulu' : 'Työnantaja'}</small>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            readOnly
                                                            value={application.tyonantaja_tai_oppilaitos_aikuinen_2}
                                                            id="tyo_tai_koulu_2"
                                                        />
                                                    </Form.Group>

                                                    <Form.Group className="col-5 mb-2">
                                                        <Form.Label htmlFor="tyoaika_2"><small>Työaika</small></Form.Label>
                                                        <Form.Control type="text" readOnly value={application.tyoaika_aikuinen_2} id="tyoaika_2" />
                                                    </Form.Group>
                                                </>
                                            )}
                                        </Row>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {application.etunimet_aikuinen_2 && (
                                    <div className="mt-2">
                                        <strong>Toisen huoltajan tiedot</strong>

                                        {/* RIVI 6 */}
                                        <Row className="mt-2">
                                            <Form.Group className="col-5 mb-2">
                                                <Form.Label htmlFor="etunimet_2"><small>Etunimet</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.etunimet_aikuinen_2} id="etunimet_2" />
                                            </Form.Group>

                                            <Form.Group className="col-7 mb-2">
                                                <Form.Label htmlFor="sukunimi_2"><small>Sukunimi</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.sukunimi_aikuinen_2} id="sukunimi_2" />
                                            </Form.Group>
                                        </Row>
                                        <Row>
                                            <Form.Group className="col-5 mb-2">
                                                <Form.Label htmlFor="puhelin_2"><small>Puhelinnumero</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.puhelinnumero_aikuinen_2} id="puhelin_2" />
                                            </Form.Group>

                                            <Form.Group className="col-7 mb-2">
                                                <Form.Label htmlFor="email_2"><small>Sähköpostiosoite</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.sahkoposti_aikuinen_2} id="email_2" />
                                            </Form.Group>
                                        </Row>

                                        {/* RIVI 7 */}
                                        <Row className="mt-2 mb-2">
                                            <Form.Group className="col-3 mb-2">
                                                <Form.Label htmlFor="tyo_2"><small>Työllisyystilanne</small></Form.Label>
                                                <Form.Control type="text" readOnly value={application.tyollisyys_aikuinen_2} id="tyo_2" />
                                            </Form.Group>

                                            {(application.tyollisyys_aikuinen_2 === 'Opiskelija' ||
                                                application.tyollisyys_aikuinen_2 === 'Työssä') && (
                                                <>
                                                    <Form.Group className="col-4 mb-2">
                                                        <Form.Label htmlFor="tyo_tai_koulu_2">
                                                            <small>{application.tyollisyys_aikuinen_2 === 'Opiskelija' ? 'Oppilaitos / koulu' : 'Työnantaja'}</small>
                                                        </Form.Label>
                                                        <Form.Control
                                                            type="text"
                                                            readOnly
                                                            value={application.tyonantaja_tai_oppilaitos_aikuinen_2}
                                                            id="tyo_tai_koulu_2"
                                                        />
                                                    </Form.Group>

                                                    <Form.Group className="col-5 mb-2">
                                                        <Form.Label htmlFor="tyoaika_2"><small>Työaika</small></Form.Label>
                                                        <Form.Control type="text" readOnly value={application.tyoaika_aikuinen_2} id="tyoaika_2" />
                                                    </Form.Group>
                                                </>
                                            )}
                                        </Row>
                                    </div>
                                )}
                            </>
                        )}

        <div style={{ pageBreakAfter: 'always', textAlign: 'center', margin: '1em 0' }} />

                        <strong>Perhesuhde</strong>

                        {/* RIVI 8 */}
                        <Row className="mt-2 mb-2">
                            <Form.Group className={!print ? "col-6 mb-2" : "col-5 mb-2"}>
                                <Form.Label htmlFor="vanhempien_suhde"><small>Vanhempien suhde</small></Form.Label>
                                <Form.Control type="text" readOnly value={application.suhde} id="vanhempien_suhde" />
                            </Form.Group>

                            <Form.Group className={!print ? "col-6 mb-2" : "col-7 mb-2"}>
                                <Form.Label htmlFor="asuminen"><small>Asumisjärjestelyt</small></Form.Label>
                                <Form.Control type="text" readOnly value={application.asuminen} id="asuminen" />
                            </Form.Group>
                        </Row>

    {/* RIVIT 9 & 10, JOS PÄIVÄHOITOHAKEMUS */}                
                    {application.formType === 'vkh' &&
                        <>
                            <strong>Toivottu päivähoitomuoto ja -aika</strong>

                            {/* RIVI 9 */}
                            <Row className="mt-2">
                                <Form.Group className={!print ? "col-6 mb-2" : "col-6 mb-2"}>
                                    <Form.Label htmlFor="vk-tarve"><small>Varhaiskasvatuksen tarve</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.tarve} id="vk-tarve" />
                                </Form.Group>

                                <Form.Group className={!print ? "col-6 mb-2" : "col-6 mb-2"}>
                                    <Form.Label htmlFor="hoitopaivien_maara"><small>Hoitopäivien lukumäärä / kk</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.paivat} id="hoitopaivien_maara" />
                                </Form.Group>
                            </Row>

                            {/* RIVI 10 */}
                            <Row className="mt-2">
                                <Form.Group className={!print ? "col-6 mb-2" : "col-6 mb-2"}>
                                    <Form.Label htmlFor="hoidon_alkamispaiva"><small>Hoidon tarpeen alkamispäivä</small></Form.Label>
                                    <Form.Control type="text" readOnly value={formatDate(application.alkamispaiva)} id="hoidon_alkamispaiva" />
                                </Form.Group>

                                <Form.Group className={!print ? "col-3 mb-2" : "col-3 mb-2"}>
                                    <Form.Label htmlFor="hoito_alkaa"><small>Hoitopäivä alkaa klo:</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.alkamisaika} id="hoito_alkaa" />
                                </Form.Group>

                                <Form.Group className={!print ? "col-3 mb-2" : "col-3 mb-2"}>
                                    <Form.Label htmlFor="hoito_loppuu"><small>Hoitopäivä päättyy klo:</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.paattymisaika} id="hoito_loppuu" />
                                </Form.Group>
                            </Row>
                        </>}

    {/* RIVI 9, JOS ESIKOULUHAKEMUS */}
                    {application.formType === 'ekh' &&
                        <>
                            <strong>Varhaiskasvatuksen ja kuljetuksen tarve</strong>

                            {/* RIVI 9 */}
                            <Row className="mt-2">
                                <Form.Group className={!print ? "col-6 mb-2" : "col-7 mb-2"}>
                                    <Form.Label htmlFor="paivahoito"><small>Varhaiskasvatuksen tarve</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.paivahoito} id="paivahoito" />
                                </Form.Group>

                                <Form.Group className={!print ? "col-6 mb-2" : "col-5 mb-2"}>
                                    <Form.Label htmlFor="kuljetus"><small>Kuljetuksen tarve</small></Form.Label>
                                    <Form.Control type="text" readOnly value={application.kuljetus} id="kuljetus" />
                                </Form.Group>
                            </Row>
                        </>}

    {/* YHTEISET RIVIT JATKUU */}
                        {/* RIVI 11 */}
                        <Row>
                            <Form.Label htmlFor="muut_lapset" className='mt-2'><strong>Perheen muut lapset</strong></Form.Label>
                                <Form.Group className="mb-2">
                                    <div
                                        id="muut_lapset"
                                        className="mt-2"
                                        style={{
                                            whiteSpace: 'pre-wrap',
                                            border: '1px solid #ced4da',
                                            borderRadius: '.25rem',
                                            padding: '0.375rem 0.75rem',
                                            minHeight: `${Math.max(1, application.muut_lapset.split('\n').length) * 1.55}em`,
                                        }}
                                    >
                                        {application.muut_lapset}
                                    </div>
                                </Form.Group>
                        </Row>

                        <Row>
                            <Col>
                                <Col className="d-flex flex-row align-items-center justify-content-center text-center mt-2">
                                    <Form.Group className="col-4">
                                        <Form.Label htmlFor="neuvolalupa"><strong>Neuvolalupa</strong></Form.Label>
                                        <Form.Control
                                            className="mt-2 text-center"
                                            style={{ border: 'none' }}
                                            value={`${application.suostumus ? 'Kyllä' : 'Ei'}`}
                                            readOnly
                                            id="neuvolalupa"
                                        />
                                    </Form.Group>

                                    <Form.Group className="col-4">
                                        <Form.Label htmlFor="allergiat"><strong>Allergiat</strong></Form.Label>
                                        <Form.Control
                                            className="mt-2 text-center"
                                            style={{ border: 'none' }}
                                            value={`${application.allergiat ? 'Kyllä' : 'Ei'}`}
                                            readOnly
                                            id="allergiat"
                                        />
                                    </Form.Group>

                                    <Form.Group className="col-4">
                                        <Form.Label htmlFor="sairaalahoito"><strong>Sairaalahoito</strong></Form.Label>
                                        <Form.Control
                                            className="mt-2 text-center"
                                            style={{ border: 'none' }}
                                            value={`${application.sairaalahoito ? 'Kyllä' : 'Ei'}`}
                                            readOnly
                                            id="sairaalahoito"
                                        />
                                    </Form.Group>
                                </Col>
                            </Col>
                        </Row>

                        {/* RIVI 12 */}
                        {(application.sairaalahoito || application.allergiat || application.suostumus || application.lisatiedot) &&
                            <>
                                <Row className='mt-2'>
                                    <strong>Lisätiedot</strong>

                                    {application.sairaalahoito ? (
                                        <Form.Group className={mobile ? "col-12 mt-2 mb-2" : !print ? "col-4 mt-2 mb-2" : "col-4 mt-4 mb-2"}>
                                            <Form.Label htmlFor="sairaalatiedot"><small>Sairaalahoidon lisätiedot</small></Form.Label>
                                            <div
                                                id="sairaalatiedot"
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    border: '1px solid #ced4da',
                                                    borderRadius: '.25rem',
                                                    padding: '0.375rem 0.75rem',
                                                    minHeight: `${Math.max(1, application.sairaala.split('\n').length) * 1.55}em`,
                                                }}
                                            >
                                                {application.sairaala}
                                            </div>
                                        </Form.Group>
                                    ) : (
                                        <Col className='col-4 mt-2 mb-2' />
                                    )}

                                    {application.allergiat ? (
                                        <Form.Group className={mobile ? "col-12 mt-2 mb-2" : "col-4 mt-2 mb-2"}>
                                            <Form.Label htmlFor="allergiatiedot"><small>Allergiat, sairaudet, erityisruokavaliot</small></Form.Label>
                                            <div
                                                id="allergiatiedot"
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    border: '1px solid #ced4da',
                                                    borderRadius: '.25rem',
                                                    padding: '0.375rem 0.75rem',
                                                    minHeight: `${Math.max(1, application.muut_terveystiedot.split('\n').length) * 1.55}em`,
                                                }}
                                            >
                                                {application.muut_terveystiedot}
                                            </div>
                                        </Form.Group>
                                    ) : (
                                        <Col className='col-4 mt-2 mb-2' />
                                    )}

                                    {application.suostumus ? (
                                        <Form.Group className={mobile ? "col-12 mt-2 mb-2" : !print ? "col-4 mt-2 mb-2" : "col-4 mt-4 mb-2"}>
                                            <Form.Label htmlFor="neuvola"><small>Neuvola</small></Form.Label>
                                            <div
                                                id="neuvola"
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    wordBreak: 'break-word',
                                                    border: '1px solid #ced4da',
                                                    borderRadius: '.25rem',
                                                    padding: '0.375rem 0.75rem',
                                                    minHeight: `${Math.max(1, application.neuvola.split('\n').length) * 1.55}em`,
                                                }}
                                            >
                                                {application.neuvola}
                                            </div>
                                        </Form.Group>
                                    ) : (
                                        <Col className='col-4 mt-2 mb-2' />
                                    )}
                                </Row>

    <div style={{ pageBreakAfter: 'always', textAlign: 'center', margin: '1em 0' }} />

                                {/* RIVI 13 */}
                                <Row>
                                    {application.lisatiedot &&
                                        <Form.Group className="col mb-2">
                                            <Form.Label htmlFor="lisatiedot"><small>Muut lisätiedot:</small></Form.Label>
                                            <div
                                                id="lisatiedot"
                                                style={{
                                                    whiteSpace: 'pre-wrap',
                                                    border: '1px solid #ced4da',
                                                    borderRadius: '.25rem',
                                                    padding: '0.375rem 0.75rem',
                                                    minHeight: `${Math.max(1, application.lisatiedot.split('\n').length) * 1.55}em`,
                                                }}
                                            >
                                                {application.lisatiedot}
                                            </div>
                                        </Form.Group>
                                    }
                                </Row>

                            </>
                        }
                    </Form>
                </Modal.Body>
            ) : (
                <Modal.Body className='d-flex flex-column align-items-center justify-content-center' style={{ minHeight: '20vh' }}>
                    <strong className='mb-5'>Hakemusta lähetetään, odota hetki...</strong>
                    <span className="spinner" />
                </Modal.Body>
            )}
                <div className='mt-5 mb-3 text-center'>
                    {handleSubmit &&
                        <Row>
                            <Col className='col-3 offset-3'>
                                <Button variant='success' 
                                        style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }}
                                        onClick={submitForm}
                                        disabled={loading}
                                    >
                                    {loading ? 'Lähetetään…' : 'Lähetä'}
                                </Button>
                            </Col>

                            <Col className='col-3'>
                                <Button variant='secondary' 
                                        style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }}
                                        onClick={handleClose}
                                        disabled={loading}
                                    >
                                    Peruuta
                                </Button>
                            </Col>
                        </Row>}

                    {(!handleSubmit && !print) &&
                        <>
                            <Row className='mt-3 ms-3 me-3'>
                                {application.createdAt !== application.updatedAt ? (
                                    <Col className='col-3 text-start'>
                                        <p>Käsitelty {formatDate(Number(application.updatedAt))}</p>
                                    </Col>
                                ) : (
                                        <Col className='col-3 text-start'>
                                            {!application.read &&
                                            <Button variant='warning' 
                                                    onClick={() => handleMarkRead()}
                                                    style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }}
                                                >
                                                    Merkitse käsitellyksi
                                            </Button>}
                                        </Col>
                                )}

                                <Col className='col-6 text-center'>
                                    {handler ? (
                                        <p>Käsittelijä: {handler}</p>
                                    ) : (
                                        <div className='d-flex flex-row gap-2'>
                                            <Col className='col-6 d-flex justify-content-end'>
                                                <Button variant='success'
                                                        style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }} 
                                                        onClick={() => {
                                                            setPrint(true)
                                                            handlePrint('print')
                                                        }}
                                                    >
                                                    Tulosta
                                                </Button>
                                            </Col>
                                            <Col className='col-6 d-flex justify-content-start'>
                                                <Button variant='info' 
                                                        style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }}
                                                        onClick={() => {
                                                    setPrint(true)
                                                    handlePrint()
                                                }}>
                                                    Tallenna
                                                </Button>
                                            </Col>
                                        </div>
                                    )}
                                </Col>

                                <Col className='col-3 text-end'>
                                    <p>id: {application.id}</p>
                                </Col>   
                            </Row>

                            {handler && 
                                <Row className='mt-3 text-center align-items-center'>
                                    <Col className='col-2 offset-4'>
                                        <Button variant='success' 
                                                style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }}
                                                onClick={() => {
                                                    setPrint(true)
                                                    handlePrint('print')
                                                }}
                                        >
                                            Tulosta
                                        </Button>
                                    </Col>

                                    <Col className='col-2'>
                                        <Button variant='info' 
                                                style={!mobile ? portrait ? {width: '10vw'} : { width: '6vw' } : { width: '22vw' }} 
                                                onClick={() => {
                                                    setPrint(true)
                                                    handlePrint()
                                                }}
                                        >
                                            Tallenna
                                        </Button>
                                    </Col>
                                </Row>
                            }
                        </>
                    }
                </div>
        </Modal>
    )
}

export default ApplicationModal