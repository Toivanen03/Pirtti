import Viinimarjat from "../assets/images/viinimarjat.jpg"
import Omenat from "../assets/carousel-images/omenat.jpg"
import kasvi from "../assets/kasvi.gif"
import ImageCarousel from "../layout/ImageCarousel"

const Values = ({ mobile, portrait }) => {
    return (
            <>
                {!mobile ? (
                        <div className={`mt-5 container-fluid h-100 p-0 d-flex align-items-center justify-content-center content-text`} style={{ width: '100vw' }}>
                            <div className="container text-center">
                                <div className="row">
                                    <div className="col-8 d-flex flex-column">
                                        <div className="row mt-5 text-end">
                                            <h3>Päiväkotimme toiminnan arvot ja toimintaperiaatteet</h3>
                                        </div>

                                        <div className="container mt-5 d-flex justify-content-center">
                                            <ul className="text-start">
                                                <li><strong>Turvallisuus</strong> - lapsilla on fyysisesti ja psyykkisesti turvallinen kasvuympäristö</li>
                                                <li><strong>Avoimuus ja rehellisyys</strong> - avoin ja rehellinen yhteistyö perheiden kanssa</li>
                                                <li><strong>Luottamus</strong> - luottamuksellinen ilmapiiri lasten ja vanhempien kanssa</li>
                                                <li><strong>Kunnioittaminen</strong> - lasten ja perheiden yksilöllisyyden kunnioittaminen</li>
                                                <li><strong>Tasapuolisuus</strong> - lasten ja perheiden kohteleminen tasapuolisesti</li>
                                            </ul>
                                        </div>
                                    </div>

                                    <div className="col-4 mt-1">
                                        <img
                                            src={Viinimarjat}
                                            alt="Punaisia viinimarjoja pensaassa"
                                            className="img-fluid rounded-4 border border-5 border-light tilt-right"
                                            style={{ maxWidth: "200px" }}
                                        />
                                    </div>
                                <div>
                            </div>
                        </div>

                        <img
                            src={kasvi}
                            alt="Animaatio kasvin kasvusta"
                            style={{
                                width: !portrait ? '600px' : '400px',
                                position: 'absolute',
                                bottom: 0,
                                left: -200,
                                zIndex: '-999'
                            }}
                        />

                        <div className="row gap-5">
                            <div className="col-4 d-flex flex-column tilt-left">
                                <ImageCarousel home={false} />
                            </div>

                            <div className="col-7 d-flex flex-column justify-content-center">
                                <p className="content-text text-start">
                                    Toiminnassamme painotamme pienryhmätoimintaa, lapsikeskeisyyttä, turvallisuutta ja ympäristö-/luontokasvatusta. 
                                    Meiltä saat lapsellesi kodinomaisen ympäristön, jossa laadukasta varhaiskasvatusta toteuttaa kokenut ja työhönsä 
                                    sitoutunut henkilöstö. Teemme perheiden kanssa joustavaa yhteistyötä.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                ) : (
                    <div className="container-fluid px-0 mx-auto content-text" style={{ width: '100vw' }}>
                        <div className="container">
                            <h3 className="mt-4 mb-4 text-center">Päiväkotimme toiminnan arvot ja toimintaperiaatteet</h3>
                            <div className="row align-items-center justify-content-center text-center">
                                <div className="col-12 d-flex justify-content-center mb-3">
                                    <ImageCarousel home={false} />
                                </div>

                                <div className="col-12 col-md-8 text-start mx-auto">
                                    <ul className="ms-md-5 me-md-2">
                                        <li><strong>Turvallisuus</strong> - lapsilla on fyysisesti ja psyykkisesti turvallinen kasvuympäristö</li>
                                        <li><strong>Avoimuus ja rehellisyys</strong> - avoin ja rehellinen yhteistyö perheiden kanssa</li>
                                        <li><strong>Luottamus</strong> - luottamuksellinen ilmapiiri lasten ja vanhempien kanssa</li>
                                        <li><strong>Kunnioittaminen</strong> - lasten ja perheiden yksilöllisyyden kunnioittaminen</li>
                                        <li><strong>Tasapuolisuus</strong> - lasten ja perheiden kohteleminen tasapuolisesti</li>
                                    </ul>
                                </div>
                            </div>

                        <div className="container d-flex flex-column justify-content-center align-items-center">
                            <img
                                src={Omenat}
                                alt="Lapsia omenat käsissään"
                                className="quotes-image mt-5 mb-5"
                            />

                            <div className="row align-items-center justify-content-center mb-5">
                                <p className="content-text text-center">
                                    Toiminnassamme painotamme pienryhmätoimintaa, lapsikeskeisyyttä, turvallisuutta ja ympäristö-/luontokasvatusta. 
                                    Meiltä saat lapsellesi kodinomaisen ympäristön, jossa laadukasta varhaiskasvatusta toteuttaa kokenut ja työhönsä 
                                    sitoutunut henkilöstö. Teemme perheiden kanssa joustavaa yhteistyötä.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Values