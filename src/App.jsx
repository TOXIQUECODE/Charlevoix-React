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
import NipScreen from './components/NipScreen'; // <-- Le nouveau videur

export default function App() {
    const [pageActive, setPageActive] = useState('accueil');
    const [accesDebloque, setAccesDebloque] = useState(false); // Le cadenas

    // Les apps sensibles
    const vuesProtegees = ['contacts', 'galerie', 'reglages'];

    // Fonction pour gérer la navigation sécurisée
    const gererNavigation = () => {
        if (vuesProtegees.includes(pageActive) && !accesDebloque) {
            return (
                <NipScreen
                    onUnlock={() => setAccesDebloque(true)}
                    onCancel={() => setPageActive('accueil')}
                />
            );
        }

        // Sinon, on affiche les pages normalement
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
        <div className="gta-phone" id="ifruit-app">
            <div className="gta-screen">
                <StatusBar />
                {gererNavigation()}
            </div>
            <div className="home-btn-area">
                <div className="home-btn" onClick={() => setPageActive('accueil')}></div>
            </div>
        </div>
    );
}