import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './layout/Header'
import Footer from './layout/Footer'
import Home from './pages/Home'
import Values from './pages/Values'
import Contacts from './pages/Contacts'
import Association from './pages/Association'
import Applications from './pages/Applications'
import Quotes from './pages/Quotes'
import Admin from './pages/Admin'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Consent from './layout/Consent'
import { AuthProvider } from './contexts/AuthContext'
import RequireAdmin from './contexts/RequireAdmin'
import ConfirmModal from './modals/ConfirmModal'
import useIsMobile from './hooks/useIsMobile'
import { useIsPortrait } from './hooks/useIsPortrait'
import { COOKIE_KEY } from './layout/Consent'
import Loader from './Loader'
import ScrollToTop from './utils/ScrollToTop'

function App() {
  const [confirmTitle, setConfirmTitle] = useState(null)
  const [scrolling, setScrolling] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [onConfirm, setOnConfirm] = useState(() => () => {})
  const [consent, setConsent] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const [cookieChoiceMade, setCookieChoiceMade] = useState(() => {
    return !!localStorage.getItem(COOKIE_KEY)
  })

  const mobile = useIsMobile()
  const portrait = useIsPortrait()

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(COOKIE_KEY))
    if (stored?.consent) {
        setConsent(true)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 1500)
    return () => clearTimeout(timer)

  }, [])

  useEffect(() => {
    if (confirmTitle === null) {
      setOnConfirm(() => () => {})
    }
  }, [confirmTitle])

  useEffect(() => {
    const mainEl = document.querySelector('main')
    if (!mobile && !portrait && !cookieChoiceMade) {    /* Mobiilissa ja kapealla näytöllä evästekysely poistettu tarpeettomana*/
      mainEl.classList.add('disabled')
    } else {
      mainEl.classList.remove('disabled')
    }
  }, [cookieChoiceMade, mobile, portrait])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setScrolling(true)
      } else if (currentScrollY < lastScrollY) {
        setScrolling(false)
      }

      setLastScrollY(currentScrollY)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)

  }, [lastScrollY])

  return (
    <Router>
      <AuthProvider>
        {!loaded && <div className="loader-overlay"><Loader /></div>}
        <div className="app-wrapper">
          <main className="main-content">
            <ScrollToTop />
            <Header setConfirmTitle={setConfirmTitle} setOnConfirm={setOnConfirm} mobile={mobile} portrait={portrait} scrolling={scrolling} />
            <Routes>
              {!mobile && <Route path="/admin" element={<RequireAdmin><Admin setConfirmTitle={setConfirmTitle} setOnConfirm={setOnConfirm} portrait={portrait} /></RequireAdmin>} />}
              <Route path="/" element={<Home mobile={mobile} consent={consent} portrait={portrait} />} />
              {!mobile && <Route path="/login" element={<Login setConfirmTitle={setConfirmTitle} />} />}
              <Route path="/arvot" element={<Values mobile={mobile} portrait={portrait} />} />
              <Route path='/yhdistys' element={<Association mobile={mobile} portrait={portrait} />} />
              <Route path="/yhteystiedot" element={<Contacts mobile={mobile} portrait={portrait} />} />
              <Route path="/hakemukset" element={<Applications setConfirmTitle={setConfirmTitle} setOnConfirm={setOnConfirm} mobile={mobile} portrait={portrait} />} />
              <Route path="/lasten_suusta" element={<Quotes mobile={mobile} portrait={portrait} />} />
              <Route path="*" element={<NotFound mobile={mobile} />} />
            </Routes>
          </main>
          <Footer mobile={mobile} scrolling={scrolling} portrait={portrait} />
          {(!mobile && !portrait) &&  <Consent setCookieChoiceMade={setCookieChoiceMade} setConsent={setConsent} mobile={mobile} portrait={portrait} />}    {/* Mobiilissa evästekysely poistettu tarpeettomana*/}
        </div>
        <ConfirmModal title={confirmTitle} setConfirmTitle={setConfirmTitle} onConfirm={onConfirm} />
      </AuthProvider>
    </Router>
  )
}

export default App
