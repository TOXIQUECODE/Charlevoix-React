import { useEffect, useState } from 'react';
import AppIcon from './AppIcon';
import { supabase } from '../supabaseClient';
import { TreePine, ShoppingBag, MapPin, Fish, Utensils, User, Camera, Settings, Rocket, Sun, CloudSun, Cloud, CloudRain, CloudLightning, Snowflake, Moon } from 'lucide-react';


function WidgetMeteo({ onClick }) {
    const [meteo, setMeteo] = useState({ temp: '--', condition: 'Chargement...', icon: <CloudSun size={26} color="#f1c40f" /> });

    useEffect(() => {
        // Coordonnées exactes de Baie-Saint-Paul (Lat: 47.44, Long: -70.50)
        const url = "https://api.open-meteo.com/v1/forecast?latitude=47.44&longitude=-70.50&current=temperature_2m,is_day,weather_code&timezone=America%2FNew_York";

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const temp = Math.round(data.current.temperature_2m);
                const code = data.current.weather_code;
                const isDay = data.current.is_day === 1;

                // Dictionnaire des codes météo (WMO) pour choisir la bonne icône et le bon texte
                let conditionTexte = "Inconnu";
                let IconeMeteo = <Cloud size={26} color="#bdc3c7" />;

                if (code === 0) {
                    conditionTexte = "Dégagé";
                    IconeMeteo = isDay ? <Sun size={26} color="#f1c40f" /> : <Moon size={26} color="#f39c12" />;
                } else if (code === 1 || code === 2 || code === 3) {
                    conditionTexte = "Partiellement nuageux";
                    IconeMeteo = isDay ? <CloudSun size={26} color="#f1c40f" /> : <Cloud size={26} color="#bdc3c7" />;
                } else if (code >= 45 && code <= 48) {
                    conditionTexte = "Brouillard";
                    IconeMeteo = <Cloud size={26} color="#95a5a6" />;
                } else if (code >= 51 && code <= 67) {
                    conditionTexte = "Pluie";
                    IconeMeteo = <CloudRain size={26} color="#3498db" />;
                } else if (code >= 71 && code <= 86) {
                    conditionTexte = "Neige";
                    IconeMeteo = <Snowflake size={26} color="#ecf0f1" />;
                } else if (code >= 95) {
                    conditionTexte = "Orages";
                    IconeMeteo = <CloudLightning size={26} color="#e74c3c" />;
                }

                setMeteo({ temp, condition: conditionTexte, icon: IconeMeteo });
            })
            .catch(err => {
                console.error("Erreur météo:", err);
                setMeteo({ temp: '?', condition: 'Hors ligne', icon: <Cloud size={26} color="#e74c3c" /> });
            });
    }, []);

    return (
        <div className="gta-widget" onClick={onClick} style={{ cursor: 'pointer' }}>
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                width: '45px', height: '45px',
                background: 'rgba(255, 255, 255, 0.1)', borderRadius: '12px'
            }}>
                {meteo.icon}
            </div>

            <div className="widget-info">
                <div style={{ fontWeight: '600', fontSize: '15px', color: '#ffffff' }}>
                    Météo Charlevoix ↗
                </div>
                <div style={{ fontSize: '13px', color: '#8ce99a', marginTop: '3px' }}>
                    {meteo.temp}°C - {meteo.condition}
                </div>
            </div>
        </div>
    );
}

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

                <WidgetMeteo onClick={() => onOuvrirApp('meteo')} />

            </div>
        </div>
    );
}