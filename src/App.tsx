import { AnimatePresence, MotionConfig, motion } from 'motion/react'
import { useEffect } from 'react'
import { BrowserRouter, HashRouter, Route, Routes, useLocation } from 'react-router'

import { Footer } from './components/Footer'
import { Nav } from './components/Nav'
import { ToastProvider } from './components/Toast'
import { ShortlistProvider } from './lib/shortlist'
import { About } from './pages/About'
import { Article } from './pages/Article'
import { Contact } from './pages/Contact'
import { Home } from './pages/Home'
import { Join } from './pages/Join'
import { Journal } from './pages/Journal'
import { NotFound } from './pages/NotFound'
import { Roster } from './pages/Roster'
import { Shortlist } from './pages/Shortlist'
import { Styleguide } from './pages/Styleguide'
import { TalentProfile } from './pages/TalentProfile'
import { Work } from './pages/Work'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [pathname])
  return null
}

function Pages() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        id="main"
        tabIndex={-1}
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="flex-1 focus:outline-none"
      >
        <Routes location={location}>
          <Route index element={<Home />} />
          <Route path="talent" element={<Roster />} />
          <Route path="talent/:slug" element={<TalentProfile />} />
          <Route path="work" element={<Work />} />
          <Route path="about" element={<About />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/:slug" element={<Article />} />
          <Route path="join" element={<Join />} />
          <Route path="contact" element={<Contact />} />
          <Route path="shortlist" element={<Shortlist />} />
          <Route path="styleguide" element={<Styleguide />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  )
}

const Router = import.meta.env.VITE_STATIC === '1' ? HashRouter : BrowserRouter

export function App() {
  return (
    <MotionConfig reducedMotion="user">
      <Router>
        <ShortlistProvider>
          <ToastProvider>
            <ScrollToTop />
            <a
              href="#main"
              onClick={(e) => {
                // A plain #main link would be read as a route under hash routing.
                e.preventDefault()
                const main = document.getElementById('main')
                main?.scrollIntoView({ block: 'start' })
                main?.focus({ preventScroll: true })
              }}
              className="skip-link z-[100] rounded-[10px] bg-bone px-4 py-2 text-void focus:fixed focus:top-3 focus:left-3"
            >
              Skip to content
            </a>
            <div className="flex min-h-svh flex-col">
              <Nav />
              <Pages />
              <Footer />
            </div>
          </ToastProvider>
        </ShortlistProvider>
      </Router>
    </MotionConfig>
  )
}
