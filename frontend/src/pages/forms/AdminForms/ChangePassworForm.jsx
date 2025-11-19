import { useState, useRef, useEffect } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { UPDATE_PASSWORD } from '../../../queries/queries'
import { useMutation } from '@apollo/client/react'

const fields = {
    salasana: "",
    salasana_uudelleen: ""
}

const ChangePasswordForm = ({ setConfirmTitle, setFormType, user, portrait }) => {
    const [allFilled, setAllFilled] = useState(false)
    const [formData, setFormData] = useState(fields)
    const passwordFormRef = useRef(null)
    const [updatePassword] = useMutation(UPDATE_PASSWORD)
    const [match, setMatch] = useState(false)

    useEffect(() => {
        if (!passwordFormRef.current) return

        if (formData.salasana_uudelleen && formData.salasana && (formData.salasana_uudelleen === formData.salasana)) {
            setMatch(true)
        } else {
            setMatch(false)
        }

        const form = passwordFormRef.current

        const checkFilled = () => {
            const filled = Array.from(form.querySelectorAll('[required]'))
            .every(input => input.value.trim() !== '')
            setAllFilled(filled)
        }

        checkFilled()

        form.addEventListener('input', checkFilled)

        return () => form.removeEventListener('input', checkFilled)

    }, [formData])

    const handleChange = (e) => {
        let { name, value } = e.target
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))

    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!match) {
            setConfirmTitle("Salasanat eivät vastaa toisiaan")
            return
        }

        try {
            const response = await updatePassword({
                variables: {
                    id: user.id,
                    newPassword: formData.salasana,
                }
            })

            if (response.error) {
                setConfirmTitle('Virhe:' + response.error.message)
            } else if (response.data) {
                setConfirmTitle("Salasana vaihdettu.")
                setAllFilled(false)
                setFormType(null)
            }
        } catch (error) {
            setConfirmTitle(`Virhe: ${error}`)
        }
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between position-relative">
                <h3 className="m-0 position-absolute top-50 start-50 translate-middle">
                    Salasanan vaihto
                </h3>
                <Button 
                    className="ms-auto"
                    style={{ width: '10vw' }}
                    variant="secondary"
                    onClick={() => {
                        setFormType(null)
                        }}
                    >
                        Sulje
                </Button>
            </div>
            <div className="d-flex flex-column justify-content-center text-start">
                <Form onSubmit={handleSubmit} ref={passwordFormRef} style={{ width: "100%", margin: "0 auto" }}>
                    <Row className="mb-2">
                        <Col className="mt-5">  
                            <Form.Label><strong>Käyttäjätunnuksen <span style={{color: 'blue'}}>{user.email}</span> salasanan vaihto</strong></Form.Label>
                        </Col>
                    </Row>
                    <div className='d-flex flex-column align-items-center'>

                        <Row style={{ width: "60%" }}>
                            <Col>
                                <Form.Group controlId="formSalasana">  
                                    <Row className="mt-4">
                                        <Col className="col-7">
                                            <Form.Control
                                                type="password"
                                                name="salasana"
                                                value={formData.salasana}
                                                onChange={handleChange}
                                                placeholder="Uusi salasana"
                                                required
                                            />
                                        </Col>
                                        <Col className="col-5 d-flex justify-content-center align-items-center">
                                            <small>
                                                <ul>
                                                    <li>
                                                        Vähintään 8 merkkiä
                                                    </li>
                                                    <li>    
                                                        Kirjaimia ja numeroita
                                                    </li>
                                                    <li>
                                                        Vähintään yksi erikoismerkki
                                                    </li>
                                                </ul>
                                            </small>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row style={{ width: "60%" }}>
                            <Col>
                                <Form.Group controlId="formSalasana_uudelleen" className="mb-3">
                                    <Row>
                                        <Col className="col-7">
                                            <Form.Control
                                                type="password"
                                                name="salasana_uudelleen"
                                                value={formData.salasana_uudelleen}
                                                onChange={handleChange}
                                                placeholder="Salasana uudelleen"
                                                required
                                            />
                                        </Col>
                                        <Col className="col-5 d-flex justify-content-center align-items-center">
                                            {!match && <small className="text-danger">Salasanat eivät vastaa toisiaan</small>}
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="d-flex flex-column mt-4 align-items-center text-center">
                            {(allFilled && match) ? (
                                <Button variant="success" type="submit" style={{ width: portrait ? '10vw' : '6vw' }}>Lähetä</Button>
                            ) : (
                                <Button variant="primary" style={{ width: portrait ? '10vw' : '6vw' }} onClick={() => setFormData(fields)}>Tyhjennä</Button>
                            )}
                            {!allFilled && <p className="text-danger mt-3">Täytä kaikki kentät ennen lähettämistä.</p>}
                        </div>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default ChangePasswordForm