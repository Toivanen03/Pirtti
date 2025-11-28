import useWindowWidth from "../hooks/useWindowWidth"
import useWindowHeight from "../hooks/useWindowHeight"
import ImageCarousel from "../layout/ImageCarousel"
import Metsassa from "../assets/images/metsassa.jpg"
import Tehtavat from "../assets/images/tehtavat.jpg"
import Puu from "../assets/images/puu.jpg"
import ICModal from "../modals/ICModal"
import FbPlugin from "../layout/fb-plugin"
import MobileHome from "./MobileHome"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Home = ({ consent, mobile, portrait }) => {
    const width = useWindowWidth()
    const height = useWindowHeight()
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            {!mobile ? (
                <>
                    <ImageCarousel home={true} />
                    <div className="container-fluid content-text" style={{ width: '100vw' }}>
                        <div className="row d-flex align-items-start">
                            <div
                                className={
                                    width < 768
                                    ? "col-10 d-flex flex-column p-0"
                                    : portrait
                                    ? "col-11 d-flex flex-column p-0"
                                    : consent
                                    ? "col-10 d-flex flex-column p-0"
                                    : "col-12 d-flex flex-column p-0"
                                }
                                >
                                <section className="col-12 align-self-center mt-5 ps-5 pe-5">
                                    <h2 className="mb-4">Päiväkoti Pirtti</h2>
                                    <p>
                                        <strong>Päiväkoti Pirtti</strong> on Päiväkotiyhdistys Pirtti ry:n ylläpitämä, voittoa tavoittelematon yksityinen päiväkoti.
                                    </p>
                                    <p>
                                        Päiväkoti on aloittanut toimintansa vuonna 1977 ja se sijaitsee Tikanpellon alueella Mikkelissä. Talomme on kodinomainen ja pihamme tarjoaa monipuolisen ympäristön puineen ja marjapensaineen.
                                        Mikkelin kaupunki valvoo päiväkodin toimintaa ja sen toimintaa ohjaavat samat lait ja asetukset kuin kunnallista varhaiskasvatusta.
                                        Päiväkodissa annetaan myös esiopetussuunnitelman mukaista esiopetusta.
                                    </p>
                                </section>

                                <div className="row mt-5 mb-4 justify-content-center">
                                    <section className="col-6 p-0 me-5">
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

                                    <section className="col-3 align-self-center">
                                        <img
                                            src={Metsassa}
                                            alt="Lapset metsässä"
                                            className="img-fluid rounded-4 border border-2 light-border tilt-left"
                                            style={width > 768 ? { maxWidth: "400px" } : { maxWidth: "350px" }}
                                        />
                                    </section>
                                </div>

                                <div className={portrait ? "row mb-5 mt-3" : "row mt-5"}>
                                    <div className={portrait ? "col-2 offset-1 text-center" : "col-3 offset-1 text-center"}>
                                        <section className="mt-5">
                                            <img
                                                src={Tehtavat}
                                                alt="Lapset oppimassa"
                                                className="img-fluid rounded-4 border border-2 light-border"
                                                style={{ maxWidth: "300px" }}
                                            />
                                        </section>
                                    </div>

                                    <div className={portrait ? "col-6 offset-3 text-start align-items-center justify-content-end d-flex" : "col-4 text-start align-items-center d-flex ms-5 me-5"}>
                                        <section>
                                            <p>
                                                Omavalvonnalla tarkoitetaan laadun ja asiakasturvallisuuden omatoimista varmistamista, jotta toiminnassamme 
                                                toteutuisivat lainsäädännön ja palveluntuottajan omalle toiminnalleen asettamat laatuvaatimukset. 
                                                Omavalvontasuunnitelma löytyy myös alakerran ilmoitustaululta. 
                                            </p>
                                            <p onClick={() => setShowModal(true)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>
                                                Pirtin omavalvontasuunnitelma.
                                            </p>
                                        </section>
                                    </div>

                                    {!portrait &&
                                        <div className="col-3">
                                            <section>
                                                <img
                                                    src={Puu}
                                                    alt="Lapsia puun alla"
                                                    className="img-fluid rounded-4 border border-2 light-border tilt-right"
                                                    style={{ maxWidth: "250px" }}
                                                />
                                            </section>
                                        </div>
                                    }
                                </div>
                            </div>

                            {!portrait && width > 865 && (
                                <div className="col-2 p-0 d-flex flex-column">
                                    {consent && <FbPlugin width={width} height={height} />}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <MobileHome width={width} />
            )}
            <ICModal showModal={showModal} setShowModal={setShowModal} mobile={mobile} portrait={portrait} />
        </>
    )
}

export default Home
