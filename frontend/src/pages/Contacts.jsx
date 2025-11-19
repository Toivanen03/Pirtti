import useWindowWidth from "../hooks/useWindowWidth"
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import MapsPlugin from "../layout/mapsPlugin"
import InstaLogo from '../assets/insta_with_white.png' // insta_transparent.png
import FbLogo from '../assets/fb_with_white.png'       // fb_transparent.png
import { GET_CONTACTS } from "../queries/queries"
import { useQuery } from '@apollo/client/react'

export const getPhone = (raw, type) => {
    if (!raw) return null

    const cleaned = raw.replace(/\s+/g, '')

    let international = cleaned
    if (/^0\d{6,}$/.test(cleaned)) {
        international = '+358' + cleaned.substring(1)
    }

    const formatted = cleaned.replace(/(\d{3,4})(\d{2,3})(\d{3,})/, '$1 $2 $3')

    if (type === 'clean') {
        return formatted
    } else if (type === 'int') {
        return international
    }
}

const Contacts = ({ mobile, portrait }) => {
    const { data } = useQuery(GET_CONTACTS)
    const width = useWindowWidth()
    const iconSize = width <= 768 ? '1em' : width < 992 ? '1.2em' : '1.5em'

    const phoneIcon = <FaPhone size={iconSize} />
    const envelopeIcon = <FaEnvelope size={iconSize} />
    const locationIcon = <FaMapMarkerAlt size={iconSize} />
    const clockIcon = <FaClock size={iconSize} />

    const mapsLink = `https://maps.google.com/maps/dir//Telk%C3%A4nkatu+2+50190+Mikkeli/@61.6883269,27.3015419,13z/data=!4m5!4m4!1m0!1m2!1m1!1s0x469aa19aa9538961:0x20eedce9abadc1b7`
    const email = `mailto:${data?.getContacts?.sahkoposti}`

    const map = true

    return (
        <div className="container-fluid row p-0 d-flex align-items-center justify-content-center content-text" style={{ width: '100vw' }}>
            <div className="row content">
                <div className={width > 864 ? "col-7" : "col-12"}>
                    <section className={mobile ? "col-12 ms-3 align-self-start mt-5" : "col-12 offset-2 align-self-start mt-5"}>
                        <h2 className={!mobile ? "mb-5" : "mb-4"}>Yhteystiedot</h2>
                        <div className="row">
                            <div className="col-1">
                                {phoneIcon}
                            </div>

                            <div className={mobile ? "col-6" : "col-5"}>
                                <span>Ronja Tarkiainen, päiväkodin johtaja</span>
                            </div>

                            <div className={mobile ? "col-5" : "col-3"}>
                                <span><a href={'tel:' + getPhone(data?.getContacts?.puhelin_1, 'int')} className="text-decoration-none" style={{ color: 'inherit' }}>{getPhone(data?.getContacts?.puhelin_1, 'clean')}</a></span>
                            </div>
                        </div>

                        <div className="row">
                            <div className={mobile ? "col-6 offset-1 mt-2" : "col-3 offset-1"}>
                                <span>Yläkerta</span>
                            </div>

                            <div className={mobile ? "col-5 mt-2" : "col-3 offset-2"}>
                                <span><a href={'tel:' + getPhone(data?.getContacts?.puhelin_2, 'int')} className="text-decoration-none" style={{ color: 'inherit' }}>{getPhone(data?.getContacts?.puhelin_2, 'clean')}</a></span>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-3 offset-1">
                                <span>Alakerta</span>
                            </div>

                            <div className={mobile ? "col-5 offset-3" : "col-3 offset-2"}>
                                <span><a href={'tel:' + getPhone(data?.getContacts?.puhelin_3, 'int')} className="text-decoration-none" style={{ color: 'inherit' }}>{getPhone(data?.getContacts?.puhelin_3, 'clean')}</a></span>
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

                        <div className={mobile ? "row mt-4" : "row mt-5"}>
                                <div className="col-1">
                                    <a href={mapsLink} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}>{locationIcon}</a>
                                </div>

                                <div className={mobile ? "col-2" : "col-3"}>
                                    <a href={mapsLink} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}><span>Osoite</span></a>
                                </div>

                                <div className={mobile ? "col-5 offset-4" : "col-3 offset-2"}>
                                    <a href={mapsLink} target="_blank" style={{ textDecoration: 'none', color: 'inherit' }}><span>Telkänkatu 2,<br />50190 Mikkeli</span></a>
                                </div>
                        </div>

                        <div className={mobile ? "row mt-4" : "row mt-5"}>
                            <div className="col-1">{clockIcon}</div>
                            <div className={mobile ? "col-10" : "col-6"}>
                                <span>Päiväkoti on avoinna arkisin klo 6.30 - 17.00</span>
                            </div>
                        </div>

                        {!mobile && <div className="row mt-5">
                            <div className="col-6 d-flex align-items-center">
                                <h6><strong>Pirtti sosiaalisessa mediassa:</strong></h6>
                            </div>

                            <div className="col d-flex flex-row gap-5">
                                <div className="col-1">
                                    <a href='https://www.facebook.com/paivakotiyhdistyspirttiry/' target='_blank'>
                                        <img src={FbLogo} width={'50vw'} />
                                    </a>
                                </div>

                                <div className="col-1">
                                    <a href='https://www.instagram.com/paivakotipirtti/#' target='_blank'>
                                        <img src={InstaLogo} width={'50vw'} />
                                    </a>
                                </div>
                            </div>
                        </div>}
                    </section>
                </div>

                <div className={mobile || portrait ? "col-12 ms-2 align-items-center d-flex justify-content-center" : "col-5 d-flex align-items-start justify-content-center"}>
                    {map && <MapsPlugin mobile={mobile} />}
                </div>
            </div>
        </div>
    )
}

export default Contacts