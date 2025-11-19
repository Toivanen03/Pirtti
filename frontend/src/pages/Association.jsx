import Liidut from "../assets/images/liidut.jpg"
import Metsassa from "../assets/images/metsassa.jpg"
import Hiekkaleikit from "../assets/carousel-images/hiekkaleikit.jpg"
import Jalat from "../assets/carousel-images/jalat.jpg"
import BossModal from "../modals/BossModal"
import { useState } from "react"

const Association = ({ mobile, portrait }) => {
    const [showModal, setShowModal] = useState(false)

    return (
        <>
            {!mobile ? (
                <div className="container-fluid h-100 p-0 d-flex align-items-center justify-content-center content-text" style={{ width: '100vw' }}>
                    <div className="container text-center">
                        <h2 className={portrait ? "mt-5 mb-5" : "mt-5 mb-5 offset-4"}>Yhdistys</h2>

                        <div className="row gap-5">
                            {!portrait &&
                                <div className="col-4 d-flex flex-column me-5">
                                    <img
                                        src={Hiekkaleikit}
                                        alt="Lapsia hiekkalaatikolla"
                                        className="img-fluid rounded-4 border border-5 border-light"
                                    />
                                </div>
                            }

                            <div className={portrait ? "col-12 d-flex flex-column justify-content-center text-start mb-5" : "col-7 d-flex flex-column justify-content-center text-start mb-5"}>
                                <p className="content-text">
                                    Päiväkotiyhdistyksen hallinnosta ja taloudesta vastaa johtokunta, johon kuuluu puheenjohtajan lisäksi kuusi 
                                    varsinaista jäsentä ja neljä varajäsentä. Johtokunnan jäsenet ovat päiväkodeissamme hoidossa olevien lasten 
                                    vanhempia. Johtokunta kokoontuu tarpeen mukaan ja kokouksissa sihteerinä ja asioiden esittelijänä toimii päiväkodin 
                                    johtaja. 
                                </p>

                                <p>
                                    Yhdistyksen kannattajajäseneksi pääsee maksamalla vapaaehtoisen jäsenmaksun. Varoilla saamme 
                                    järjestettyä koko päiväkodin porukalle ohjelmaa sekä päivitettyä esimerkiksi leikkivälineitä. 
                                </p>

                                <p onClick={() => setShowModal(true)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>    
                                    Lisää tietoa päiväkodin johtajalta.
                                </p>
                            </div>
                        </div>

                        <div className="row mt-5 gap-5">
                            <div className={portrait ? "col-4 offset-1 me-5" : "col-4 offset-2"}>
                                <img
                                    src={Metsassa}
                                    alt="Lapsia metsäretkellä"
                                    className="img-fluid rounded-4 border border-5 border-light tilt-right"
                                    style={{ maxWidth: "350px" }}
                                />   
                            </div>

                            <div className="col-4">
                                <img
                                    src={Jalat}
                                    alt="Lapsia lepäämässä"
                                    className="img-fluid rounded-4 border border-5 border-light tilt-left"
                                    style={{ maxWidth: "350px" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container-fluid mx-auto content-text" style={{ width: '100vw' }}>
                    <div className="container text-center">
                        <h2 className="mt-4 mb-4">Yhdistys</h2>
                        <div className="row mb-5 d-flex flex-column align-items-center justify-content-center">
                            <p className="content-text">
                                Päiväkotiyhdistyksen hallinnosta ja taloudesta vastaa johtokunta, johon kuuluu puheenjohtajan lisäksi kuusi 
                                varsinaista jäsentä ja neljä varajäsentä. Johtokunnan jäsenet ovat päiväkodeissamme hoidossa olevien lasten 
                                vanhempia. Johtokunta kokoontuu tarpeen mukaan ja kokouksissa sihteerinä ja asioiden esittelijänä toimii päiväkodin 
                                johtaja. 
                            </p>

                            <img
                                src={Hiekkaleikit}
                                alt="Lapsia hiekkalaatikolla"
                                className="quotes-image tilt-right mt-4 mb-5"
                                style={{ maxWidth: '300px'}}
                            />

                            <p>
                                Yhdistyksen kannattajajäseneksi pääsee maksamalla vapaaehtoisen jäsenmaksun. Varoilla saamme 
                                järjestettyä koko päiväkodin porukalle ohjelmaa sekä päivitettyä esimerkiksi leikkivälineitä. 
                            </p>

                                                            <img
                                    src={Metsassa}
                                    alt="Lapsia metsäretkellä"
                                    className="quotes-image tilt-left mt-4 mb-5"
                                    style={{ maxWidth: "350px" }}
                                />

                            <p onClick={() => setShowModal(true)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>    
                                Lisää tietoa päiväkodin johtajalta.
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <BossModal showModal={showModal} setShowModal={setShowModal} mobile={mobile} />
        </>
    )
}

export default Association