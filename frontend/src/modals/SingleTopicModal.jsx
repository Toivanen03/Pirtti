import { Modal, Button, Row, Col } from 'react-bootstrap'
import { AuthContext } from '../contexts/AuthContext'
import { useContext } from 'react'
import { DELETE_TOPIC, GET_TOPICS } from '../queries/queries'
import { useMutation } from '@apollo/client/react'

const SingleTopicModal = ({ mobile, selectedTopic, setSelectedTopic, formatDate, getDateClass, formatText, topicButtonStyle, setConfirmTitle, setOnConfirm }) => {
    const { currentUser} = useContext(AuthContext)
    const [deleteTopic] = useMutation(DELETE_TOPIC)

    const open = !!selectedTopic

    const handleDelete = (id) => {
        setConfirmTitle("Haluatko poistaa tämän tiedotteen?")
        setOnConfirm(() => async () => {
            try {
                await deleteTopic({
                    variables: {
                        id
                    },
                    refetchQueries: [{query: GET_TOPICS}]
                })
                setSelectedTopic(null)
            } catch (error) {
                setConfirmTitle(`VIRHE: Virhe poistamisessa: ${error.message}`)
            }
        })
    }

    return (
        <Modal id="ic-modal" show={open} size="xl" className='mb-5 content-text' centered>
            <div className='' style={{ border: '5px solid green', borderRadius: '5px' }}>
                <Modal.Header className='mx-2 row text-center'>
                    <Row>
                        <Col className={(currentUser?.admin) ? 'text-start' : 'text-center'}>
                            <h3>{selectedTopic?.otsikko}</h3>
                        </Col>
                        {currentUser?.admin && 
                            <Col className='col-2 text-center'>
                                <Button
                                    className='btn-danger'
                                    style={topicButtonStyle}
                                    onClick={() => handleDelete(selectedTopic.id)}
                                >
                                    Poista
                                </Button>
                            </Col>
                        }
                    </Row>
                </Modal.Header>

                <Modal.Body className={mobile ? "text-start" : "text-start mx-4"}>
                    {selectedTopic?.ajankohta &&
                        <Row>
                            <Col className='col-2'>
                                {mobile ? <h6>Ajankohta</h6> : <h5>Ajankohta</h5>}
                            </Col>
                        </Row>
                    }

                    <Row>
                        <Col className={`${mobile ? 'col-3' : 'col-2'} ${getDateClass(selectedTopic?.ajankohta, 'single')}`}>
                            {selectedTopic?.ajankohta && formatDate(selectedTopic.ajankohta)}
                        </Col>
                        <Col className={mobile ? 'col-9' : 'col-10'} style={{ whiteSpace: 'pre-line' }}>
                            {formatText(selectedTopic?.teksti)}
                        </Col>
                    </Row>
                </Modal.Body>

                <Modal.Footer className='text-center'>
                    <Col className='col-4 text-center'>
                        <Button
                            style={topicButtonStyle}
                            variant='warning'
                            onClick={() => setSelectedTopic(null)}
                            >
                            Sulje
                        </Button>
                    </Col>

                    <Col className='col-4 text-end text-info'>
                        <span>Viesti luotu {formatDate(Number(selectedTopic?.createdAt), 'created')}</span> 
                    </Col>
                </Modal.Footer>
            </div>
        </Modal>
    )
}

export default SingleTopicModal