import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import MascotHelper from './components/MascotHelper.jsx';
import GuidedTour from './components/GuidedTour.jsx';
import CompareTray from './components/CompareTray.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import Loader from './components/Loader.jsx';

const Home = lazy(() => import('./pages/Home.jsx'));
const Catalog = lazy(() => import('./pages/Catalog.jsx'));
const FlowerDetails = lazy(() => import('./pages/FlowerDetails.jsx'));
const Favorites = lazy(() => import('./pages/Favorites.jsx'));
const Compare = lazy(() => import('./pages/Compare.jsx'));
const Calendar = lazy(() => import('./pages/Calendar.jsx'));
const Tips = lazy(() => import('./pages/Tips.jsx'));
const Gifts = lazy(() => import('./pages/Gifts.jsx'));
const Environments = lazy(() => import('./pages/Environments.jsx'));
const About = lazy(() => import('./pages/About.jsx'));
const NotFound = lazy(() => import('./pages/NotFound.jsx'));

export default function App() {
  return (
    <div className="app">
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <ScrollToTop />
      <Navbar />
      <main id="main" className="app__main">
        <Suspense fallback={<Loader label="Abriendo el jardín…" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalog />} />
            <Route path="/flor/:id" element={<FlowerDetails />} />
            <Route path="/favoritos" element={<Favorites />} />
            <Route path="/comparar" element={<Compare />} />
            <Route path="/calendario" element={<Calendar />} />
            <Route path="/consejos" element={<Tips />} />
            <Route path="/regalar" element={<Gifts />} />
            <Route path="/ambientes" element={<Environments />} />
            <Route path="/acerca" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <CompareTray />
      <MascotHelper />
      <GuidedTour />
    </div>
  );
}
