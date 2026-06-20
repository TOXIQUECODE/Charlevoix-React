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

// 👇 L'IMPORT DU VORTEX ICI
import { Vortex } from './ui/vortex';

export default function App() {
    // ==========================================
    // 1. LES ÉTATS (LA MÉMOIRE DU TÉLÉPHONE)
    // ==========================================
    const [pageActive, setPageActive] = useState('accueil');
    const [accesDebloque, setAccesDebloque] = useState(false);

    // On charge l'icône sauvegardée (ou guimauve par défaut)
    const [homeIcon, setHomeIcon] = useState(localStorage.getItem('ifruit-home-icon') || 'guimauve');

    const vuesProtegees = ['contacts', 'galerie', 'reglages'];

    // ==========================================
    // 2. LES EFFETS (ÉCOUTEURS)
    // ==========================================
    // On écoute le signal venant de la page Réglages pour changer l'icône
    useEffect(() => {
        const handleIconChange = (e) => setHomeIcon(e.detail);
        window.addEventListener('changeHomeIcon', handleIconChange);
        return () => window.removeEventListener('changeHomeIcon', handleIconChange);
    }, []);

    // ==========================================
    // 3. GESTION DE LA NAVIGATION & SÉCURITÉ
    // ==========================================
    const gererNavigation = () => {
        // Bloque l'accès si l'application est protégée et non débloquée
        if (vuesProtegees.includes(pageActive) && !accesDebloque) {
            return <NipScreen onUnlock={() => setAccesDebloque(true)} onCancel={() => setPageActive('accueil')} />;
        }

        // Affiche la bonne application
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
    // 4. LE RENDU VISUEL (LE TÉLÉPHONE ENVELOPPÉ DANS LE VORTEX)
    // ==========================================
    return (
        /* LE VORTEX REMPLACE LE "<>" ET L'ANCIEN FOND */
        <Vortex
            backgroundColor="black"
            rangeY={800}
            particleCount={500}
            baseHue={120} /* 120 = Vert. Modifie cette valeur pour d'autres couleurs ! */
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center overflow-hidden"
        >
            {/* L'ÉCRAN D'ACCUEIL GLOBAL (HORS TÉLÉPHONE) */}
            <WelcomeScreen />

            <div className="gta-phone" id="ifruit-app">
                <div className="gta-screen">
                    <StatusBar />
                    {gererNavigation()}
                </div>

                {/* LE NOUVEAU BOUTON HOME (Avec image) */}
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
                            e.target.style.display = 'none'; // Cache l'image brisée si erreur de fichier
                        }}
                    />
                </button>
            </div>
        </Vortex>
    );
}