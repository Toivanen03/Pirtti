import { Form, Modal, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { GET_INTERNAL_CONTROL_PDF } from '../queries/queries'
import { useQuery } from '@apollo/client/react'

const ICModal = ({ showModal, setShowModal, mobile, portrait }) => {
    const { data, loading } = useQuery(GET_INTERNAL_CONTROL_PDF)
    const [fileName, setFileName] = useState("")
    const [pdfData, setPdfData] = useState("")
    const [pdf, setPdf] = useState("")
    const buttonStyle = { width: mobile ? '30vw' : portrait ? '10vw' : '6vw'}

    useEffect(() => {
        if (!loading && data) {
            setFileName(data.internalControlDocument?.filename)
            setPdfData(data.internalControlDocument?.pdf)
        }

    }, [loading, data])

    useEffect(() => {
        if (pdfData) {
            const base64 = pdfData
            const byteCharacters = atob(base64)
            const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0))
            const byteArray = new Uint8Array(byteNumbers)
            const blob = new Blob([byteArray], { type: 'application/pdf' })
            setPdf(URL.createObjectURL(blob))
        }

    }, [pdfData])

    return (
        <Modal id="ic-modal" show={showModal} size="xl" className='mb-5' centered={mobile}>
            <Modal.Header>
                <strong>Pirtin omavalvontasuunnitelma</strong>
            </Modal.Header>

            {!mobile &&
                <Modal.Body className="text-start">
                    <Form>
                        <h4>{fileName || "Ei tiedostoa"}</h4>
                        <iframe
                            src={pdf}
                            style={{ width: '100%', height: '70vh' }}
                            title="Omavalvontasuunnitelma"
                        />
                    </Form>
                </Modal.Body>
            }

            <Modal.Footer className="d-flex justify-content-center gap-5">
                {!mobile ? (
                    <Button variant='success'
                        onClick={() => {
                            const link = document.createElement('a')
                            link.href = pdf
                            link.download = fileName || 'omavalvontasuunnitelma.pdf'
                            document.body.appendChild(link)
                            link.click()
                            document.body.removeChild(link)
                        }}
                        style={buttonStyle}
                    >
                        Tallenna
                    </Button>
                ) : (
                    <Button variant='success' style={buttonStyle} onClick={() => {
                        setShowModal(false)
                        window.open(pdf, "_blank")
                    }}
                    >
                        Avaa
                    </Button>
                )}

                <Button variant='warning' onClick={() => setShowModal(false)} style={buttonStyle}>Sulje</Button>

                {!mobile &&
                    <Button variant='info'
                        onClick={() => {
                            const iframe = document.querySelector('#ic-modal iframe')
                            if (iframe) {
                                iframe.contentWindow.focus()
                                iframe.contentWindow.print()
                            }
                        }}
                            style={buttonStyle}
                        >
                        Tulosta
                    </Button>
                }
            </Modal.Footer>
        </Modal>
    )
}

export default ICModal