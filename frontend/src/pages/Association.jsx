import Metsassa from "../assets/images/metsassa.jpg"
import Hiekkaleikit from "../assets/carousel-images/hiekkaleikit.jpg"
import Jalat from "../assets/carousel-images/jalat.jpg"
import BossModal from "../modals/BossModal"
import BylawsModal from "../modals/BylawsModal"
import { useState, useEffect } from "react"
import { useQuery } from "@apollo/client/react"
import { GET_BYLAWS } from "../queries/queries"

const Association = ({ mobile, portrait, isFB }) => {
    const [showBossModal, setShowBossModal] = useState(false)
    const { data, loading } = useQuery(GET_BYLAWS)
    const [showModal, setShowModal] = useState(false)
    const [text1] = useState("Päiväkotiyhdistyksen hallinnosta ja taloudesta vastaa johtokunta, johon kuuluu puheenjohtajan lisäksi kuusi varsinaista jäsentä ja neljä varajäsentä. Johtokunnan jäsenet ovat päiväkodeissamme hoidossa olevien lasten vanhempia. Johtokunta kokoontuu tarpeen mukaan ja kokouksissa sihteerinä ja asioiden esittelijänä toimii päiväkodin johtaja.")
    const [text2] = useState("Yhdistyksen kannattajajäseneksi pääsee maksamalla vapaaehtoisen jäsenmaksun. Varoilla saamme järjestettyä koko päiväkodin porukalle ohjelmaa sekä päivitettyä esimerkiksi leikkivälineitä.")
    const [firstText, setFirstText] = useState("")
    const [secondText, setSecondText] = useState("")
    const [read] = useState(sessionStorage.getItem("associationRead"))

    useEffect(() => {
        let i = 0
        const interval1 = setInterval(() => {
            setFirstText(text1.slice(0, i + 1))
            i++

            if (i >= text1.length) {
                clearInterval(interval1)

                let j = 0

                const interval2 = setInterval(() => {
                    setSecondText(text2.slice(0, j + 1))
                    j++

                    if (j >= text2.length) {
                        clearInterval(interval2)
                    }
                }, 10)
            }
        }, 10)
        return () => {
            clearInterval(interval1)
            sessionStorage.setItem("associationRead", "true")
        }
    }, [])

    return (
        <>
            {!mobile ? (
                <div className="container-fluid h-100 p-0 d-flex align-items-center justify-content-center content-text mt-4" style={{ width: '100vw' }}>
                    <div className="container text-center">
                        <h2 className={portrait ? "mt-5 mb-5" : "mt-5 mb-5 offset-4"}>Yhdistys</h2>

                        <div className="row gap-5">
                            {!portrait &&
                                <div className="col-4 d-flex flex-column me-5">
                                    <img
                                        src={Hiekkaleikit}
                                        alt="Lapsia hiekkalaatikolla"
                                        className="img-fluid rounded-4 border border-2 light-border"
                                    />
                                </div>
                            }

                            <div className={portrait ? "col-12 d-flex flex-column justify-content-center text-start mb-5" : "col-7 d-flex flex-column justify-content-center text-start mb-5"}>
                                <p className="content-text" style={{ minHeight: '100px' }}>
                                    {read ? text1 : firstText}
                                </p>

                                <p style={{ minHeight: '80px' }}>
                                    {read ? text2 : secondText}
                                </p>

                                <div className={read ? "" : "ass-link"}>
                                    <p onClick={() => setShowBossModal(true)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>    
                                        Lisää tietoa päiväkodin johtajalta
                                    </p>
                                    {data?.bylawsDocument && 
                                        <p onClick={() => setShowModal(true)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>    
                                            Yhdistyksen säännöt
                                        </p>
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="row gap-5">
                            <div className={portrait ? "col-4 offset-1 me-5" : "col-4 offset-2"}>
                                <img
                                    src={Metsassa}
                                    alt="Lapsia metsäretkellä"
                                    className="img-fluid rounded-4 border border-2 light-border tilt-right"
                                    style={{ maxWidth: "350px" }}
                                />   
                            </div>

                            <div className="col-4">
                                <img
                                    src={Jalat}
                                    alt="Lapsia lepäämässä"
                                    className="img-fluid rounded-4 border border-2 light-border tilt-left"
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
                            <p className="content-text text-start" style={{minHeight: '200px'}}>
                                {read ? text1 : firstText}
                            </p>

                            <img
                                src={Hiekkaleikit}
                                alt="Lapsia hiekkalaatikolla"
                                className="quotes-image tilt-right mt-4 mb-5 border border-2 light-border p-0"
                                style={{ maxWidth: '300px'}}
                            />

                            <p className="text-start" style={{ minHeight: '110px'}}>
                                {read ? text2 : secondText}
                            </p>

                                <img
                                    src={Metsassa}
                                    alt="Lapsia metsäretkellä"
                                    className="quotes-image tilt-left mt-4 mb-5 border border-2 light-border p-0"
                                    style={{ maxWidth: "350px" }}
                                />

                            <div className="ass-link">
                                <p onClick={() => setShowBossModal(true)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>    
                                    Lisää tietoa päiväkodin johtajalta
                                </p>
                                {data?.bylawsDocument && 
                                    <p onClick={() => setShowModal(true)} style={{ cursor: "pointer", color: "blue", textDecoration: "underline" }}>    
                                        Yhdistyksen säännöt
                                    </p>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <BossModal showModal={showBossModal} setShowModal={setShowBossModal} mobile={mobile} />
            <BylawsModal showModal={showModal} setShowModal={setShowModal} mobile={mobile} portrait={portrait} data={data} loading={loading} isFB={isFB} />
        </>
    )
}

export default Association