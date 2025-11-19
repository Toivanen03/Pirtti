import { useState, useRef, useEffect } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { USERS, UPDATE_PASSWORD, UPDATE_NOTIFICATIONS } from '../../../queries/queries'
import { useMutation } from '@apollo/client/react'

const fields = {
    salasana: "",
    salasana_uudelleen: ""
}

const UserProfile = ({ setConfirmTitle, setFormType, user, portrait }) => {
    const [allFilled, setAllFilled] = useState(false)
    const [formData, setFormData] = useState(fields)
    const passwordFormRef = useRef(null)
    const [updatePassword] = useMutation(UPDATE_PASSWORD)
    const [match, setMatch] = useState(false)
    const [updateNotifications] = useMutation(UPDATE_NOTIFICATIONS)
    const [notifications, setNotifications] = useState(user.notifications === true)

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

    const handleSetNotifications = async (user, newValue) => {
        try {
            await updateNotifications({
                variables: {
                    id: user.id,
                    notifications: newValue
                },
                refetchQueries: [{ query: USERS }]
            })

        } catch (error) {
            setConfirmTitle(`Virhe: ${error}`)
        }
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
                <h4 className="m-0 position-absolute top-50 start-50 translate-middle">
                    Käyttäjätunnuksen <span style={{color: 'blue'}}>{user.email}</span> asetukset
                </h4>
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
                    <Row>
                        <Col className="col-4">
                            <Row className="mt-5 mb-2">
                                <Col className="text-center">
                                    <Form.Label className="mb-4"><strong>Sähköposti-ilmoitukset<br />uusista hakemuksista</strong></Form.Label>
                                </Col>
                                <div className='d-flex flex-column align-items-center'>
                                    <Form.Group controlId="formNotifications">
                                        <Form.Check
                                            type="switch"
                                            id={user.id + "notifications"}
                                            name="notifications"
                                            checked={notifications}
                                            onChange={async () => {
                                                const newValue = !notifications
                                                setNotifications(newValue)
                                                await handleSetNotifications(user, newValue)
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                            </Row>
                        </Col>
                        
                        <Col className="col-8">
                            <Row className="mt-5 mb-2">
                                <Col>  
                                    <Form.Label><strong className="me-5">Salasanan vaihto</strong></Form.Label>
                                </Col>
                            </Row>
                            <div className='d-flex flex-column align-items-center'>

                                <Row style={{ width: portrait ? "90%" : "60%" }}>
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

                                <Row style={{ width: portrait ? "90%" : "60%" }}>
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
                        </Col>
                    </Row>
                </Form>
            </div>
        </>
    )
}

export default UserProfile