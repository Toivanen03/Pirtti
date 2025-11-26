import {Form, Row, Col, Button } from 'react-bootstrap'
import { useRef, useState } from 'react'
import { UPLOAD_PRIVACY_POLICY } from '../../../../queries/queries'
import { useMutation } from '@apollo/client/react'

const UploadPrivacyPolicy = ({ setConfirmTitle }) => {
    const fileFormRef = useRef()
    const [file, setFile] = useState(null)
    const [uploadPrivacyPolicy] = useMutation(UPLOAD_PRIVACY_POLICY)

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
            const { data } = await uploadPrivacyPolicy({ variables: { file } })
            if (data && !data.error) {
                setConfirmTitle(`${data.uploadPrivacyPolicy.filename} tallennettu.`)
                setFile(null)
                fileFormRef.current.reset()
            } 
            if (data.error) setConfirmTitle("VIRHE: " + data.error.message)

        } catch (error) {
            setConfirmTitle("VIRHE: " + error.message)
        }
    }

    return (

            <Form onSubmit={handleSubmit} ref={fileFormRef} className='mt-2'>
                <Row>
                    <Col className='d-flex align-items-center justify-content-center'>
                        <Form.Group controlId="formUpload">
                            <input
                                type="file"
                                className="form-control"
                                accept=".pdf,application/pdf"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>

                <Row className='mt-3'>
                    <Col>
                        <Button variant="success" type="submit" style={{ width: '10vw' }}>Lähetä</Button>
                    </Col>
                </Row>
            </Form>

    )
}

export default UploadPrivacyPolicy