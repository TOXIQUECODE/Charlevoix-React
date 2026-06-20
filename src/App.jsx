import { useState, useEffect } from 'react';
import StatusBar from './components/StatusBar';
import HomeScreen from './components/HomeScreen';
import ActivitesScreen from './components/ActivitesScreen';
import MagasinsScreen from './components/MagasinsScreen';
import CartesScreen from './components/CartesScreen';
import PecheScreen from './components/PecheScreen';
import RecettesScreen from './components/RecettesScreen';
import GalerieScreen from './components/GalerieScreen';
import ContactsScreen from './components/ContactsScreen';
import ReglagesScreen from './components/ReglagesScreen';
import NipScreen from './components/NipScreen';
import WelcomeScreen from './components/WelcomeScreen';

// L'import du Vortex
import { Vortex } from './ui/vortex';

export default function App() {
    const [pageActive, setPageActive] = useState('accueil');
    const [accesDebloque, setAccesDebloque] = useState(false);
    const [homeIcon, setHomeIcon] = useState(localStorage.getItem('ifruit-home-icon') || 'guimauve');

    const vuesProtegees = ['contacts', 'galerie', 'reglages'];

    useEffect(() => {
        const handleIconChange = (e) => setHomeIcon(e.detail);
        window.addEventListener('changeHomeIcon', handleIconChange);
        return () => window.removeEventListener('changeHomeIcon', handleIconChange);
    }, []);

    const gererNavigation = () => {
        if (vuesProtegees.includes(pageActive) && !accesDebloque) {
            return <NipScreen onUnlock={() => setAccesDebloque(true)} onCancel={() => setPageActive('accueil')} />;
        }

        return (
            <>
                {pageActive === 'accueil' && <HomeScreen onOuvrirApp={setPageActive} />}
                {pageActive === 'activites' && <ActivitesScreen />}
                {pageActive === 'magasins' && <MagasinsScreen />}
                {pageActive === 'cartes' && <CartesScreen />}
                {pageActive === 'peche' && <PecheScreen />}
                {pageActive === 'recettes' && <RecettesScreen />}
                {pageActive === 'galerie' && <GalerieScreen />}
                {pageActive === 'contacts' && <ContactsScreen />}
                {pageActive === 'reglages' && <ReglagesScreen />}
            </>
        );
    };

    // ==========================================
    // 4. LE RENDU VISUEL (MÉTHODE INDESTRUCTIBLE)
    // ==========================================
    return (
        <>
            {/* 1. LE FOND VORTEX (Forcé en arrière-plan total, sans bloquer les clics) */}
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -10, pointerEvents: 'none', background: '#050505' }}>
                <Vortex
                    backgroundColor="transparent"
                    rangeY={400}
                    particleCount={1000}
                    baseHue={220} /* Change ici pour la couleur */
                />
            </div>

            {/* 2. L'ÉCRAN D'ACCUEIL GLOBAL */}
            <WelcomeScreen />

            {/* 3. LE TÉLÉPHONE (Directement géré par ton #root CSS qui le centre parfaitement) */}
            <div className="gta-phone" id="ifruit-app">
                <div className="gta-screen">
                    <StatusBar />
                    {gererNavigation()}
                </div>

                <button
                    className="home-btn"
                    onClick={() => {
                        setPageActive('accueil');
                        window.dispatchEvent(new Event('retourHome'));
                    }}
                >
                    <img
                        src={`/${homeIcon}.png`}
                        alt="Bouton Home"
                        className="home-btn-image"
                        onError={(e) => {
                            console.error("Image non trouvée :", e.target.src);
                            e.target.style.display = 'none';
                        }}
                    />
                </button>
            </div>
        </>
    );
}