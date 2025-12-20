import { useRef, useState, useEffect } from "react"
import { Form, Button, Row, Col } from "react-bootstrap"
import { USERS, ADD_USER } from '../../../queries/queries'
import { useMutation } from '@apollo/client/react'
import { runMutation } from "../../../utils/runMutation"

const userFields = {
    sahkoposti: "",
    salasana: "",
    salasana_uudelleen: ""
}

const NewUserForm = ({ setConfirmTitle, setFormType, portrait }) => {
    const [allFilled, setAllFilled] = useState(false)
    const newUserFormRef = useRef(null)
    const [createUser] = useMutation(ADD_USER)
    const [formData, setFormData] = useState(userFields)
    const [match, setMatch] = useState(false)

    useEffect(() => {
        if (!newUserFormRef.current) return

        if (formData.salasana_uudelleen && formData.salasana && (formData.salasana_uudelleen === formData.salasana)) {
            setMatch(true)
        } else {
            setMatch(false)
        }

        const form = newUserFormRef.current

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

            const response = await runMutation(createUser, {
                variables: {
                    email: formData.sahkoposti,
                    password: formData.salasana,
                    admin: true
                },
                refetchQueries: [{ query: USERS }]
            })

            if (!response.ok) {
                setConfirmTitle(`Virhe: ${response.error}`)
                return
            }
            
            setConfirmTitle(`Käyttäjätunnus ${response.data.createUser.email} luotu.`)
            setAllFilled(false)
            setFormType(null)
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between position-relative">
                <h3 className="m-0 position-absolute top-50 start-50 translate-middle">
                    Uusi käyttäjä
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
            <div className="d-flex flex-column justify-content-center text-start mt-4">
                <Form onSubmit={handleSubmit} ref={newUserFormRef} style={{ width: "80%", margin: "0 auto" }}>
                    <Row className="mb-2">
                        <Col>  
                            <Form.Label><strong>Luo uusi käyttäjä</strong></Form.Label>
                        </Col>
                    </Row>
                    <div className='d-flex flex-column align-items-center'>
                        <Row style={{ width: portrait ? "90%" : "60%" }}>
                            <Col>
                                <Form.Group controlId="formSahkoposti" className="mb-3">  
                                    <Row>
                                        <Col className="col-7">
                                            <Form.Control
                                                type="text"
                                                name="sahkoposti"
                                                value={formData.sahkoposti}
                                                onChange={handleChange}
                                                placeholder="Sähköpostiosoite"
                                                required
                                            />
                                        </Col>
                                        <Col className="col-5 d-flex">
                                            <small className="ms-4">Sähköpostiosoite toimii käyttäjätunnuksena</small>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                        </Row>

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
                                                placeholder="Salasana"
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
                                <Button variant="primary" style={{ width: portrait ? '10vw' : '6vw' }} onClick={() => setFormData(userFields)}>Tyhjennä</Button>
                            )}
                            {!allFilled && <p className="text-danger mt-3">Täytä kaikki kentät ennen lähettämistä.</p>}
                        </div>
                    </div>
                </Form>
            </div>
        </>
    )
}

export default NewUserForm