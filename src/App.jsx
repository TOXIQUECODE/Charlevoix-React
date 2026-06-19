import { useState } from 'react';
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
import WelcomeScreen from './components/WelcomeScreen'; // <-- 1. ON L'IMPORTE ICI


export default function App() {
    const [pageActive, setPageActive] = useState('accueil');
    const [accesDebloque, setAccesDebloque] = useState(false);

    const vuesProtegees = ['contacts', 'galerie', 'reglages'];

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

    return (
        <>
            {/* 2. ON LE PLACE ICI, HORS DU TÉLÉPHONE POUR QU'IL PRENNE TOUT L'ÉCRAN */}
            <WelcomeScreen />

            <div className="gta-phone" id="ifruit-app">
                <div className="gta-screen">
                    <StatusBar />
                    {gererNavigation()}
                </div>
                <div className="home-btn-area">
                    <div className="home-btn" onClick={() => setPageActive('accueil')}></div>
                </div>
            </div>
        </>
    );
}