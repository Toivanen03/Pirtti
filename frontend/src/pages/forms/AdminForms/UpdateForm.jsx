import { useState } from "react"
import { Button, Row, Col } from "react-bootstrap"
import { UPDATE_CONTACTS, GET_CONTACTS, CREATE_TOPIC, GET_QUOTES, ADD_QUOTE, UPDATE_QUOTE_DESCRIPTION, UPDATE_QUOTE_TITLE, GET_TOPICS } from '../../../queries/queries'
import { useMutation } from '@apollo/client/react'
import ContactUpdate from "./UpdateForms/ContactUpdate"
import UpdateQuotes from "./UpdateForms/UpdateQuotes"
import UpdateTopics from "./UpdateForms/UpdateCurrentTopics"
import InternalControlPlan from "./UpdateForms/InternalControlPlan"

const contactFields = {
    puhelin_1: "",
    puhelin_2: "",
    puhelin_3: "",
    sahkoposti: ""
}

const topicsFields = {
    otsikko: "",
    ajankohta: "",
    teksti: "",
}

const quotesFields = {
    quotes_kuvaus: "",
    quotes_lohko: 0,
    quotes_otsikko: "",
    quote: ""
}

const validateFormatting = (text) => {
    if (!text) return ''

    const tokens = text.split(/(##|\*\*)/)
    const stack = []

    for (const token of tokens) {
        if (token === '##' || token === '**') {
            if (stack.length === 0) {
                stack.push(token)
            } else {
                const last = stack[stack.length - 1]
                if (last === token) {
                    stack.pop()
                } else {
                    if (stack.length === 1 && last !== token) {
                        stack.push(token)
                    } else {
                        return `Muotoilumerkkien järjestys on väärä.`
                    }
                }
            }
        }
    }

    if (stack.length > 0) {
        return `Muotoiluvirhe. Tarkista tekstin korostusmerkinnät.`
    }

    return ''
}

const UpdateForm = ({ setConfirmTitle, setFormType, portrait }) => {
    const [updateContacts] = useMutation(UPDATE_CONTACTS)
    const [createTopic] = useMutation(CREATE_TOPIC)
    const [updateDescription] = useMutation(UPDATE_QUOTE_DESCRIPTION)
    const [updateQuoteBlockTitle] = useMutation(UPDATE_QUOTE_TITLE)
    const [addQuote] = useMutation(ADD_QUOTE)
    const [contactFormData, setContactFormData] = useState(contactFields)
    const [topicsFormData, setTopicsFormData] = useState(topicsFields)
    const [quotesFormData, setQuotesFormData] = useState(quotesFields)

    const handleContactsChange = (e) => {
        let { name, value } = e.target
        
        setContactFormData(prev => ({
            ...prev,
            [name]: value
        }))

    }

    const handleTopicsChange = (e) => {
        let { name, value } = e.target
        
        setTopicsFormData(prev => ({
            ...prev,
            [name]: value
        }))

    }

    const handleQuotesChange = (e) => {
        let { name, value } = e.target

        setQuotesFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleContactsSubmit = async (e) => {
        e.preventDefault()

        if (Object.values(contactFormData).every(field => field === "")) {
            setConfirmTitle("VIRHE: Kaikki syötekentät ovat tyhjiä. Syötä ainakin yksi uusi arvo päivittääksesi. Tietoja ei muutettu.")
            return
        }

        try {
            const response = await updateContacts({
                variables: {
                    puhelin_1: contactFormData.puhelin_1,
                    puhelin_2: contactFormData.puhelin_2,
                    puhelin_3: contactFormData.puhelin_3,
                    sahkoposti: contactFormData.sahkoposti,
                },
                refetchQueries: [{ query: GET_CONTACTS }]
            })

            if (response.error) {
                setConfirmTitle('Virhe:' + response.error.message)
            } else if (response.data) {
                setConfirmTitle(`Yhteystiedot päivitetty.`)
                setContactFormData(contactFields)
            }
        } catch (error) {
            setConfirmTitle(`Virhe: ${error}`)
        }
    }

    const handleTopicsSubmit = async (e) => {
        e.preventDefault()

        if (Object.values(topicsFormData).every(field => field === "")) {
            setConfirmTitle("VIRHE: Kaikki syötekentät ovat tyhjiä. Viestiä ei lisätty.")
            return
        }

        const invalidInput = validateFormatting(topicsFormData.teksti)

        if (invalidInput) {
            setConfirmTitle(invalidInput)
            return
        }

        try {
            const response = await createTopic({
                variables: {
                    otsikko: topicsFormData.otsikko,
                    ajankohta: topicsFormData.ajankohta,
                    teksti: topicsFormData.teksti,
                },
                refetchQueries: [{ query: GET_TOPICS }]
            })

            if (response.error) {
                setConfirmTitle('Virhe:' + response.error.message)
            } else if (response.data) {
                setConfirmTitle(`Merkintä lisätty.`)
                setTopicsFormData(topicsFields)
            }
        } catch (error) {
            setConfirmTitle(`Virhe: ${error}`)
        }
    }

    const handleQuotesSubmit = async (e) => {
        e.preventDefault()

        if (Object.values(quotesFormData).every(field => field === "" || field === 0)) {
            setConfirmTitle("VIRHE: Osion kaikki kentät ovat tyhjiä. Lainauksia ei lisätty.")
            return
        }

        let response

        try {
            if (quotesFormData.quotes_kuvaus && !quotesFormData.quotes_lohko && !quotesFormData.quotes_otsikko && !quotesFormData.quote) {
                response = await updateDescription({
                    variables: {
                        quotes_kuvaus: quotesFormData.quotes_kuvaus
                    },
                    refetchQueries: [{ query: GET_QUOTES }]
                })
            }

            else if (quotesFormData.quotes_lohko && quotesFormData.quotes_otsikko && !quotesFormData.quote) {
                response = await updateQuoteBlockTitle({
                    variables: {
                        quotes_lohko: Number(quotesFormData.quotes_lohko),
                        quotes_otsikko: quotesFormData.quotes_otsikko
                    },
                    refetchQueries: [{ query: GET_QUOTES }]
                })

            }

            else if (quotesFormData.quotes_lohko && quotesFormData.quote) {
                response = await addQuote({
                    variables: {
                        quotes_lohko: Number(quotesFormData.quotes_lohko),
                        quote: quotesFormData.quote
                    },
                    refetchQueries: [{ query: GET_QUOTES }]
                })

            } else {
                setConfirmTitle('VIRHE: Päivitä yhdellä kertaa VAIN kuvaus, TAI lohkon otsikko, TAI lisää lainaus.')
                return
            }

            if (response) {
                setConfirmTitle("Sivun päivitys onnistui.")
                setQuotesFormData(quotesFields)
            }

        } catch (error) {
            setConfirmTitle(`Virhe: ${error.message || error}`)
        }
    }

    return (
        <>
            <div className="d-flex align-items-center justify-content-between position-relative" style={{ width: '100%' }}>
                <h2 className="m-0 position-absolute top-50 start-50 translate-middle">
                    Sivuston päivitys
                </h2>
                <Button 
                    className="ms-auto"
                    style={{ width: '10vw' }}
                    variant="secondary"
                    onClick={() => {
                        setFormType(null)
                    }}
                    >
                        Sulje
                </Button>
            </div>

            <div className="container mt-5">
                <Row>
                    <Col className="col-4">
                    {portrait ? <h5>Yhteystietojen päivitys</h5> : <h4>Yhteystietojen päivitys</h4>}
                        <ContactUpdate handleSubmit={handleContactsSubmit} handleChange={handleContactsChange} formData={contactFormData} portrait={portrait} />
                    </Col>
                    <Col className="col-8">
                        {portrait ? <h5>"Ajankohtaista" -osion päivitys</h5> : <h4>"Ajankohtaista" -osion päivitys</h4>}
                        <UpdateTopics handleSubmit={handleTopicsSubmit} handleChange={handleTopicsChange} formData={topicsFormData} portrait={portrait} />
                    </Col>
                </Row>
                <Row className="mt-5">
                    <Col className="col-4 offset-1 align-items-center d-flex">
                        {portrait ? <h5>"Lasten suusta" -osion päivitys</h5> : <h4>"Lasten suusta" -osion päivitys</h4>}
                    </Col>
                    <Col className="col-7 text-start">
                        <span className="text-info">Kaikkia alla olevia kenttiä <i>ei tarvitse täyttää</i>. Voit muokata sivun kuvaustekstiä muuttamatta muita tietoja, tai vaihtaa yksittäisen lohkon otsikkoa. 
                            Vaihtaessasi lohkon otsikkoa <i>tai</i> lisätessäsi uutta lainausta, valitse ensin lohko, johon muutos kohdistuu. Lohko 1 on sivulla ylimpänä.</span>
                    </Col>
                </Row>
                <Row>
                    <UpdateQuotes 
                        handleSubmit={handleQuotesSubmit} 
                        handleChange={handleQuotesChange} 
                        formData={quotesFormData} 
                        setFormData={setQuotesFormData} 
                        quotesFields={quotesFields} 
                        setConfirmTitle={setConfirmTitle}
                        portrait={portrait} 
                    />
                </Row>
                <Row className="mt-5">
                    {portrait ? <h5 className="text-start ms-3">Omavalvontasuunnitelman lataus</h5> : <h4 className="text-start ms-3">Omavalvontasuunnitelman lataus</h4>}
                    <InternalControlPlan setConfirmTitle={setConfirmTitle} portrait={portrait} />
                </Row>
            </div>
        </>
    )
}

export default UpdateForm