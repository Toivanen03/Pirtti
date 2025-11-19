import {Form, Row, Col, Button } from 'react-bootstrap'
import { useRef, useState } from 'react'
import { UPLOAD_INTERNAL_CONTROL } from '../../../../queries/queries'
import { useMutation } from '@apollo/client/react'

const InternalControlPlan = ({ setConfirmTitle, portrait }) => {
    const fileFormRef = useRef()
    const [file, setFile] = useState(null)
    const [uploadInternalControl] = useMutation(UPLOAD_INTERNAL_CONTROL)

    const handleFileChange = (e) => {
        if (e.target.value.toLowerCase().endsWith('.pdf')) {
            setFile(e.target.files[0])
        } else {
            fileFormRef.current.reset()
            setFile(null)
            setConfirmTitle("VIRHE: Vain .pdf-tiedostot ovat sallittuja.")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!file) return

        try {
            const { data } = await uploadInternalControl({ variables: { file } })
            if (data && !data.error) {
                setConfirmTitle(`${data.uploadInternalControl.filename} tallennettu.`)
                setFile(null)
                fileFormRef.current.reset()
            } 
            if (data.error) setConfirmTitle("VIRHE: " + data.error.message)

        } catch (error) {
            setConfirmTitle("VIRHE: " + error.message)
        }
    }

    return (

            <Form onSubmit={handleSubmit} ref={fileFormRef} style={{ width: "100%" }} className='mt-2'>
                <Row style={{ width: "100%" }}>
                    <Col className={portrait ? 'col-5' : 'col-4 d-flex align-items-center justify-content-center'}>
                        <Form.Group controlId="formUpload">
                            <input
                                type="file"
                                className="form-control"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Col>

                    <Col className='col-4 d-flex align-items-center'>
                        <span className='text-info'>Valitse liitettävä .pdf-tiedosto.</span>
                    </Col>
                </Row>

                <Row className='mt-3' style={{ width: "100%" }}>
                    <Col className={portrait ? 'col-5' : 'col-4'}>
                        <Button variant="success" type="submit" style={{ width: '10vw' }}>Lähetä</Button>
                    </Col>
                </Row>
            </Form>

    )
}

export default InternalControlPlan