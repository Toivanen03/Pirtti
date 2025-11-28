import { useNavigate } from "react-router-dom"
import ImageCarousel from "../layout/ImageCarousel"
import Metsassa from "../assets/images/metsassa.jpg"
import Puu from "../assets/images/puu.jpg"
import ICModal from "../modals/ICModal"
import { useState } from "react"

const MobileHome = ({ width }) => {
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            <ImageCarousel home={true} />
            <div className="container mb-5 content-text" style={{ width: '100vw' }}>
                <div className="row">
                    <div className="col-10 offset-1 p-0">
                        <section className="col-12 align-self-center mt-5">
                            <h2 className="mb-4">Päiväkoti Pirtti</h2>
                            <p className="text-start">
                                <strong>Päiväkoti Pirtti</strong> on Päiväkotiyhdistys Pirtti ry:n ylläpitämä, voittoa tavoittelematon yksityinen päiväkoti.
                                Päiväkoti on aloittanut toimintansa vuonna 1977 ja se sijaitsee Tikanpellon alueella Mikkelissä.
                                Mikkelin kaupunki valvoo päiväkodin toimintaa ja sen toimintaa ohjaavat samat lait ja asetukset kuin kunnallista varhaiskasvatusta.
                                Päiväkodissa annetaan myös esiopetussuunnitelman mukaista esiopetusta.
                            </p>
                        </section>

                        <section className="col-12 p-0 me-5 mt-4">
                            <h3>Ryhmät</h3>
                            <ul>
                                <li>Nuput, 1-3 -vuotiaat</li>
                                <li>Sinikellot, 3-5 -vuotiaat</li>
                                <li>Esikot, esikouluryhmän toteutuessa</li>
                            </ul>
                            <p>
                                Päiväkodissamme on yhteensä 43 varhaiskasvatus- ja esiopetuspaikkaa.
                                Päiväkodin aukioloaika on <strong>ma-pe 6.30-17.00.</strong>
                            </p>
                            <i>Hoitoaikavaihtoehdot kokopäivähoidossa: max 15 pv/kk tai max 10 pv/kk.</i>
                            <p className="mt-3">
                                Päiväkodissamme on käytössä <span onClick={() => navigate('/hakemukset', {state: 'fromFrontPage'})} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>yksityisen päiväkotihoidon palveluseteli</span>, jota perhe hakee Mikkelin kaupungilta päivähoitopaikan saatuaan.
                            </p>
                        </section>

                        <section className="col-12 text-center mt-4">
                            <img
                                src={Metsassa}
                                alt="Lapset metsässä"
                                className="img-fluid rounded-4 border border-2 light-border mb-3"
                                style={{ maxWidth: "300px" }}
                            />
                        </section>

                        <section className="col-12 text-start mt-4">
                            <p>
                                Omavalvonnalla tarkoitetaan laadun ja asiakasturvallisuuden omatoimista varmistamista, jotta toiminnassamme 
                                toteutuisivat lainsäädännön ja palveluntuottajan omalle toiminnalleen asettamat laatuvaatimukset. 
                                Omavalvontasuunnitelma löytyy myös alakerran ilmoitustaululta. 
                            </p>
                            <p 
                                onClick={() => setShowModal(true)} 
                                style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}
                            >
                                Pirtin omavalvontasuunnitelma.
                            </p>
                        </section>

                        <section className="col-12 text-center mt-4">
                            <img
                                src={Puu}
                                alt="Lapsia puun alla"
                                className="img-fluid rounded-4 border border-2 light-border"
                                style={{ maxWidth: "300px" }}
                            />
                        </section>
                    </div>
                </div>
            </div>

            <ICModal showModal={showModal} setShowModal={setShowModal} mobile={true} width={width} />
        </>
    )
}

export default MobileHome