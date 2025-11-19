import { Form, Modal, Row, Col, Button } from 'react-bootstrap'
import { formatDate } from '../pages/Admin'

const SearchModal = ({ handleQuery, setSelectedSearchResult, searchResults, setSearchResults, search, setSearch, searchParams, setSearchParams, onSearch, portrait }) => {
    if (!search) return null

    const handleClose = async () => {
        setSearchResults(null)
        setSearchParams({ sukunimi: "", syntymaaika: "", handler: "", id: "" })
        setSearch(false)
        await handleQuery({}, false)
    }

    return (
        <Modal show={search} onHide={handleClose} size={searchResults?.length > 0 ? "xl" : "lg"} centered>
            <Modal.Header closeButton>
                {(!searchResults) ? <strong>Etsi hakemuksia</strong> : <strong>{searchResults?.length} hakutulosta</strong>}
            </Modal.Header>

            <Modal.Body>

                {(!searchResults || searchResults?.length <= 0) &&
                    <>
                        {!searchResults &&
                            <Form>  
                                <Form.Group className='mb-4'>
                                    <Form.Label><small>Lapsen sukunimi</small></Form.Label>
                                    <Form.Control value={searchParams.sukunimi} onChange={e => setSearchParams({...searchParams, sukunimi: e.target.value})} />
                                </Form.Group>

                                <Form.Group className='mb-4'>
                                    <Form.Label><small>Lapsen syntymäaika</small></Form.Label>
                                    <Form.Control value={searchParams.syntymaaika} type='date' onChange={e => setSearchParams({...searchParams, syntymaaika: e.target.value})} />
                                </Form.Group>

                                <Form.Group className='mb-4'>
                                    <Form.Label><small>Käsittelijän käyttäjätunnus (sähköpostiosoite)</small></Form.Label>
                                    <Form.Control value={searchParams.handler} onChange={e => setSearchParams({...searchParams, handler: e.target.value})} />
                                </Form.Group>

                                <Form.Group className='mb-4'>
                                    <Form.Label><small>Hakemuksen ID</small></Form.Label>
                                    <Form.Control value={searchParams.id} onChange={e => setSearchParams({...searchParams, id: e.target.value})} />
                                </Form.Group>
                            </Form>
                        }
                    </>
                }

                {(searchResults?.length === 0) && <strong>Hakemuksia ei löytynyt annetuilla hakuehdoilla.</strong>}

                {searchResults?.length > 0 && 
                    <>
                        <h4>Tulokset hakuehdoilla
                            <small><i>
                                {(searchParams.sukunimi !== "") && ` | lapsen sukunimi: ${searchParams.sukunimi} |`} 
                                {(searchParams.syntymaaika !== "") && ` | lapsen syntymäaika: ${searchParams.syntymaaika} |`} 
                                {(searchParams.handler !== "") && ` | käsittelijä: ${searchParams.handler} |`} 
                                {(searchParams.id !== "") && ` | hakemuksen id-tunnus: ${searchParams.id} |`} 
                            </i></small>
                        </h4>

                        <Row className='mb-3 mt-4'>
                            <Col className='col-2'>
                                <strong>Sukunimi</strong>
                            </Col>
                            <Col className='col-2'>
                                <strong>Syntymäaika</strong>
                            </Col>
                            <Col className='col-3'>
                                <strong>Hakemus jätetty</strong>
                            </Col>
                            <Col className='col-3'>
                                <strong>Käsittelyn tila</strong>
                            </Col>
                            <Col className='col-2'>
                                <strong>Hakemustyyppi</strong>
                            </Col>
                        </Row>

                        {searchResults.map(app => (
                            <div
                                key={app.id}
                                className="border rounded p-2 mb-2 cursor-pointer"
                                onClick={() => setSelectedSearchResult(app)}
                            >
                            <Row style={{ cursor: 'pointer' }}>
                                <Col className='col-2'>
                                    {app.sukunimi_lapsi}
                                </Col>

                                <Col className='col-2'>
                                    {formatDate(app.syntymaaika)}
                                </Col>

                                <Col className='col-3'>
                                    {formatDate(Number(app.createdAt))}
                                </Col>

                                <Col className='col-3'>
                                    {(app.createdAt !== app.updatedAt) ? `Käsitelty ${formatDate(Number(app.updatedAt))}` : <strong className='text-danger'>Käsittelemättä</strong> }
                                </Col>

                                <Col className='col-2'>
                                    {app.formType === 'ekh' ? (portrait ? 'Esikoulu' : 'Esikouluhakemus') : (portrait ? 'Päivähoito' : 'Päivähoitohakemus')}
                                </Col>
                            </Row>
                        </div>
                        ))}
                    </>
                }
            </Modal.Body>

                <Modal.Footer>
                    {!searchResults ? (
                        <Button
                            onClick={() => onSearch(searchParams, true)}
                        >
                            {!Object.values(searchParams).every(value => value === "") ? 'Hae' : 'Hae kaikki'}
                        </Button>
                    ) : (
                        <Button variant="secondary" onClick={() => {
                            setSearchResults(null)
                            setSearchParams({ sukunimi: "", syntymaaika: "", handler: "", id: "" })
                        }}
                        >
                            Uusi haku
                        </Button>
                    )}
                </Modal.Footer>
        </Modal>
    )
}

export default SearchModal