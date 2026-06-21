import { useEffect, useState, useRef } from 'react';
import AppIcon from './AppIcon';
import { supabase } from '../supabaseClient';
import { TreePine, ShoppingBag, Map, Fish, Utensils, User, Camera, Settings, Rocket, Sun, CloudSun, Cloud, CloudRain, CloudLightning, Snowflake, Moon, Crown } from 'lucide-react';

// ==============================================================
// 1. LE COMPOSANT WIDGET METEO (Maintenant Électrique !)
// ==============================================================
function WidgetMeteo({ onClick }) {
    const [meteo, setMeteo] = useState({
        temp: '--', condition: 'Chargement...', icon: <CloudSun size={26} color="#f1c40f" />, couleur: '#f1c40f'
    });

    useEffect(() => {
        const url = "https://api.open-meteo.com/v1/forecast?latitude=47.44&longitude=-70.50&current=temperature_2m,is_day,weather_code&timezone=America%2FNew_York";

        fetch(url)
            .then(res => res.json())
            .then(data => {
                const temp = Math.round(data.current.temperature_2m);
                const code = data.current.weather_code;
                const isDay = data.current.is_day === 1;

                let conditionTexte = "Inconnu";
                let IconeMeteo = <Cloud size={26} color="#bdc3c7" />;
                let lueurCouleur = '#f1c40f'; // Jaune par défaut

                if (code === 0) {
                    conditionTexte = "Dégagé";
                    IconeMeteo = isDay ? <Sun size={26} color="#f1c40f" /> : <Moon size={26} color="#f39c12" />;
                    lueurCouleur = isDay ? '#f1c40f' : '#f39c12';
                } else if (code === 1 || code === 2 || code === 3) {
                    conditionTexte = "Part. nuageux";
                    IconeMeteo = isDay ? <CloudSun size={26} color="#f1c40f" /> : <Cloud size={26} color="#bdc3c7" />;
                    lueurCouleur = isDay ? '#f1c40f' : '#bdc3c7';
                } else if (code >= 45 && code <= 48) {
                    conditionTexte = "Brouillard";
                    IconeMeteo = <Cloud size={26} color="#95a5a6" />;
                    lueurCouleur = '#95a5a6';
                } else if (code >= 51 && code <= 67) {
                    conditionTexte = "Pluie";
                    IconeMeteo = <CloudRain size={26} color="#3498db" />;
                    lueurCouleur = '#3498db'; // Bleu électrique
                } else if (code >= 71 && code <= 86) {
                    conditionTexte = "Neige";
                    IconeMeteo = <Snowflake size={26} color="#ecf0f1" />;
                    lueurCouleur = '#ecf0f1';
                } else if (code >= 95) {
                    conditionTexte = "Orages";
                    IconeMeteo = <CloudLightning size={26} color="#e74c3c" />;
                    lueurCouleur = '#e74c3c'; // Rouge électrique
                }

                setMeteo({ temp, condition: conditionTexte, icon: IconeMeteo, couleur: lueurCouleur });
            })
            .catch(err => {
                console.error("Erreur météo:", err);
            });
    }, []);

    return (
        <div className="electric-card-wrapper" onClick={onClick} style={{ '--electric-color': meteo.couleur, marginBottom: '15px' }}>
            <div className="electric-card-inner" style={{ padding: '12px 15px', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', background: 'rgba(0,0,0,0.5)', borderRadius: '12px' }}>
                    {meteo.icon}
                </div>
                <div className="widget-info" style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', color: 'white' }}>Météo Charlevoix ↗</div>
                    <div style={{ fontSize: '13px', color: meteo.couleur, marginTop: '3px' }}>
                        {meteo.temp}°C - {meteo.condition}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==============================================================
// 2. L'ÉCRAN D'ACCUEIL AVEC SWIPE & APPLICATIONS ÉLECTRIQUES
// ==============================================================
export default function HomeScreen({ onOuvrirApp }) {
    const [chaletInfo, setChaletInfo] = useState("Recherche signal GPS...");
    const [activePage, setActivePage] = useState(0);
    const sliderRef = useRef(null);

    const handleScroll = (e) => {
        const pageIndex = Math.round(e.target.scrollLeft / e.target.clientWidth);
        setActivePage(pageIndex);
    };

    useEffect(() => {
        const glisserVersPage1 = () => {
            if (sliderRef.current) sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        };
        window.addEventListener('retourHome', glisserVersPage1);
        return () => window.removeEventListener('retourHome', glisserVersPage1);
    }, []);

    useEffect(() => {
        async function obtenirGPS() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(async (position) => {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;
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
                    }
                }, () => setChaletInfo("Accès GPS refusé"));
            }
        }
        obtenirGPS();
    }, []);

    return (
        <div className="main-wrapper">
            <div className="home-slider" onScroll={handleScroll} ref={sliderRef}>

                {/* ================= PAGE 1 ================= */}
                <div className="home-page">
                    <div className="app-grid">
                        {/* On envoie la prop 'color' à AppIcon pour définir la bordure électrique */}
                        <AppIcon color="#2ecc71" icon={<TreePine size={34} color="#2ecc71" />} name="Activités" onClick={() => onOuvrirApp('activites')} />
                        <AppIcon color="#f39c12" icon={<ShoppingBag size={34} color="#f39c12" />} name="Magasins" onClick={() => onOuvrirApp('magasins')} />
                        <AppIcon color="#e74c3c" icon={<Map size={34} color="#e74c3c" />} name="Cartes" onClick={() => onOuvrirApp('cartes')} />
                        <AppIcon color="#3498db" icon={<Fish size={34} color="#3498db" />} name="Pêche" onClick={() => onOuvrirApp('peche')} />
                        <AppIcon color="#d35400" icon={<Utensils size={34} color="#d35400" />} name="Recettes" onClick={() => onOuvrirApp('recettes')} />
                        <AppIcon color="#1abc9c" icon={<User size={34} color="#1abc9c" />} name="Contacts" onClick={() => onOuvrirApp('contacts')} />
                        <AppIcon color="#e6c280" icon={<Crown size={34} color="#F9F295" />} name="Project X" onClick={() => onOuvrirApp('projectx')}
                        />
                    </div>

                    {/* WIDGETS DE LA PAGE 1 */}
                    <div className="widgets-container" style={{ display: 'flex', flexDirection: 'column', padding: '0 20px', marginTop: 'auto', marginBottom: '10px' }}>

                        {/* Widget Chalet (Vert électrique) */}
                        <div className="electric-card-wrapper" onClick={() => window.open('https://hotelalamaison.ca/chalet/ou-lon-se-cree-des-souvenirs/', '_blank')} style={{ '--electric-color': '#2ecc71', marginBottom: '15px' }}>
                            <div className="electric-card-inner" style={{ padding: '12px 15px', gap: '15px' }}>
                                <img src="/chalet.png" alt="Chalet" style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '10px' }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: 'white', fontWeight: 'bold', fontSize: '14px' }}>Où l'on se crée des souvenirs ↗</div>
                                    <div style={{ color: '#2ecc71', fontSize: '12px', marginTop: '3px' }}>
                                        {chaletInfo}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Widget Météo */}
                        <WidgetMeteo onClick={() => window.open('https://www.meteomedia.com/fr/ville/ca/quebec/baie-saint-paul/actuelle', '_blank')} />
                    </div>
                </div>

                {/* ================= PAGE 2 ================= */}
                <div className="home-page">
                    <div className="app-grid">
                        <AppIcon color="#9b59b6" icon={<Camera size={34} color="#9b59b6" />} name="Galerie" onClick={() => onOuvrirApp('galerie')} />
                        <AppIcon color="#95a5a6" icon={<Settings size={34} color="#95a5a6" />} name="Réglages" onClick={() => onOuvrirApp('reglages')} />
                        <AppIcon color="#ff4757" icon={<Rocket size={34} color="#ff4757" />} name="Projet X" onClick={() => onOuvrirApp('secret')} />
                    </div>
                </div>

            </div>

            <div className="pagination-dots">
                <div className={`dot ${activePage === 0 ? 'active' : ''}`}></div>
                <div className={`dot ${activePage === 1 ? 'active' : ''}`}></div>
            </div>
        </div>
    );
}