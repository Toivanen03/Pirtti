import { Form, Modal, Button, Row, Col, Badge } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import { NEW_TOPICS_KEY } from '../layout/NewTopics'
import SingleTopicModal from './SingleTopicModal'

const TopicsModal = ({ topics, showTopics, setShowTopics, mobile, setShowBanner, setShow, setConfirmTitle, setOnConfirm, setUnreadCount }) => {
    const [showOnlyUnread, setShowOnlyUnread] = useState(false)
    const [lastSeen, setLastSeen] = useState(null)
    const [selectedTopic, setSelectedTopic] = useState(null)
 
    const topicButtonStyle = { minWidth: mobile ? '20vw' : '8vw', border: '1px solid black' }

    const stored = JSON.parse(localStorage.getItem(NEW_TOPICS_KEY))
    const lastRead = stored?.date || 0
    const unreadTopics = topics?.filter(topic => topic.createdAt >= lastRead) || []

    useEffect(() => {
        if (!topics) return
        const stored = JSON.parse(localStorage.getItem(NEW_TOPICS_KEY))
        const lastRead = stored?.date || 0
        setLastSeen(lastRead)
        setShowOnlyUnread(topics.some(t => t.createdAt >= lastRead))
        setUnreadCount(unreadTopics.length)
        
    }, [topics])

    useEffect(() => {
        document.body.classList.toggle("disabled-scroll", (selectedTopic || showTopics))
    }, [selectedTopic, showTopics])

    const getDateClass = (dateStr, type) => {
        if (!dateStr || (selectedTopic && type !== 'single')) return ''

        const now = new Date()
        const date = new Date(dateStr)
        const diff = date - now
        const days = diff / (1000 * 60 * 60 * 24)

        if ((days < 0 && days >= -5) && type !== 'headline') return 'text-danger'
        if ((days >= 0 && days < 7) && type !== 'headline') return 'text-warning'
        if ((days >= 7) && type !== 'headline') return 'text-success'

        return ''
    }

    const formatDate = (dateStr, format) => {
        const now = new Date(Date.now())
        const d = new Date(dateStr)

        const shortDate = () => {
            const day = String(d.getDate()).padStart(2, "0")
            const month = String(d.getMonth() + 1).padStart(2, "0")
            const year = d.getFullYear()
            return `${day}.${month}.${year}`
        }

        const longDate = () => {
            let formatted = d.toLocaleDateString("fi-FI", {
                weekday: "long",
                day: "numeric",
                month: "numeric",
                year: "numeric"
            })
            return formatted.charAt(0).toUpperCase() + formatted.slice(1)
        }
        
        return (format === "created") ? shortDate() : (mobile || format === 'short') ? now > d ? 'Mennyt' : shortDate() : now > d ? `Mennyt ${shortDate()}` : longDate()
    }

    const formatText = (text) => {
        if (!text) return null

        const parse = (str) => {
            const elements = []
            let remaining = str
            const regex = /##(.*?)##|\*\*(.*?)\*\*/

            while (remaining.length > 0) {
                const match = remaining.match(regex)
                if (!match) {
                    elements.push(remaining)
                    break
                }

                const index = match.index
                if (index > 0) elements.push(remaining.slice(0, index))

                if (match[1]) {
                    elements.push(<i key={elements.length}>{parse(match[1])}</i>)
                } else if (match[2]) {
                    elements.push(<b key={elements.length}>{parse(match[2])}</b>)
                }

                remaining = remaining.slice(index + match[0].length)
            }

            return elements
        }

        return parse(text)
    }

    const ColorLegend = () => {
        if (topics.length > 0 || unreadTopics.length > 0)
            
        return (
            <Row className='small'>
                <small className="me-3">
                    <Badge bg="success" className="me-1">&nbsp;</Badge>
                    Yli viikko jäljellä
                </small>

                <small className="me-3">
                    <Badge bg="warning" text="dark" className="me-1">&nbsp;</Badge>
                    Alle viikko jäljellä
                </small>

                <small>
                    <Badge bg="danger" className="me-1">&nbsp;</Badge>
                    Umpeutunut {'<'} 5 vrk
                </small>
            </Row>
        )
    }

    return (
        <Modal id="ic-modal" show={showTopics} size="xl" className='mb-5 content-text'>
            <div className='' style={{ border: selectedTopic ? '5px solid yellow' : '5px solid green', borderRadius: '5px' }}>
                <Modal.Header>
                    <Col className='col-5'>
                        <strong>Ajankohtaista</strong>
                    </Col>

                    {!mobile &&
                        <Col className='col-4'>
                            <ColorLegend />
                        </Col>
                    }

                    <Col className={mobile ? 'col-7 text-end' : 'col-3 text-end'}>
                        <Button 
                            style={topicButtonStyle} 
                            variant='info' 
                            onClick={() => setShowOnlyUnread(!showOnlyUnread)} 
                            disabled={selectedTopic}
                            className='shadow'
                        >
                            {!showOnlyUnread ? 'Lukemattomat' : 'Kaikki tiedotteet'}
                        </Button>
                    </Col>
                </Modal.Header>

                <Modal.Body className="text-start p-4">
                    <Form>
                        {mobile ? (
                            <Row className='d-flex align-items-center mb-4'>
                                <Col>
                                    <h5>{showOnlyUnread ? 'Uudet tiedotteet' : 'Kaikki tiedotteet'}</h5>
                                </Col>
                                <Col>
                                    <ColorLegend />
                                </Col>
                            </Row>
                        ) : (
                            <Row><h3 className='mb-4'>{showOnlyUnread ? 'Uudet tiedotteet' : 'Kaikki tiedotteet'}</h3></Row>
                        )}

                        {((unreadTopics.length > 0 && showOnlyUnread) || (topics.length > 0 && !showOnlyUnread)) ? (
                            <Row className={mobile ? 'mb-2 text-start' : 'mb-3 text-start me-3'}>
                                <Col className='col-4'>
                                    {mobile ? <h6>Aihe</h6> : <h5>Aihe</h5>}
                                </Col>
                                <Col className={mobile ? 'col-4 offset-4' : 'col-4 offset-3'}>
                                    {mobile ? <h6>Ajankohta</h6> : <h5>Ajankohta</h5>}
                                </Col>
                                {!mobile &&
                                    <Col className='col-1'>
                                        {mobile ? <h6>Lisätty</h6> : <h5>Lisätty</h5>}
                                    </Col>
                                }
                            </Row>
                        ) : (
                            <Row>{showOnlyUnread ? <strong>Ei lukemattomia tiedotteita</strong> : <strong>Ei tiedotteita</strong>}</Row>
                        )}

                        {!showOnlyUnread ? (
                            topics.map(topic =>
                                <Row key={topic.id} className={mobile ? 'fs-5' : 'fs-5 me-3'}>
                                    <Col className={`${getDateClass(topic?.ajankohta, 'headline')} ${mobile ? 'col-8 text-truncate' : 'col-4 text-truncate'}`}
                                        onClick={() => setSelectedTopic(topic)} 
                                        style={!selectedTopic ? { cursor: "pointer", color: "blue", textDecoration: "underline" }: {}}
                                    >
                                        {topic.otsikko}
                                    </Col>
                                    {!mobile && <Col className="col-3 text-truncate small">{formatText(topic.teksti)}</Col>}
                                    <Col className={`${getDateClass(topic?.ajankohta)} col-4`}>{topic?.ajankohta ? formatDate(topic.ajankohta, 'long') : ""}</Col>
                                    {!mobile &&
                                        <Col className='col-1 small'>
                                            <>
                                                {lastSeen < topic.createdAt ? (
                                                    <strong className='text-danger'>UUSI</strong>
                                                ) : (
                                                    formatDate(Number(topic.createdAt), 'created')
                                                )}
                                            </>
                                        </Col>
                                    }
                                </Row>
                            )
                        ) : (
                            <>
                                {unreadTopics.length > 0 &&
                                    unreadTopics.map(topic =>
                                        <Row key={topic.id} className={mobile ? 'fs-5' : 'fs-5 me-3'}>
                                            <Col className={`${getDateClass(topic?.ajankohta, 'headline')} ${mobile ? 'col-8 text-truncate' : 'col-4 text-truncate'}`}
                                                onClick={() => setSelectedTopic(topic)} 
                                                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                                            >
                                                {topic.otsikko}
                                            </Col>
                                            {!mobile && <Col className="col-3 text-truncate small">{formatText(topic.teksti)}</Col>}
                                            <Col className={`col-4 ${getDateClass(topic?.ajankohta)}`}>{topic?.ajankohta ? formatDate(topic.ajankohta, 'long') : ""}</Col>
                                            {!mobile && <Col className="col-1 small">{formatDate(Number(topic.createdAt), 'created')}</Col>}
                                        </Row>
                                    )
                                }
                            </>
                        )}
                    </Form>
                </Modal.Body>

                <Modal.Footer className="d-flex justify-content-center gap-5">
                    <Button
                        style={topicButtonStyle}
                        variant='warning'
                        disabled={!!selectedTopic}
                        className='shadow'
                        onClick={() => {
                            const now = Date.now()
                            localStorage.setItem(
                                NEW_TOPICS_KEY,
                                JSON.stringify({ read: true, date: now })
                            )
                                setShow(false)
                                setShowTopics(false)
                                setShowBanner(false)
                            }}
                        >
                        Sulje
                    </Button>
                </Modal.Footer>

                <SingleTopicModal 
                    mobile={mobile} 
                    selectedTopic={selectedTopic} 
                    setSelectedTopic={setSelectedTopic} 
                    formatDate={formatDate} 
                    getDateClass={getDateClass}
                    formatText={formatText}
                    topicButtonStyle={topicButtonStyle}
                    setConfirmTitle={setConfirmTitle}
                    setOnConfirm={setOnConfirm}
                />
            </div>
        </Modal>
    )
}

export default TopicsModal