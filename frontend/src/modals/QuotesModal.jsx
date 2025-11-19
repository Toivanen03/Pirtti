import { Form, Modal, Row, Col, Button } from 'react-bootstrap'
import { GET_QUOTES, DELETE_QUOTE } from '../queries/queries'
import { useMutation, useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'

const QuotesModal = ({ showModal, setShowModal, setConfirmTitle }) => {
    const { data, loading, refetch } = useQuery(GET_QUOTES)
    const [deleteQuery] = useMutation(DELETE_QUOTE)
    const [headline_1, setHeadline_1] = useState("")
    const [headline_2, setHeadline_2] = useState("")
    const [headline_3, setHeadline_3] = useState("")

    useEffect(() => {
        if (!loading && data?.quotes) {
            setHeadline_1(data.quotes.quotes_lohkot.lohko_1?.quotes_otsikko)
            setHeadline_2(data.quotes.quotes_lohkot.lohko_2?.quotes_otsikko)
            setHeadline_3(data.quotes.quotes_lohkot.lohko_3?.quotes_otsikko)
        }
    }, [data, loading])

    const handleClose = async () => {
        setShowModal(false)
    }

    const handleDelete = async (id) => {
        if (!id) return

        try {
            const { data } = await deleteQuery({
                variables: {
                    id
                },
            })

            if (data?.error) {
                setConfirmTitle(data.error.message || "Tuntematon virhe")
            } else if (data?.deleteQuote) {
                refetch()
                setConfirmTitle(`"${data.deleteQuote.text}" poistettu.`)
            }

        } catch (err) {
            setConfirmTitle(err.message)
        }
    }

    return (
        <Modal show={showModal} onHide={handleClose} size={"xl"} centered>
            <Modal.Header closeButton>
                <strong>Nykyiset lainaukset</strong>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Row className='p-2'>
                        <Col className='col-9'>
                            <Form.Group className='mb-4'>
                                <Form.Label><strong><small>{headline_1}</small></strong></Form.Label>
                                    <ul>
                                        {data?.quotes?.quotes_lohkot?.lohko_1?.quotes.map((quote) => (
                                            <li key={quote.id}>
                                                <Row className='d-flex flex-row align-items-center mb-2' style={{ width: '100%' }}>
                                                    <Col className='col-7 flex-column'>
                                                        {quote.text}
                                                    </Col>
                                                    
                                                    <Col className='col-2 offset-2 flex-column'>
                                                        <Button variant='danger' onClick={() => handleDelete(quote.id)}>Poista</Button>
                                                    </Col>
                                                </Row>
                                            </li>
                                        ))}
                                    </ul>
                            </Form.Group>

                            <Form.Group className='mb-4'>
                                <Form.Label><strong><small>{headline_2}</small></strong></Form.Label>
                                <ul>
                                    {data?.quotes?.quotes_lohkot?.lohko_2?.quotes.map((quote) => (
                                        <li key={quote.id}>
                                            <Row className='d-flex flex-row align-items-center mb-2' style={{ width: '100%' }}>
                                                <Col className='col-7 flex-column'>
                                                    {quote.text}
                                                </Col>
                                                
                                                <Col className='col-2 offset-2 flex-column'>
                                                    <Button variant='danger' onClick={() => handleDelete(quote.id)}>Poista</Button>
                                                </Col>
                                            </Row>
                                        </li>
                                    ))}
                                </ul>
                            </Form.Group>

                            <Form.Group className='mb-4'>
                                <Form.Label><strong><small>{headline_3}</small></strong></Form.Label>
                                <ul>
                                    {data?.quotes?.quotes_lohkot?.lohko_3?.quotes.map((quote) => (
                                        <li key={quote.id}>
                                            <Row className='d-flex flex-row align-items-center mb-2' style={{ width: '100%' }}>
                                                <Col className='col-7 flex-column'>
                                                    {quote.text}
                                                </Col>
                                                
                                                <Col className='col-2 offset-2 flex-column'>
                                                    <Button variant='danger' onClick={() => handleDelete(quote.id)}>Poista</Button>
                                                </Col>
                                            </Row>
                                        </li>
                                    ))}
                                </ul>
                            </Form.Group>
                        </Col>

                        <Col className='col-3'>
                            <p>Voit poistaa yksittäisiä lainauksia "lasten suusta" -sivulta.</p> 
                            <p className='text-danger'>Poistosta ei tule erillistä vahvistusta, vaan lainaus poistetaan välittömästi.</p>                           
                        </Col>
                    </Row>
                </Form>
            </Modal.Body>

                <Modal.Footer>

                </Modal.Footer>
        </Modal>
    )
}

export default QuotesModal