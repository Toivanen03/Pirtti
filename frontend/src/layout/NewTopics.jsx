import { useState, useEffect } from "react"
import { Button, Row, Col } from "react-bootstrap"
import TopicsModal from "../modals/TopicsModal"
import { GET_TOPICS } from '../queries/queries'
import { useQuery } from '@apollo/client/react'
import { AuthContext } from "../contexts/AuthContext"
import { useContext } from "react"

export const NEW_TOPICS_KEY = "topicsRead"

const NewTopics = ({ mobile, show, setShow, setConfirmTitle, setOnConfirm, setUnreadCount, portrait }) => {
    const { data, loading } = useQuery(GET_TOPICS)
    const [showBanner, setShowBanner] = useState(false)
    const [showTopics, setShowTopics] = useState(false)
    const buttonStyle = { width: mobile ? '30vw' : portrait ? '10vw' : '6vw'}
    const { currentUser } = useContext(AuthContext)

    useEffect(() => {
        if (!loading && data) {
            const topics = data.getTopics
            const stored = JSON.parse(localStorage.getItem(NEW_TOPICS_KEY))
            const lastRead = stored?.date || 0

            const hasUnread = topics.some(topic => topic.createdAt > lastRead)
            if (!currentUser?.id) setShowBanner(hasUnread)
        }
    }, [loading, data, currentUser])

    useEffect(() => {
        if (show) setShowTopics(true)
    }, [show])

    const handleAccept = () => {
        setShowTopics(true)
        setShowBanner(false)
         setUnreadCount(0)
    }

    const handleReject = () => {
        setShowBanner(false)
        setShow(false)
    }

    return (
        <>
            {showBanner && (
                <div className="newtopics-banner">
                    <Row className="d-flex align-items-center text-center" style={{ width: '100vw' }}>
                        <Row>
                            <Col><span>Uusia ilmoituksia</span></Col>
                        </Row>
                        <Row className="gap-2">
                            <Col className={portrait ? "col-2 offset-4 mt-4" : !mobile ? "col-1 offset-5 mt-4" : "col-2 offset-2 mt-4"}>
                                <Button variant="info" onClick={handleAccept} style={buttonStyle} className='shadow'>
                                    Katso
                                </Button>
                            </Col>
                            <Col className={portrait ? "col-2 mt-4" : !mobile ? "col-1 mt-4" : "col-2 offset-2 mt-4"}>
                                <Button variant="warning" onClick={handleReject} style={buttonStyle} className='shadow'>
                                    Hylkää
                                </Button>
                            </Col>
                        </Row>
                    </Row>
                </div>
            )}

            <TopicsModal
                topics={data?.getTopics || []}
                showTopics={showTopics}
                setShowTopics={setShowTopics}
                mobile={mobile}
                setShowBanner={setShowBanner}
                setShow={setShow}
                setConfirmTitle={setConfirmTitle}
                setOnConfirm={setOnConfirm}
                setUnreadCount={setUnreadCount}
            />
        </>
    )
}

export default NewTopics