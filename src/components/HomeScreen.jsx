import { useEffect, useState } from 'react';
import AppIcon from 'src/components/AppIcon.jsx';
import { supabase } from '../supabaseClient';

export default function HomeScreen({ onOuvrirApp }) {
    const [chaletInfo, setChaletInfo] = useState("Recherche signal GPS...");

    useEffect(() => {
        // Restaurer le fond d'écran
        const savedBg = localStorage.getItem('ifruit-bg');
        if (savedBg) {
            document.querySelector('.gta-home-bg').style.background = savedBg;
        }

        // Logique du GPS
        async function obtenirGPS() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // On va chercher le chalet dans Supabase
                    const { data } = await supabase.from('localisation').select('lat, lng').ilike('nom', '%chalet%').single();

                    if (data && data.lat && data.lng) {
                        try {
                            const url = `https://router.project-osrm.org/route/v1/driving/${userLng},${userLat};${data.lng},${data.lat}?overview=false`;
                            const rep = await fetch(url);
                            const osrmData = await rep.json();

                            if (osrmData.code === 'Ok' && osrmData.routes.length > 0) {
                                const distanceKm = (osrmData.routes[0].distance / 1000).toFixed(1) + " km";
                                const dureeMinutes = Math.round(osrmData.routes[0].duration / 60);
                                let etaFormat = dureeMinutes >= 60 ? `${Math.floor(dureeMinutes / 60)}h ${dureeMinutes % 60}m` : `${dureeMinutes} min`;
                                setChaletInfo(`${distanceKm} | ${etaFormat}`);
                            }
                        } catch (e) {
                            setChaletInfo("-- km | -- min");
                        }
                    } else {
                        setChaletInfo("Coordonnées chalet absentes");
                    }
                }, () => {
                    setChaletInfo("Accès GPS refusé");
                });
            }
        }

        obtenirGPS();
    }, []);

    return (
        <div className="vue active gta-home-bg">
            <div className="app-grid">
                <AppIcon icon="🌲" name="Activités" onClick={() => onOuvrirApp('activites')} />
                <AppIcon icon="🛍️" name="Magasins" onClick={() => onOuvrirApp('magasins')} />
                <AppIcon icon="📍" name="Cartes" onClick={() => onOuvrirApp('cartes')} />
                <AppIcon icon="🎣" name="Pêche" onClick={() => onOuvrirApp('peche')} />
                <AppIcon icon="🍳" name="Recettes" onClick={() => onOuvrirApp('recettes')} />
                <AppIcon icon="📸" name="Galerie" onClick={() => onOuvrirApp('galerie')} />
                <AppIcon icon="👤" name="Contacts" onClick={() => onOuvrirApp('contacts')} />
                <AppIcon icon="⚙️" name="Réglages" onClick={() => onOuvrirApp('reglages')} />

                {/* Ajout de la fusée pour ton futur projet */}
                <AppIcon icon="🚀" name="Projet X" onClick={() => onOuvrirApp('secret')} />
            </div>

            <div
                className="gta-widget"
                /* C'EST ICI QU'ON AJOUTE LE LIEN VERS LA CARTE */
                onClick={() => window.open('https://hotelalamaison.ca/chalet/ou-lon-se-cree-des-souvenirs/', '_blank')}
                style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
            >
                <div style={{ fontSize: '32px' }}>🏕️</div>
                <div>
                    <div><strong>Où l'on se crée des souvenirs ↗</strong></div>
                    <div style={{ color: '#2ecc71', fontSize: '12px', marginTop: '3px', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                        {chaletInfo}
                    </div>
                </div>
            </div>

            <div
                className="gta-widget"
                /* C'EST ICI QU'ON AJOUTE LE LIEN VERS LA MÉTÉO */
                onClick={() => window.open('https://www.meteomedia.com/fr/ville/ca/quebec/baie-saint-paul/7-jours', '_blank')}
                style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '-15px', cursor: 'pointer' }}
            >
                <div style={{ fontSize: '32px' }}>⛅</div>
                <div>
                    <div><strong>Météo Charlevoix ↗</strong></div>
                    <div style={{ color: '#3498db', fontSize: '12px', marginTop: '3px' }}>22°C - Partiellement nuageux</div>
                </div>
            </div>
        </div>
    );
}