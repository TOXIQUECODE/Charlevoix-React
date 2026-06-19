import { useEffect, useState } from 'react';
import AppIcon from './AppIcon';
import { supabase } from '../supabaseClient';
import { TreePine, ShoppingBag, Map, Fish, Utensils, Camera, CloudSun, User, Settings, Rocket } from 'lucide-react';




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
        <div className="main-wrapper">
            <div className="grid-background"></div>

            <div className="vue active gta-home-bg">
                <div className="app-grid">
                    {/* On remplace l'icône texte par le composant SVG avec la couleur voulue */}
                    <AppIcon icon={<TreePine size={34} color="#2ecc71" />} name="Activités" onClick={() => onOuvrirApp('activites')} />
                    <AppIcon icon={<ShoppingBag size={34} color="#f39c12" />} name="Magasins" onClick={() => onOuvrirApp('magasins')} />
                    <AppIcon icon={<Map size={34} color="#e74c3c" />} name="Cartes" onClick={() => onOuvrirApp('cartes')} />
                    <AppIcon icon={<Fish size={34} color="#3498db" />} name="Pêche" onClick={() => onOuvrirApp('peche')} />
                    <AppIcon icon={<Utensils size={34} color="#d35400" />} name="Recettes" onClick={() => onOuvrirApp('recettes')} />
                    <AppIcon icon={<Camera size={34} color="#9b59b6" />} name="Galerie" onClick={() => onOuvrirApp('galerie')} />
                    <AppIcon icon={<User size={34} color="#34495e" />} name="Contacts" onClick={() => onOuvrirApp('contacts')} />
                    <AppIcon icon={<Settings size={34} color="#7f8c8d" />} name="Réglages" onClick={() => onOuvrirApp('reglages')} />

                    <AppIcon icon={<Rocket size={34} color="#ff4757" />} name="WIP" onClick={() => onOuvrirApp('secret')} />
                </div>
                <div
                    className="gta-widget"
                    /* C'EST ICI QU'ON AJOUTE LE LIEN VERS LA CARTE */
                    onClick={() => window.open('https://hotelalamaison.ca/chalet/ou-lon-se-cree-des-souvenirs/', '_blank')}
                    style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                >
                    <img
                        src="/chalet.png"
                        alt="Chalet"
                        className="widget-image"
                        style={{
                            width: '65px',
                            height: '65px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />

                    <div>
                        <div><strong>Où l'on se crée des souvenirs ↗</strong></div>
                        <div style={{ color: '#2ecc71', fontSize: '12px', marginTop: '3px', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            {chaletInfo}
                        </div>
                    </div>
                </div>
                <div
                    className="gta-widget"
                    /* C'EST ICI QU'ON AJOUTE LE LIEN VERS LA CARTE */
                    onClick={() => window.open('https://hotelalamaison.ca/chalet/ou-lon-se-cree-des-souvenirs/', '_blank')}
                    style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}
                >
                    <img
                        src="/chalet.png"
                        alt="Chalet"
                        className="widget-image"
                        style={{
                            width: '65px',
                            height: '65px',
                            objectFit: 'cover',
                            borderRadius: '8px'
                        }}
                    />

                    <div>
                        <div><strong>Où l'on se crée des souvenirs ↗</strong></div>
                        <div style={{ color: '#2ecc71', fontSize: '12px', marginTop: '3px', textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                            {chaletInfo}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}