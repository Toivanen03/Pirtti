import { Form, Modal, Button } from 'react-bootstrap'
import { FaEnvelope, FaPhone } from 'react-icons/fa'
import { useState, useEffect } from 'react'
import { GET_CONTACTS } from '../queries/queries'
import { useQuery } from '@apollo/client/react'
import { getPhone } from '../pages/Contacts'
import useWindowWidth from '../hooks/useWindowWidth'
import { useIsPortrait } from '../hooks/useIsPortrait'

const BossModal = ({ showModal, setShowModal, mobile }) => {
    const { data, loading } = useQuery(GET_CONTACTS)
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const portrait = useIsPortrait()
 
    useEffect(() => {
        if (!loading && data) {
            setPhone(data?.getContacts?.puhelin_1)
            setEmail(`mailto:${data?.getContacts?.sahkoposti}`)
        }

    }, [loading, data])

    const width = useWindowWidth()
    const iconSize = width <= 768 ? '1em' : width < 992 ? '1.2em' : '1.5em'

    const phoneIcon = <FaPhone size={iconSize} />
    const envelopeIcon = <FaEnvelope size={iconSize} />

    return (
        <Modal id="ic-modal" show={showModal} size="md" className='mb-5' centered>
            <Modal.Header>
                <strong>Päiväkodin johtaja</strong>
            </Modal.Header>

            <Modal.Body className={mobile ? "text-start" : "text-start offset-1"}>
                <Form>
                    <div className="row">
                        <div className="col-1">
                            {phoneIcon}
                        </div>

                        <div className={mobile ? "col-6" : "col-5"}>
                            <span>Ronja Tarkiainen</span>
                        </div>

                        <div className="col-5">
                            <span><a href={'tel:' + getPhone(phone, 'int')} className="text-decoration-none" style={{ color: 'inherit' }}>{getPhone(phone, 'clean')}</a></span>
                        </div>
                    </div>

                    <div className={mobile ? "row mt-4" : "row mt-5"}>
                        <div className="col-1">
                            <a href={email} style={{ textDecoration: 'none', color: 'inherit' }}>{envelopeIcon}</a>
                        </div>

                        <div className="col-3">
                            <a href={email} style={{ textDecoration: 'none', color: 'inherit' }}><span>Sähköposti</span></a>
                        </div>

                        <div className={mobile ? "col-3 offset-3" : "col-3 offset-2"}>
                            <a href={email} style={{ textDecoration: 'none', color: 'inherit' }}><span>{email.split(':')[1]}</span></a>
                        </div>
                    </div>
                </Form>
            </Modal.Body>

            <Modal.Footer className="d-flex justify-content-center">
                <Button variant='warning' onClick={() => setShowModal(false)} style={{ width: mobile ? '28vw' : '8vw' }}>Sulje</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BossModal