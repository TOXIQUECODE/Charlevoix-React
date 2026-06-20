import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Map, ChevronRight, Navigation } from 'lucide-react';

export default function CartesScreen() {
    const [lieux, setLieux] = useState([]);
    const [chargement, setChargement] = useState(true);

    // Notre palette de couleurs électriques (Rouge, Jaune, Bleu, Violet, Vert)
    const couleursElectriques = ['#ff4757', '#f1c40f', '#3498db', '#9b59b6', '#2ecc71'];

    useEffect(() => {
        async function chercherLieux() {
            const { data } = await supabase.from('localisation').select('*');
            if (data) setLieux(data);
            setChargement(false);
        }
        chercherLieux();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>📍 Cartes GPS</h2>
            </header>

            <div className="app-content">
                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Signal satellite... 🛰️</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>

                        {/* ON BOUCLE SUR LES VRAIES DONNÉES ! */}
                        {lieux.map((lieu, index) => {
                            // On choisit une couleur en fonction de l'index
                            const couleurActuelle = couleursElectriques[index % couleursElectriques.length];

                            return (
                                /* Le conteneur avec la bordure animée */
                                <div key={index} className="electric-card-wrapper" style={{ '--electric-color': couleurActuelle }}>

                                    {/* L'intérieur de la carte */}
                                    <div className="electric-card-inner">
                                        <div className="glass-card-image-placeholder" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                            <Map size={24} color={couleurActuelle} style={{ filter: `drop-shadow(0 0 5px ${couleurActuelle})` }} />
                                        </div>

                                        <div className="glass-card-content">
                                            {/* Le vrai nom du lieu */}
                                            <div style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>{lieu.nom}</div>

                                            {/* Tes boutons GPS sous forme de petits badges */}
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                                                {lieu.lien_google && (
                                                    <a href={lieu.lien_google} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(52, 168, 83, 0.2)', color: '#2ecc71', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', textDecoration: 'none' }}>
                                                        <Navigation size={10} /> Google
                                                    </a>
                                                )}
                                                {lieu.lien_apple && (
                                                    <a href={lieu.lien_apple} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255, 255, 255, 0.1)', color: '#ccc', padding: '4px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 'bold', textDecoration: 'none' }}>
                                                        <Navigation size={10} /> Apple
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="glass-card-arrow">
                                            <ChevronRight size={20} color={couleurActuelle} style={{ opacity: 0.5 }} />
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                )}
            </div>
        </div>
    );
}