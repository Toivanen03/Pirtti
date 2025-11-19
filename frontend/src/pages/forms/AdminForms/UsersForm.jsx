import { useContext, useEffect } from 'react'
import { AuthContext } from '../../../contexts/AuthContext'
import { Form, Button, Row, Col } from "react-bootstrap"
import { useMutation, useQuery } from '@apollo/client/react'
import { USERS, DELETE_USER, UPDATE_NOTIFICATIONS } from '../../../queries/queries'

const UsersForm = ({ setConfirmTitle, setOnConfirm, setFormType, setUser, portrait }) => {
    const { currentUser } = useContext(AuthContext)
    const { data } = useQuery(USERS)
    const [deleteUser] = useMutation(DELETE_USER)
    const [updateNotifications] = useMutation(UPDATE_NOTIFICATIONS)

    const handleDelete = (user) => {
        setConfirmTitle(`Vahvista: Haluatko varmasti poistaa käyttäjän ${user.email}?`)
        setOnConfirm(() => () => {
            try {
                deleteUser({
                    variables: {
                        id: user.id
                    },
                    refetchQueries: ['getUsers']
                })
                setUser(null)
                setConfirmTitle("Käyttäjä poistettu.")
            } catch (error) {
                setConfirmTitle(`Virhe: ${error}`)
            }
        })
    }

    const handleSetNotifications = async (user) => {
        try {
            await updateNotifications({
                variables: {
                    id: user.id,
                    notifications: !user.notifications
                },
                refetchQueries: [{ queries: USERS }]
            })

        } catch (error) {
            setConfirmTitle(`Virhe: ${error}`)
        }
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between position-relative mb-5">
                <h3 className="m-0 position-absolute top-50 start-50 translate-middle">
                    Käyttäjien hallinta
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
                    
            {data?.users?.filter(user => user.id !== currentUser.id).length === 0 ? (
                <h5 className='mt-5 text-center'>Ei muita käyttäjiä</h5> 
            ) : (
                <>
                    <Row>
                        <Col className='col-12 text-end mb-4'>
                            {!portrait ? <strong>Sähköposti-ilmoitukset:</strong> : <small>Sähköposti-ilmoitukset:</small>}
                        </Col>
                    </Row>

                    {data?.users
                    .filter(user => user.id !== currentUser.id)
                    .map(user => 
                        <Row key={user.id} className='d-flex align-items-center fw-bold mb-4 ps-5 pe-5'>
                            {!portrait &&
                                <Col className='col-3 text-start'>
                                    {user.id}
                                </Col>
                            }

                            <Col className='col-3 text-start'>
                                {user.email}
                            </Col>

                            <Col className={!portrait ? 'col-2 text-center' : 'col-4 text-center'}>
                                <Button onClick={() => {
                                    setUser(user)
                                    setFormType('password')
                                }}
                                >
                                    Vaihda salasana
                                </Button>
                            </Col>

                            <Col className={!portrait ? 'col-3 text-center' : 'col-4 text-start'}>
                                <Button variant='danger' onClick={() => {
                                    setUser(user)
                                    handleDelete(user)
                                }}
                                >
                                    Poista käyttäjätunnus
                                </Button>
                            </Col>


                            <Col className='col-1'>
                                <Form.Group controlId="formNotifications">
                                    <Form.Check
                                        type="switch"
                                        id={user.id + "notifications"}
                                        name="notifications"
                                        checked={user.notifications}
                                        onChange={() => handleSetNotifications(user)}
                                        className={!portrait ? '' : 'me-5'}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    )}
                </>
            )}
        </>
    )
}

export default UsersForm