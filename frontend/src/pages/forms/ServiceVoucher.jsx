import Button from "react-bootstrap/Button"
import { useNavigate } from "react-router-dom"

const PSHLink = `https://www.oppiminen.mikkeli.fi/varhaiskasvatus-ja-esiopetus/varhaiskasvatusyksikot/yksityinen-paivakotihoito/yksityisen-paivakodin-varhaiskaskasvatuksen-palveluseteli/`

const ServiceVoucher = ({ setShowFormArea, setFormType, mobile, state }) => {
    const navigate = useNavigate()

    return (
        <>
            {!mobile ? (
                <div className="d-flex flex-column justify-content-center content-text">
                    <strong className="mt-4">Löydät lisätietoa palvelusetelistä</strong>
                    <strong className="mb-5">Mikkelin kaupungin sivuilta.</strong>
                    <div className="row align-self-center d-flex gap-5">
                        <Button
                            variant="success"
                            style={{ width: '8vw' }}
                            onClick={() => {
                                window.open(PSHLink, '_blank')
                                setFormType(null)
                                setShowFormArea(false)
                            }}
                        >
                            Siirry
                        </Button>

                        <Button
                            variant="primary"
                            style={{ width: '8vw' }}
                            onClick={() => {
                                setShowFormArea(false)
                                setFormType(null)
                                if (state === 'fromFrontPage') navigate('/')
                            }}
                        >
                            {state === 'fromFrontPage' ? 'Takaisin' : 'Peruuta'}
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="d-flex flex-column justify-content-center text-center mobile-form">
                    <strong className="mt-3">Löydät lisätietoa palvelusetelistä</strong>
                    <strong className="mb-4">Mikkelin kaupungin sivuilta.</strong>
                    <div className="row align-self-center d-flex gap-5">
                        <Button
                            variant="success"
                            style={{ width: '30vw' }}
                            onClick={() => {
                                window.open(PSHLink, '_blank')
                                setFormType(null)
                                setShowFormArea(false)
                            }}
                        >
                            Siirry
                        </Button>

                        <Button
                            variant="primary"
                            style={{ width: '30vw' }}
                            onClick={() => {
                                setShowFormArea(false)
                                setFormType(null)
                                if (state === 'fromFrontPage') navigate('/')
                            }}
                        >
                            {state === 'fromFrontPage' ? 'Takaisin' : 'Peruuta'}
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}

export default ServiceVoucher