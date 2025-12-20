import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { Button, Row, Col } from "react-bootstrap"
import UsersForm from "./forms/AdminForms/UsersForm"
import NewUserForm from "./forms/AdminForms/NewUserForm"
import UserProfile from "./forms/AdminForms/UserProfile"
import UpdateForm from "./forms/AdminForms/UpdateForm"
import ChangePasswordForm from "./forms/AdminForms/ChangePassworForm"
import { GET_FORM, GET_ALL_FORMS, MARK_FORM_READ, DELETE_APPLICATION } from "../queries/queries"
import { useLazyQuery, useMutation } from "@apollo/client/react"
import ApplicationModal from "../modals/ApplicationModal"
import { handleEndPoint } from "../layout/formatButtons"
import useWindowWidth from "../hooks/useWindowWidth"
import SearchModal from "../modals/SearchModal"

export const formatDate = (dateStr) => {
    const d = new Date(dateStr)
    const day = String(d.getDate()).padStart(2, "0")
    const month = String(d.getMonth() + 1).padStart(2, "0")
    const year = d.getFullYear()
    return `${day}.${month}.${year}`
}

const Admin = ({ setConfirmTitle, setOnConfirm, portrait }) => {
    const [searchParams, setSearchParams] = useState({ sukunimi: "", syntymaaika: "", handler: "", id: "" })
    const [formType, setFormType] = useState(null)
    const [selectedButton, setSelectedButton] = useState("vkh")
    const [user, setUser] = useState(null)
    const [applications, setApplications] = useState([])
    const [application, setApplication] = useState(null)
    const [showUnread, setShowUnread] = useState(true)
    const [sortBy, setSortBy] = useState("created")
    const [sortOrder, setSortOrder] = useState("desc")
    const { currentUser } = useContext(AuthContext)
    const [unreadVkhCount, setUnreadVkhCount] = useState(0)
    const [unreadEkhCount, setUnreadEkhCount] = useState(0)
    const [totalVkhCount, setTotalVkhCount] = useState(0)
    const [totalEkhCount, setTotalEkhCount] = useState(0)
    const [getForms, { data, loading, error, refetch }] = useLazyQuery(GET_ALL_FORMS)
    const [markFormRead] = useMutation(MARK_FORM_READ)
    const [deleteApplication] = useMutation(DELETE_APPLICATION)
    const [getForm] = useLazyQuery(GET_FORM)
    const [skip, setSkip] = useState(10)
    const [search, setSearch] = useState(false)
    const [searchResults, setSearchResults] = useState(null)
    const [limit, setLimit] = useState(10)
    const [selectedSearchResult, setSelectedSearchResult] = useState(null)
    const width = useWindowWidth()

    useEffect(() => {
        if (data?.getForms) {
            setUnreadVkhCount(data.getForms.vkh.unreadCount)
            setUnreadEkhCount(data.getForms.ekh.unreadCount)
            setTotalVkhCount(data.getForms.vkh.totalCount)
            setTotalEkhCount(data.getForms.ekh.totalCount)

            if (skip <= 10) {
                const addType = (forms, type) => forms.map(f => ({ ...f, formType: type }))
                setApplications(selectedButton === "vkh" ? addType(data.getForms.vkh.forms, 'vkh') : addType(data.getForms.ekh.forms, 'ekh'))
            }
        }

        if (error && !error.message?.includes('aborted') && error.name !== 'AbortError') {
            setConfirmTitle(`Virhe hakemusten haussa: ${error}`)
        }
    }, [data, error, selectedButton, skip])

    useEffect(() => {
        setSkip(10)
        setApplications([])
        
        getForms({ 
            variables: { formType: selectedButton, limit, skip: 0, read: showUnread ? false : true }, 
            fetchPolicy: "cache-and-network" 
        }).catch((err) => {
            if (err.name !== 'AbortError' && !err.message?.includes('aborted')) {
                console.error('Error fetching forms:', err)
            }
        })

    }, [showUnread, selectedButton])

    useEffect(() => {
        if (selectedSearchResult) handleDecryptApplication(selectedSearchResult.id, selectedSearchResult.formType)
    }, [selectedSearchResult])

    useEffect(() => {
        const read = sessionStorage.getItem("newApps") === "true"
        if (unreadEkhCount > 0 || unreadVkhCount > 0) {
            if (!read) {
                setConfirmTitle((unreadVkhCount + unreadEkhCount) + `${(unreadVkhCount + unreadEkhCount === 1) ? ' uusi hakemus' : ' uutta hakemusta'}`)
                sessionStorage.setItem("newApps", "true")
            }
        }
    }, [unreadEkhCount, unreadVkhCount])

    const loadMore = async () => {
        const prevScrollY = window.scrollY
        const prevScrollHeight = document.documentElement.scrollHeight

        const currentSkip = skip
        const newSkip = currentSkip + 10
        setSkip(newSkip)

        try {
            const { data: moreData } = await getForms({
                variables: { formType: selectedButton, limit, skip: currentSkip, read: showUnread ? false : true },
                fetchPolicy: "network-only"
            })

            const newFormsRaw = selectedButton === "vkh"
            ? moreData.getForms.vkh.forms
            : moreData.getForms.ekh.forms

            const newForms = newFormsRaw.map(f => ({ ...f, formType: selectedButton }))

            if (selectedButton === "vkh") {
                setTotalVkhCount(moreData.getForms.vkh.totalCount)
                setUnreadVkhCount(moreData.getForms.vkh.unreadCount)
            } else {
                setTotalEkhCount(moreData.getForms.ekh.totalCount)
                setUnreadEkhCount(moreData.getForms.ekh.unreadCount)
            }

            setApplications(prev => {
                const existingIds = new Set(prev.map(f => f.id))
                const merged = [...prev, ...newForms.filter(f => !existingIds.has(f.id))]
                return merged
            })

            const actualNewSkip = currentSkip + newForms.length
            if (actualNewSkip !== newSkip) {
                setSkip(actualNewSkip)
            }

            setTimeout(() => {
                const newScrollHeight = document.documentElement.scrollHeight
                const heightDiff = newScrollHeight - prevScrollHeight
                window.scrollTo(0, prevScrollY + heightDiff)
            }, 100)
        } catch (err) {
            if (err.name !== 'AbortError' && !err.message?.includes('aborted')) {
                console.error("Load more error:", err)
            }
        }
    }


    const handleQuery = async (params = {}, isSearch = false, formTypeParam, limit) => {
        setApplications([])
        setSkip(10)

        const queryFormType = limit === 9999 ? null : formTypeParam || selectedButton

        try {
            const { data } = await getForms({ 
                variables: { 
                    formType: queryFormType, 
                    limit, 
                    skip: 0, 
                    search: params,
                    read: isSearch ? undefined : (showUnread ? false : true)
                }, 
                fetchPolicy: "network-only" 
            })
            let combinedForms = []

            if (data.getForms.vkh) combinedForms = combinedForms.concat(data.getForms.vkh.forms.map(f => ({ ...f, formType: "vkh" })))
            if (data.getForms.ekh) combinedForms = combinedForms.concat(data.getForms.ekh.forms.map(f => ({ ...f, formType: "ekh" })))

            if (isSearch) setSearchResults(combinedForms)
            else {
                setApplications(combinedForms)
                setUnreadVkhCount(data.getForms.vkh?.unreadCount || 0)
                setUnreadEkhCount(data.getForms.ekh?.unreadCount || 0)
                setTotalVkhCount(data.getForms.vkh?.totalCount || 0)
                setTotalEkhCount(data.getForms.ekh?.totalCount || 0)
            }


        } catch (err) {
            if (err.name !== 'AbortError' && !err.message?.includes('aborted')) {
                setConfirmTitle(`Virhe: ${err}`)
            }
        }
    }

    const handleSort = (field) => {
        if (sortBy === field) setSortOrder(sortOrder === "asc" ? "desc" : "asc")
        else { setSortBy(field); setSortOrder("asc") }
    }

    const handleMarkRead = (id, appType) => {
        setConfirmTitle(`Haluatko merkitä hakemuksen käsitellyksi?`)
        setOnConfirm(() => async () => {
            await markFormRead({ variables: { id, formType: appType } })
            await refetch({ formType: selectedButton })
            setApplication(null)
        })
    }

    const handleDelete = (id, appType) => {
        setConfirmTitle("Haluatko varmasti poistaa hakemuksen?\nTOIMINTOA EI VOI PERUUTTAA!")
        setOnConfirm(() => async () => {
            try { await deleteApplication({ variables: { id, formType: appType } }); refetch({ formType: selectedButton }) }
            catch (error) { setConfirmTitle(`Virhe: ${error}`) }
            finally { setOnConfirm(null); setConfirmTitle("") }
        })
    }

    const handleDecryptApplication = async (id, appType) => {
        try {
            const { data } = await getForm({ variables: { id, formType: appType } })
            setApplication(data.getForm)
        } catch (err) { setConfirmTitle(`Virhe: ${err}`) }
    }

    const filteredApplications = applications
        .filter(a => a.formType === selectedButton)

    const sortedApplications = filteredApplications.sort((a, b) => {
        let compare = 0
        if (sortBy === "name") {
            compare = a.sukunimi_lapsi.localeCompare(b.sukunimi_lapsi, "fi", { sensitivity: "base" })
        } else if (sortBy === "birthdate") {
            compare = new Date(a.syntymaaika) - new Date(b.syntymaaika)
        } else if (sortBy === "created") {
            const aTime = Number(a.createdAt)
            const bTime = Number(b.createdAt)
            compare = aTime - bTime
        }
        return sortOrder === "asc" ? compare : -compare
    })

    const formatNumber = (value) => value > 0 ? (
        <span style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            backgroundColor: 'red',
            border: '1px solid white',
            borderRadius: '50%',
            width: '24px',
            height: '24px',
            fontSize: '14px',
        }}>{value}</span>
    ) : null

    const addButtonStyle = () => {
        return {
            fontSize: '18px', padding: '5px', color: 'brown', fontWeight: 'bold'
        }
    }

    return (
        <div className="container-fluid h-100 p-0 d-flex align-items-center justify-content-center mb-5 mt-5" style={{ width: "100vw" }}>
            <div className="container applications-container text-center p-2 mt-3">
                <Row className="d-flex justify-content-center gap-3">
                    <Button style={{ ...handleEndPoint('arvot'), ...addButtonStyle() }} onClick={() => setFormType(null)}>Hakemukset</Button>
                    <Button style={{ ...handleEndPoint('yhdistys'), ...addButtonStyle() }} onClick={() => setFormType("users")}>Käyttäjien hallinta</Button>
                    <Button style={{ ...handleEndPoint('yhteystiedot'), ...addButtonStyle() }} onClick={() => setFormType("newUser")}>Luo tunnukset</Button>
                    <Button style={{ ...handleEndPoint('hakemukset'), ...addButtonStyle() }} onClick={() => { setUser(currentUser); setFormType("profile") }}>Oma profiili</Button>
                    <Button style={{ ...handleEndPoint('lasten_suusta'), ...addButtonStyle() }} onClick={() => setFormType("update")}>Päivitä sivua</Button>
                </Row>

                {formType ? (
                    <div className="container p-4 mt-5 form-area admin-forms">
                        {formType === "password" && <ChangePasswordForm setConfirmTitle={setConfirmTitle} setFormType={setFormType} user={user} portrait={portrait} />}
                        {formType === "profile" && <UserProfile setConfirmTitle={setConfirmTitle} setFormType={setFormType} user={currentUser} portrait={portrait} />}
                        {formType === "newUser" && <NewUserForm setConfirmTitle={setConfirmTitle} setFormType={setFormType} portrait={portrait} />}
                        {formType === "users" && <UsersForm setConfirmTitle={setConfirmTitle} setUser={setUser} setOnConfirm={setOnConfirm} setFormType={setFormType} portrait={portrait} />}
                        {formType === "update" && <UpdateForm setConfirmTitle={setConfirmTitle} setFormType={setFormType} portrait={portrait} />}
                    </div>
                ) : (
                    <div className="container mt-5 mb-5 p-4 form-area admin-forms">
                        <div style={{ width: portrait ? "100%" : "90%", margin: "0 auto" }}>
                            <Row className="mb-2 align-items-center text-center">
                                <Col className={ width <= 768 ? "col-2 d-flex justify-content-start" : "col-3 d-flex justify-content-center"}>
                                    <div className="btn-group" role="group" aria-label="Hakemukset">
                                        <input type="radio" className="btn-check" name="applications" id="new" autoComplete="off" checked={showUnread} onChange={() => setShowUnread(true)} />
                                        <label className="btn btn-outline-info" htmlFor="new" style={{ color: '#111' }}>Uudet</label>

                                        <input type="radio" className="btn-check" name="applications" id="old" autoComplete="off" checked={!showUnread} onChange={() => setShowUnread(false)} />
                                        <label className="btn btn-outline-info" htmlFor="old" style={{ color: '#111' }}>Käsitellyt</label>
                                    </div>
                                </Col>

                                <Col className={width <= 768 ? "col-4 d-flex justify-content-center" : "col-6 d-flex justify-content-center"}>
                                    <div className="btn-group" role="group" aria-label="Hakemustyypit">
                                        <Button variant={selectedButton === 'vkh' ? 'info' : 'outline-info'} onClick={() => setSelectedButton('vkh')} style={{ minWidth: '10vw', color: '#111' }}>
                                            Päivähoitohakemukset {formatNumber(unreadVkhCount)}
                                        </Button>
                                        <Button variant={selectedButton === 'ekh' ? 'info' : 'outline-info'} onClick={() => setSelectedButton('ekh')} style={{ minWidth: '10vw', color: '#111' }}>
                                            Esikouluhakemukset {formatNumber(unreadEkhCount)}
                                        </Button>
                                    </div>
                                </Col>

                                <Col className="col-1 text-end">
                                    <Button variant="info" style={{ width: '6vw' }} onClick={() => { setSearchResults(null); setSearch(true) }}>Etsi</Button>
                                </Col>

                                {(() => {
                                    const currentCount = selectedButton === 'vkh' 
                                        ? (showUnread ? unreadVkhCount : totalVkhCount)
                                        : (showUnread ? unreadEkhCount : totalEkhCount)
                                    
                                    const isValidCount = currentCount > 0
                                    const isFirstPage = skip === 10
                                    const hasLoadedMore = skip > 10

                                    const hasMoreToLoad = isValidCount && 
                                        applications.length > 0 &&
                                        applications.length < currentCount &&
                                        !(isFirstPage && applications.length >= currentCount) &&
                                        skip >= 10

                                    const allLoaded = isValidCount && applications.length > 0 && applications.length >= currentCount
                                    const shouldShowReset = hasLoadedMore && allLoaded
                                    
                                    if (hasMoreToLoad) {
                                        return (
                                            <Col className="col-2 text-end">
                                                <Button variant="secondary" onClick={loadMore}>Lataa lisää</Button>
                                            </Col>
                                        )
                                    } else if (shouldShowReset) {
                                        return (
                                            <Col className="col-2 text-end">
                                                <Button variant="secondary" onClick={() => {
                                                    handleQuery({}, false, selectedButton)
                                                }}>
                                                    Palauta
                                                </Button>
                                            </Col>
                                        )
                                    }

                                    return null
                                })()}
                            </Row>

                            {sortedApplications.length > 0 ? (
                                <>
                                    <Row className="mt-5 mb-3 text-center">
                                        <Col className="col-2 text-start" style={{ cursor: "pointer" }} onClick={() => handleSort("name")}><strong>Sukunimi {sortBy === "name" && (sortOrder === "asc" ? <span style={{ color: 'blue'}}>▲</span> : <span style={{ color: 'blue'}}>▼</span>)}</strong></Col>
                                        <Col className="col-2 text-center" style={{ cursor: "pointer" }} onClick={() => handleSort("birthdate")}><strong>Syntymäaika {sortBy === "birthdate" && (sortOrder === "asc" ? <span style={{ color: 'blue'}}>▲</span> : <span style={{ color: 'blue'}}>▼</span>)}</strong></Col>
                                        <Col className="col-2 text-center" style={{ cursor: "pointer" }} onClick={() => handleSort("created")}><strong>Saapunut {sortBy === "created" && (sortOrder === "asc" ? <span style={{ color: 'blue'}}>▲</span> : <span style={{ color: 'blue'}}>▼</span>)}</strong></Col>
                                    </Row>

                                    {!loading && sortedApplications.map((app, i) => (
                                        <Row key={app.id} className="d-flex align-items-center text-start mb-3">
                                            <Col className="col-2 text-start"><span className="fw-bold me-4">{i + 1}</span>{app.sukunimi_lapsi}</Col>
                                            <Col className="col-2 text-center">{formatDate(app.syntymaaika)}</Col>
                                            <Col className="col-2 text-center">{formatDate(Number(app.createdAt))}</Col>
                                            <Col className="col-2 text-end"><Button variant="success" onClick={() => handleDecryptApplication(app.id, app.formType)}>Avaa hakemus</Button></Col>
                                            <Col className="col-3 text-center">{!app.read ? <Button onClick={() => handleMarkRead(app.id, app.formType)}>Merkitse käsitellyksi</Button> : `Käsitelty ${formatDate(Number(app.updatedAt))}`}</Col>
                                            <Col className="col-1 text-start"><Button variant="danger" onClick={() => handleDelete(app.id, app.formType)}>Poista</Button></Col>
                                        </Row>
                                    ))}
                                        <Row className="text-start fw-bold mt-4">
                                            <span>Näytetään {applications.length}/{selectedButton === 'ekh' ? totalEkhCount : totalVkhCount} hakemusta</span>
                                        </Row>
                                </>
                            ) : (
                                <Row className="mt-5 mb-4"><Col><strong>Ei{showUnread ? ' uusia ' : ' käsiteltyjä '}{selectedButton === 'vkh' ? 'päivähoito' : 'esikoulu'}hakemuksia</strong></Col></Row>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <SearchModal 
                handleQuery={handleQuery} 
                setSelectedSearchResult={setSelectedSearchResult} 
                searchResults={searchResults} 
                setSearchResults={setSearchResults} 
                search={search} 
                setSearch={setSearch} 
                searchParams={searchParams}
                setSearchParams={setSearchParams} 
                onSearch={(params) => handleQuery(params, true, null, 9999)} 
                portrait={portrait} 
            />

            <ApplicationModal 
                application={application} 
                setApplication={setApplication} 
                handler={application?.handler} 
                handleMarkRead={() => handleMarkRead(application.id, application?.formType)} 
                portrait={portrait} />
        </div>
    )
}

export default Admin