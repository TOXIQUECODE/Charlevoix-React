import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Fish, ChevronRight } from 'lucide-react';

export default function PecheScreen() {
    const [spots, setSpots] = useState([]);
    const [chargement, setChargement] = useState(true);

    const couleursElectriques = ['#3498db', '#2ecc71', '#f1c40f', '#e67e22', '#9b59b6'];

    useEffect(() => {
        async function chercherSpots() {
            const { data } = await supabase.from('peche').select('*');
            if (data) setSpots(data);
            setChargement(false);
        }
        chercherSpots();
    }, []);

    return (
        <div className="vue active app-page" style={{ background: 'transparent' }}>
            <header className="app-header" style={{ background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <h2 style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', color: 'white' }}>🎣 Spots de Pêche</h2>
            </header>

            <div className="app-content">
                <details style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '15px', borderRadius: '14px', marginBottom: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(15px)', color: 'white' }}>
                    <summary style={{ fontWeight: 'bold', cursor: 'pointer', outline: 'none', display: 'flex', justifyContent: 'space-between' }}>
                        ⚠️ Avertissement ACM Gouffre <span style={{color: 'rgba(255,255,255,0.5)', fontSize: '12px'}}>▼</span>
                    </summary>
                    <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: '10px', marginTop: '10px', borderLeft: '3px solid #e74c3c', fontSize: '13px', color: 'rgba(255, 255, 255, 0.85)' }}>
                        <p style={{ marginBottom: '8px' }}>Droit d'accès quotidien requis pour la pêche sur la rivière du Gouffre.</p>
                        <p><strong>Non requis :</strong> Fleuve Saint-Laurent, lacs privés ou zones sans gestion ACM.</p>
                    </div>
                </details>

                {chargement ? (
                    <div className="loading" style={{ color: 'white' }}>Scan des rivières... 🌊</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {spots.map((spot, index) => {
                            const couleurActuelle = couleursElectriques[index % couleursElectriques.length];

                            return (
                                <div key={index} className="electric-card-wrapper" style={{ '--electric-color': couleurActuelle }}>
                                    <div className="electric-card-inner">
                                        <div className="glass-card-image-placeholder" style={{ background: 'rgba(0,0,0,0.6)' }}>
                                            <Fish size={24} color={couleurActuelle} style={{ filter: `drop-shadow(0 0 5px ${couleurActuelle})` }} />
                                        </div>

                                        <div className="glass-card-content">
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ color: 'white', fontWeight: 'bold', fontSize: '15px' }}>{spot.endroit}</div>
                                                <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', color: couleurActuelle, padding: '2px 6px', borderRadius: '8px' }}>
                                                    {spot.rarete || 'Commun'}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                                                Cible: <span style={{color: 'white'}}>{spot.poisson}</span> <br/>
                                                Appât: <span style={{color: 'white'}}>{spot.appat}</span>
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